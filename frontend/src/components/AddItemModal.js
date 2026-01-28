import React, { useState } from 'react';
import api from '../services/api';

const AddItemModal = ({ onClose, onItemAdded, isBulk = false }) => {
  const [items, setItems] = useState([
    { name: '', description: '', quantity: '', unit: 'units' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const units = ['kg', 'm', 'cm', 'units', 'l', 'g'];

  const handleAddItem = () => {
    setItems([...items, { name: '', description: '', quantity: '', unit: 'units' }]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isBulk && items.length > 1) {
        await api.post('/inventory-items/bulk', { items });
      } else {
        await api.post('/inventory-items', items[0]);
      }
      onItemAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item(s)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Add Inventory Item{isBulk && 's'}</h2>
        
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {items.map((item, index) => (
            <div key={index} className="bulk-item">
              {items.length > 1 && (
                <div className="bulk-item-header">
                  <h4>Item {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="btn-danger"
                  >
                    Remove
                  </button>
                </div>
              )}

              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label>Initial Quantity *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Unit *</label>
                <select
                  value={item.unit}
                  onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                  required
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}

          {isBulk && (
            <button
              type="button"
              onClick={handleAddItem}
              className="btn-secondary"
              style={{ marginBottom: '1rem', width: '100%' }}
            >
              + Add Another Item
            </button>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Item(s)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
