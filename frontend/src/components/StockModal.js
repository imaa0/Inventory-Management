import React, { useState } from 'react';
import api from '../services/api';

const StockModal = ({ items, onClose, onStockUpdated, type = 'add' }) => {
  const isAddType = type === 'add';
  
  const [stockItems, setStockItems] = useState(items.map(item => ({
    id: item.id,
    name: item.name,
    unit: item.unit,
    currentQuantity: item.quantity,
    quantity: '',
    notes: ''
  })));
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleItemChange = (index, field, value) => {
    const updated = [...stockItems];
    updated[index][field] = value;
    setStockItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = stockItems
        .filter(item => item.quantity && parseFloat(item.quantity) > 0)
        .map(item => ({
          id: item.id,
          quantity: parseFloat(item.quantity),
          notes: item.notes
        }));

      if (payload.length === 0) {
        setError('Please enter at least one quantity');
        setLoading(false);
        return;
      }

      const endpoint = isAddType ? 'add-stock' : 'deduct-stock';
      const bulkEndpoint = isAddType ? 'bulk-add' : 'bulk-deduct';

      if (payload.length === 1) {
        await api.post(`/inventory-items/${payload[0].id}/${endpoint}`, payload[0]);
      } else {
        await api.post(`/inventory-items/${bulkEndpoint}`, { items: payload });
      }

      onStockUpdated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${type} stock`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isAddType ? 'Add' : 'Deduct'} Stock</h2>
        
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {stockItems.map((item, index) => (
            <div key={item.id} className="bulk-item">
              <div className="bulk-item-header">
                <div>
                  <h4>{item.name}</h4>
                  <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
                    Current: {item.currentQuantity} {item.unit}
                  </p>
                </div>
              </div>

              <div className="form-group">
                <label>Quantity to {isAddType ? 'Add' : 'Deduct'} *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  placeholder={`Enter quantity in ${item.unit}`}
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={item.notes}
                  onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                  rows="2"
                  placeholder="Optional notes"
                />
              </div>
            </div>
          ))}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button 
              type="submit" 
              className={isAddType ? 'btn-success' : 'btn-warning'}
              disabled={loading}
            >
              {loading ? 'Processing...' : `${isAddType ? 'Add' : 'Deduct'} Stock`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockModal;
