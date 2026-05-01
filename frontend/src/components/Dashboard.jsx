import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { CreditCard, History, Wallet, Send } from 'lucide-react';
import { fetchHistory, addHistoryRecord } from '../store/historySlice';
import { updateBalance, updateOwnerEarnings } from '../store/userSlice';

export default function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);
  const owner = useSelector((state) => state.user.owner);
  const history = useSelector((state) => state.history.records);
  
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!amount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/pay', {
        amount: parseFloat(amount),
        userId: user._id
      });

      if (response.data.success) {
        // Update local state
        dispatch(updateBalance(response.data.balance));
        dispatch(updateOwnerEarnings(parseFloat(amount)));
        
        // Fetch fresh history
        dispatch(fetchHistory());
        
        setAmount('');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-grid">
      {/* Left Column - Payment Form & Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="glass-card" style={{ animationDelay: '0.1s' }}>
          <h2 className="card-title">
            <Wallet size={24} /> My Balance
          </h2>
          <div className="stat-box">
            <div className="stat-label">Available Pseudo Money</div>
            <div className="stat-value">${user?.balance?.toLocaleString() || 0}</div>
          </div>
        </div>

        <div className="glass-card" style={{ animationDelay: '0.2s' }}>
          <h2 className="card-title">
            <Send size={24} /> Direct Payment
          </h2>
          <form onSubmit={handlePayment}>
            <div className="form-group">
              <label className="form-label">Payment Amount ($)</label>
              <input
                type="number"
                className="form-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="1"
                step="0.01"
              />
              {error && <div className="text-error">{error}</div>}
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <div className="spinner" /> : 'Proceed with Payment'}
            </button>
          </form>
        </div>
        
        <div className="glass-card" style={{ animationDelay: '0.3s' }}>
          <h2 className="card-title">
            <CreditCard size={24} /> System Earnings
          </h2>
          <div className="stat-box" style={{ background: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
            <div className="stat-label">Total Owner Earnings</div>
            <div className="stat-value" style={{ color: '#60a5fa' }}>${owner?.earnings?.toLocaleString() || 0}</div>
          </div>
        </div>
      </div>

      {/* Right Column - History */}
      <div className="glass-card" style={{ animationDelay: '0.4s', display: 'flex', flexDirection: 'column' }}>
        <h2 className="card-title">
          <History size={24} /> Payment History
        </h2>
        <div className="table-container" style={{ flexGrow: 1 }}>
          {history.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>
              No transactions yet.
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Method</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record._id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.method}</td>
                    <td style={{ fontWeight: 500 }}>${record.amount.toLocaleString()}</td>
                    <td>
                      <span className="status-badge">{record.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
