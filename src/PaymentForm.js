import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('<here key>');

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '400px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  };
  
  const buttonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 15px',
    cursor: 'pointer',
    fontSize: '16px',
  };
  
  const textStyle = {
    fontSize: '14px',
    lineHeight: '18px',
  };

const PaymentFormWrapper = ({ userId }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm userId={userId} />
    </Elements>
  );
};

const PaymentForm = ({ userId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const response = await fetch('http://localhost:8080/api/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 500, // 5 zl in cents
        currency: 'pln',
        source: paymentMethod.id,
        description: 'Payment for 5 coins',
        userId: userId,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Payment successful!');
      setPaymentCompleted(true);
    } else {
      setError(data.message || 'Payment failed');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <CardElement style={{...textStyle, marginBottom: '10px' }} />
      <button type="submit" disabled={!stripe || loading} style={buttonStyle}>
      {loading? 'Processing...' : paymentCompleted? 'Success' : 'Pay 5 zl for 5 coins'}
      </button>
      {error && <div style={textStyle}>{error}</div>}
    </form>
  );
};

export default PaymentFormWrapper;
