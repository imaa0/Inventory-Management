import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ItemHistoryModal = ({ item, onClose }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, [item.id]);

  const fetchHistory = async () => {
    try {
      const response = await api.get(`/inventory-items/${item.id}`);
      setTransactions(response.data.transactions || []);
    } catch (err) {
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Transaction History: {item.name}</h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <p><strong>Current Stock:</strong> {item.quantity} {item.unit}</p>
          {item.description && <p><strong>Description:</strong> {item.description}</p>}
        </div>

        {loading && <div className="loading">Loading history...</div>}
        
        {error && <div className="error">{error}</div>}
        
        {!loading && transactions.length === 0 && (
          <div className="empty-state">
            <p>No transaction history available</p>
          </div>
        )}

        {!loading && transactions.length > 0 && (
          <div className="transaction-history">
            <h3 style={{ marginBottom: '1rem' }}>Transactions</h3>
            {transactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className={`transaction-item ${transaction.type}`}
              >
                <div className="transaction-info">
                  <div className={`transaction-quantity ${transaction.type}`}>
                    {transaction.type === 'addition' ? '+' : '-'}{transaction.quantity} {item.unit}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#7f8c8d', marginTop: '0.25rem' }}>
                    {formatDate(transaction.created_at)}
                  </div>
                  {transaction.notes && (
                    <div style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                      <strong>Notes:</strong> {transaction.notes}
                    </div>
                  )}
                  <div style={{ fontSize: '0.85rem', color: '#95a5a6', marginTop: '0.25rem' }}>
                    By: {transaction.user?.name || 'Unknown'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemHistoryModal;
