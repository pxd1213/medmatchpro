const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function (event, context) {
  try {
    const userId = event.pathParameters.userId;
    
    // Get the Stripe account ID from your database
    // This is a simplified example - in production you'd query your database
    const stripeAccountId = await getStripeAccountIdFromDatabase(userId);

    if (!stripeAccountId) {
      return {
        statusCode: 404,
        body: JSON.stringify({ status: 'not_found' }),
      };
    }

    const account = await stripe.accounts.retrieve(stripeAccountId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: account.charges_enabled ? 'complete' : 'incomplete',
        details_submitted: account.details_submitted,
      }),
    };
  } catch (error) {
    console.error('Error checking Stripe account status:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

async function getStripeAccountIdFromDatabase(userId) {
  // This is a placeholder - implement your actual database query here
  // For example, using Supabase:
  // const { data, error } = await supabase
  //   .from('profiles')
  //   .select('stripe_account_id')
  //   .eq('id', userId)
  //   .single();
  
  // return data?.stripe_account_id;
  return 'acct_123456789'; // Mock account ID
}
