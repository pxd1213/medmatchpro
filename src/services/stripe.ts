import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || '');

export const createPaymentIntent = async (amount: number) => {
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount }),
  });

  const { clientSecret } = await response.json();
  return clientSecret;
};

export const handlePayment = async (amount: number) => {
  const stripe = await stripePromise;
  const clientSecret = await createPaymentIntent(amount);

  const { error } = await stripe?.confirmCardPayment(clientSecret, {
    payment_method: {
      card: stripe?.elements()?.getElement('card'),
    },
  });

  if (error) {
    throw new Error(error.message);
  }
};

export const createStripeConnectAccount = async (userId: string) => {
  const response = await fetch('/api/create-stripe-account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  const { accountLink } = await response.json();
  return accountLink;
};

export const getStripeAccountStatus = async (userId: string) => {
  const response = await fetch(`/api/stripe-account-status/${userId}`);
  const { status } = await response.json();
  return status;
};
