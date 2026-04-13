// verify-session.js - Uses Stripe API directly via fetch, no npm needed

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  const { session_id } = event.queryStringParameters || {};
  if (!session_id) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'No session ID' }) };
  }

  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    
    // Call Stripe API directly via fetch
    const response = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${session_id}?expand[]=subscription`,
      {
        headers: {
          'Authorization': `Bearer ${stripeKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Stripe API error');
    }

    const session = await response.json();
    const email = session.customer_email || session.customer_details?.email;
    const subscriptionStatus = session.subscription?.status;
    const isPro = ['active', 'trialing'].includes(subscriptionStatus) || 
                  session.payment_status === 'paid'; // for one-time payments

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        email,
        isPro,
        subscriptionStatus,
        customerId: session.customer,
        plan: session.metadata?.plan || 'pro',
      }),
    };
  } catch (error) {
    console.error('verify-session error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
