// netlify/functions/stripe-webhook.js
// Handles Stripe subscription events to grant/revoke Pro access

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  // Handle subscription events
  switch (stripeEvent.type) {

    case 'checkout.session.completed': {
      const session = stripeEvent.data.object;
      const customerEmail = session.customer_email || session.customer_details?.email;
      const customerId = session.customer;
      const subscriptionId = session.subscription;
      console.log(`✅ New Pro subscriber: ${customerEmail} | Customer: ${customerId}`);
      // TODO: Store in database (Supabase/Netlify DB) and grant Pro access
      // await grantProAccess(customerEmail, customerId, subscriptionId);
      break;
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = stripeEvent.data.object;
      const status = subscription.status;
      const customerId = subscription.customer;
      console.log(`📋 Subscription ${status} for customer: ${customerId}`);
      // TODO: Update user's plan status in database
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = stripeEvent.data.object;
      const customerId = subscription.customer;
      console.log(`❌ Subscription cancelled for customer: ${customerId}`);
      // TODO: Revoke Pro access in database
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = stripeEvent.data.object;
      const customerEmail = invoice.customer_email;
      console.log(`💳 Payment failed for: ${customerEmail}`);
      // TODO: Send dunning email / suspend access after grace period
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = stripeEvent.data.object;
      const customerEmail = invoice.customer_email;
      console.log(`💰 Payment succeeded for: ${customerEmail}`);
      break;
    }

    default:
      console.log(`Unhandled event type: ${stripeEvent.type}`);
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
