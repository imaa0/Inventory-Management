import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from './Navbar';
import AddItemModal from './AddItemModal';
import StockModal from './StockModal';
import ItemHistoryModal from './ItemHistoryModal';

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [stockModalType, setStockModalType] = useState('add');
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/inventory-items');
      setItems(response.data);
      setFilteredItems(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load inventory items');
    } finally {
      setLoading(false);
    }
  };

  const handleItemAdded = () => {
    fetchItems();
  };

  const handleStockUpdated = () => {
    fetchItems();
    setSelectedItems([]);
  };

  const handleSelectItem = (item) => {
    const isSelected = selectedItems.find(i => i.id === item.id);
    if (isSelected) {
      setSelectedItems(selectedItems.filter(i => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/inventory-items/${id}`);
        fetchItems();
      } catch (err) {
        alert('Failed to delete item');
      }
    }
  };

  const openStockModal = (type, item = null) => {
    setStockModalType(type);
    if (item) {
      setSelectedItems([item]);
    }
    setShowStockModal(true);
  };

  const openBulkStockModal = (type) => {
    if (selectedItems.length === 0) {
      alert('Please select at least one item');
      return;
    }
    setStockModalType(type);
    setShowStockModal(true);
  };

  const openHistoryModal = (item) => {
    setSelectedItem(item);
    setShowHistoryModal(true);
  };

  return (
    <div className="app-container">
      <Navbar />
      
      <div className="container">
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search items by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <button onClick={() => setShowAddModal(true)} className="btn-primary">
            + Add Item
          </button>
          
          <button onClick={() => setShowBulkAddModal(true)} className="btn-primary">
            + Add Multiple Items
          </button>

          {selectedItems.length > 0 && (
            <>
              <button onClick={() => openBulkStockModal('add')} className="btn-success">
                Add Stock ({selectedItems.length})
              </button>
              
              <button onClick={() => openBulkStockModal('deduct')} className="btn-warning">
                Deduct Stock ({selectedItems.length})
              </button>

              <button onClick={() => setSelectedItems([])} className="btn-secondary">
                Clear Selection
              </button>
            </>
          )}
        </div>

        {loading && <div className="loading">Loading inventory...</div>}
        
        {error && <div className="error">{error}</div>}
        
        {!loading && filteredItems.length === 0 && (
          <div className="empty-state">
            <h3>No items found</h3>
            <p>Start by adding your first inventory item</p>
          </div>
        )}

        {!loading && filteredItems.length > 0 && (
          <div className="inventory-grid">
            {filteredItems.map((item) => {
              const isSelected = selectedItems.find(i => i.id === item.id);
              return (
                <div 
                  key={item.id} 
                  className="inventory-card"
                  style={{
                    border: isSelected ? '2px solid #3498db' : 'none',
                    backgroundColor: isSelected ? '#f0f8ff' : 'white'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <h3>{item.name}</h3>
                    <input
                      type="checkbox"
                      checked={isSelected || false}
                      onChange={() => handleSelectItem(item)}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                  </div>
                  
                  {item.description && <p>{item.description}</p>}
                  
                  <div className="quantity">
                    {item.quantity} {item.unit}
                  </div>

                  <div className="card-actions">
                    <button 
                      onClick={() => openStockModal('add', item)} 
                      className="btn-success"
                    >
                      + Add
                    </button>
                    
                    <button 
                      onClick={() => openStockModal('deduct', item)} 
                      className="btn-warning"
                    >
                      - Deduct
                    </button>
                    
                    <button 
                      onClick={() => openHistoryModal(item)} 
                      className="btn-primary"
                    >
                      History
                    </button>
                    
                    <button 
                      onClick={() => handleDeleteItem(item.id)} 
                      className="btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddItemModal
          onClose={() => setShowAddModal(false)}
          onItemAdded={handleItemAdded}
          isBulk={false}
        />
      )}

      {showBulkAddModal && (
        <AddItemModal
          onClose={() => setShowBulkAddModal(false)}
          onItemAdded={handleItemAdded}
          isBulk={true}
        />
      )}

      {showStockModal && (
        <StockModal
          items={selectedItems}
          type={stockModalType}
          onClose={() => {
            setShowStockModal(false);
            setSelectedItems([]);
          }}
          onStockUpdated={handleStockUpdated}
        />
      )}

      {showHistoryModal && selectedItem && (
        <ItemHistoryModal
          item={selectedItem}
          onClose={() => {
            setShowHistoryModal(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
