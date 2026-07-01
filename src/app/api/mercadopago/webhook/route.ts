import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[MP Webhook] POST received:', JSON.stringify(body));
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
  return NextResponse.json({ received: true });
}
