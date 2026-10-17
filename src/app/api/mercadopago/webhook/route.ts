import { NextRequest, NextResponse } from 'next/server';
import { WebhookSignatureValidator } from 'mercadopago';
import { markAsPaidFromWebhook } from '@/services/order.service';

const SIGNATURE_TOLERANCE_SECONDS = 300;

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dataId = searchParams.get('data.id') ?? searchParams.get('id');
  const type = searchParams.get('type');

  const xSignature = request.headers.get('x-signature');
  const xRequestId = request.headers.get('x-request-id');

  try {
    WebhookSignatureValidator.validate({
      xSignature,
      xRequestId,
      dataId,
      secret: process.env.MP_WEBHOOK_SECRET ?? '',
      toleranceSeconds: SIGNATURE_TOLERANCE_SECONDS,
    });
  } catch (err) {
    console.error('[MP Webhook] Invalid signature:', err);
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
  }

  if (type !== 'payment' || !dataId) {
    return NextResponse.json({ received: true });
  }

  const paymentResponse = await fetch(
    `https://api.mercadopago.com/v1/payments/${dataId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN ?? ''}`,
      },
    },
  );

  if (!paymentResponse.ok) {
    console.error('[MP Webhook] Failed to fetch payment:', paymentResponse.status);
    return NextResponse.json({ error: 'Payment lookup failed' }, { status: 502 });
  }

  const payment = await paymentResponse.json();

  if (payment.status !== 'approved') {
    return NextResponse.json({ received: true });
  }

  const orderId = payment.external_reference;
  if (!orderId) {
    console.error('[MP Webhook] Missing external_reference for payment', dataId);
    return NextResponse.json({ received: true });
  }

  try {
    await markAsPaidFromWebhook(orderId);
  } catch (err) {
    console.error('[MP Webhook] Failed to mark order as paid:', err);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
