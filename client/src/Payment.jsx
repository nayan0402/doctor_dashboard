
import React, { useState } from 'react'; 
import './Payment.css'; // Optional: Add CSS for styling

const Payment = () => {
    const [loading, setLoading] = useState(false); // Manage loading state
    const [error, setError] = useState(null); // Manage error state

    const handlePayment = async () => {
      try {
        const response = await fetch('http://localhost:5000/create-checkout-session', {
          method: 'POST'
        });
        const { url } = await response.json();
        window.location.href = url;
      } catch (error) {
        showAlert('error', 'Failed to initialize payment');
      }
    };    

    return (
        <div className="payment-container">
            <h2>Payment Section</h2>
            
            <button onClick={handlePayment} disabled={loading} className="payment-button">
                {loading ? 'Processing...' : 'Make Payment'}
            </button>

            {error && <p className="error-message">{error}</p>} {/* Display error message if any */}

            <p>Use this section to make payments for hospital services or other dues.</p>
            <p>Click the "Make Payment" button to proceed to the secure Stripe checkout.</p>
        </div>
    );
};

export default Payment;
