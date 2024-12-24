import React, { useState, useEffect } from 'react';
import { CreditCard, ArrowUpDown, Filter, Clock } from 'lucide-react';
import './Payment.css';

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [payments, setPayments] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterStatus, setFilterStatus] = useState('all');

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Payment initialization failed');
      }
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('http://localhost:5000/payment-intents');
      const data = await response.json();
      setPayments(data);
    } catch (err) {
      console.error('Error fetching payments:', err);
    }
  };

  const handleSort = (field) => {
    const newOrder = field === sortField && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    setSortField(field);
    
    const sorted = [...payments].sort((a, b) => {
      if (field === 'amount') {
        return newOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      return newOrder === 'asc' ? 
        a[field].localeCompare(b[field]) : 
        b[field].localeCompare(a[field]);
    });
    setPayments(sorted);
  };

  const handleStatusFilter = () => {
    const nextStatus = {
      'all': 'succeeded',
      'succeeded': 'failed',
      'failed': 'all'
    };
    setFilterStatus(nextStatus[filterStatus]);
  };

  const getFilteredPayments = () => {
    return payments.filter(payment => {
      if (filterStatus === 'all') return true;
      if (filterStatus === 'failed') {
        return payment.status === 'requires_payment_method';
      }
      return payment.status === filterStatus;
    });
  };

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1 className="payment-title">Payment Portal</h1>
        <button onClick={handlePayment} disabled={loading} className="payment-button">
          <CreditCard />
          {loading ? 'Processing...' : 'Make Payment'}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="payment-table-container">
        <table className="payment-table">
          <thead>
            <tr>
              <th>
                <div className="th-content">
                  <span>Amount</span>
                  <ArrowUpDown 
                    className="sort-icon" 
                    onClick={() => handleSort('amount')} 
                  />
                </div>
              </th>
              <th>
                <div className="th-content">
                  <span>Status</span>
                  <Filter 
                    className="sort-icon" 
                    onClick={handleStatusFilter}
                  />
                </div>
              </th>
              <th>
                <div className="th-content">
                  <Clock className="th-icon" />
                  <span>Date & Time</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {getFilteredPayments().map((payment) => (
              <tr key={payment.id}>
                <td>${(payment.amount/100).toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${
                    payment.status === 'succeeded' ? 'status-succeeded' : 
                    'status-failed'
                  }`}>
                    {payment.status === 'requires_payment_method' ? 'Failed' : payment.status}
                  </span>
                </td>
                <td>{new Date(payment.created).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payment;
