// stripe-webhook.js - No npm packages, uses crypto built-in for signature verification
const crypto = require('crypto');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const body = event.body;

  // Verify webhook signature
  if (webhookSecret && sig) {
    try {
      const timestamp = sig.split(',').find(p => p.startsWith('t=')).split('=')[1];
      const signature = sig.split(',').find(p => p.startsWith('v1=')).split('=')[1];
      const signedPayload = timestamp + '.' + body;
      const expectedSig = crypto.createHmac('sha256', webhookSecret).update(signedPayload).digest('hex');
      if (expectedSig !== signature) {
        return { statusCode: 400, body: 'Invalid signature' };
      }
    } catch (err) {
      console.error('Webhook signature error:', err);
      return { statusCode: 400, body: 'Signature error' };
    }
  }

  let stripeEvent;
  try {
    stripeEvent = JSON.parse(body);
  } catch (err) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  console.log('Stripe event:', stripeEvent.type);

  // Handle subscription events
  switch (stripeEvent.type) {
    case 'checkout.session.completed': {
      const session = stripeEvent.data.object;
      console.log('Checkout completed:', session.customer_email, session.subscription);
      break;
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = stripeEvent.data.object;
      console.log('Subscription updated:', sub.status, sub.customer);
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = stripeEvent.data.object;
      console.log('Subscription cancelled:', sub.customer);
      break;
    }
    default:
      console.log('Unhandled event:', stripeEvent.type);
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
