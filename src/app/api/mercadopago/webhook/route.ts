import { NextRequest, NextResponse } from 'next/server';
import { updateOrderToPaid } from '@/services/order.service';

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN ?? '';

/**
 * Mercado Pago webhook — receives payment notifications.
 *
 * Handles both:
 *   - POST with JSON body (type: "payment", data.id)
 *   - GET with query params (topic=merchant_order, id=...)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[MP Webhook] POST received:', JSON.stringify(body));

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
    // We'll process in the background — respond 200 immediately
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

    // Find approved payments
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
