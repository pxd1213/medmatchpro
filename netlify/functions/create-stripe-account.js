const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function (event, context) {
  try {
    const { userId } = JSON.parse(event.body);

    // Create a Stripe Connect account
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      email: userId, // Using userId as email for simplicity
    });

    // Create an account link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.SITE_URL}/consultant/profile`,
      return_url: `${process.env.SITE_URL}/consultant/profile`,
      type: 'account_onboarding',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ accountLink: accountLink.url }),
    };
  } catch (error) {
    console.error('Error creating Stripe account:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
