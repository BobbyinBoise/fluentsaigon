// create-checkout.js - Uses Stripe API directly via fetch, no npm needed

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const params = new URLSearchParams(event.queryStringParameters);
    const plan = params.get('plan') || 'pro_monthly';
    const email = params.get('email') || '';
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const siteUrl = process.env.URL || 'https://fluentsaigon.com';

    const subscriptionPlans = {
      pro_monthly: process.env.STRIPE_PRICE_MONTHLY,
      pro_annual:  process.env.STRIPE_PRICE_ANNUAL,
    };
    const oneTimePlans = {
      lifetime:    process.env.STRIPE_PRICE_LIFETIME,
      travel_prep: process.env.STRIPE_PRICE_TRAVEL_PREP,
    };

    const isSubscription = !!subscriptionPlans[plan];
    const priceId = subscriptionPlans[plan] || oneTimePlans[plan];

    if (!priceId) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid plan' }) };
    }

    // Build form data for Stripe
    const formData = new URLSearchParams();
    formData.append('mode', isSubscription ? 'subscription' : 'payment');
    formData.append('payment_method_types[]', 'card');
    formData.append('line_items[0][price]', priceId);
    formData.append('line_items[0][quantity]', '1');
    formData.append('success_url', `${siteUrl}/pages/success.html?session_id={CHECKOUT_SESSION_ID}`);
    formData.append('cancel_url', `${siteUrl}/pages/pricing.html`);
    formData.append('allow_promotion_codes', 'true');
    if (email) formData.append('customer_email', email);
    if (isSubscription) formData.append('subscription_data[trial_period_days]', '7');

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const session = await response.json();

    if (!response.ok) {
      throw new Error(session.error?.message || 'Failed to create checkout session');
    }

    return {
      statusCode: 302,
      headers: { ...headers, Location: session.url },
      body: '',
    };
  } catch (error) {
    console.error('create-checkout error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
