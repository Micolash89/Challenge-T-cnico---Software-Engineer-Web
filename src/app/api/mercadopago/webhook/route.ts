import { NextRequest, NextResponse } from 'next/server';
import { updateOrderToPaid } from '@/services/order.service';
import crypto from 'node:crypto';

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN ?? '';
const MP_WEBHOOK_SECRET = process.env.MP_WEBHOOK_SECRET ?? '';

function verifySignature(
  body: Record<string, unknown>,
  xSignature: string,
  xRequestId: string,
): boolean {
  if (!MP_WEBHOOK_SECRET) return true;

  const parts = Object.fromEntries(
    xSignature.split(',').map((p) => {
      const [k, ...v] = p.split('=');
      return [k.trim(), v.join('=').trim()];
    }),
  );
  const ts = parts['ts'];
  const receivedV1 = parts['v1'];
  if (!ts || !receivedV1) return false;

  const dataId = (body.data as Record<string, unknown> | undefined)?.id as string | undefined;
  if (!dataId) return false;

  const template = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const computedV1 = crypto
    .createHmac('sha256', MP_WEBHOOK_SECRET)
    .update(template)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(computedV1), Buffer.from(receivedV1));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[MP Webhook] POST received:', JSON.stringify(body));

    const xSignature = request.headers.get('x-signature') ?? '';
    const xRequestId = request.headers.get('x-request-id') ?? '';

    if (!verifySignature(body, xSignature, xRequestId)) {
      console.warn('[MP Webhook] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const topic = body.type ?? body.action;
    const resourceId = body.data?.id ?? body.data?.resource_id;

    if (topic === 'payment' && resourceId) {
      await processPayment(resourceId);
    } else if (topic === 'merchant_order' && resourceId) {
      await processMerchantOrder(resourceId);
    } else {
      console.log('[MP Webhook] Unhandled topic:', topic);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[MP Webhook] Error:', err);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic');
  const id = searchParams.get('id');

  console.log(`[MP Webhook] GET received: topic=${topic}, id=${id}`);

  if (topic === 'merchant_order' && id) {
    void processMerchantOrder(id);
  } else if (topic === 'payment' && id) {
    void processPayment(id);
  }

  return NextResponse.json({ received: true });
}

async function processPayment(paymentId: string) {
  try {
    const res = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        },
      },
    );

    if (!res.ok) {
      console.error(`[MP Webhook] Failed to fetch payment ${paymentId}:`, res.status);
      return;
    }

    const payment = await res.json();
    console.log(`[MP Webhook] Payment ${paymentId}: status=${payment.status}`);

    if (payment.status === 'approved') {
      const orderId = payment.external_reference;
      if (orderId) {
        await updateOrderToPaid(orderId, paymentId);
        console.log(`[MP Webhook] Order ${orderId} updated to pagado`);
      }
    }
  } catch (err) {
    console.error(`[MP Webhook] Error processing payment ${paymentId}:`, err);
  }
}

async function processMerchantOrder(merchantOrderId: string) {
  try {
    const res = await fetch(
      `https://api.mercadopago.com/merchant_orders/${merchantOrderId}`,
      {
        headers: {
          Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        },
      },
    );

    if (!res.ok) {
      console.error(
        `[MP Webhook] Failed to fetch merchant_order ${merchantOrderId}:`,
        res.status,
      );
      return;
    }

    const order = await res.json();
    console.log(
      `[MP Webhook] Merchant order ${merchantOrderId}: status=${order.status}`,
    );

    const approvedPayment = order.payments?.find(
      (p: { status: string }) => p.status === 'approved',
    );

    if (approvedPayment && order.external_reference) {
      await updateOrderToPaid(order.external_reference, approvedPayment.id);
      console.log(
        `[MP Webhook] Order ${order.external_reference} updated to pagado via merchant_order`,
      );
    }
  } catch (err) {
    console.error(
      `[MP Webhook] Error processing merchant_order ${merchantOrderId}:`,
      err,
    );
  }
}
