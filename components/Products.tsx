import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import Modal from './Modal';
import { Product } from '../types';

const Products: React.FC = () => {
  const { state, dispatch } = useBakery();
  const [isBakeModalOpen, setIsBakeModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const openBakeModal = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setIsBakeModalOpen(true);
  };
  
  const openSellModal = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setIsSellModalOpen(true);
  };

  const handleBake = () => {
    if (selectedProduct && quantity > 0) {
      const recipe = state.recipes.find(r => r.id === selectedProduct.recipeId);
      if (!recipe) return;

      let canBake = true;
      let missingIngredients = [];

      for (const needed of recipe.ingredients) {
          const inventoryItem = state.inventory.find(item => item.name.toLowerCase() === needed.name.toLowerCase());
          if (!inventoryItem || inventoryItem.stock < (needed.quantity * quantity)) {
              canBake = false;
              missingIngredients.push(needed.name);
          }
      }
      
      if (canBake) {
        dispatch({ type: 'BAKE_PRODUCT', payload: { productId: selectedProduct.id, quantity } });
        dispatch({ type: 'ADD_NOTIFICATION', payload: { message: `${quantity} ${selectedProduct.name} horneado(s).`, type: 'success' } });
      } else {
        dispatch({ type: 'ADD_NOTIFICATION', payload: { message: `No hay suficientes ingredientes: ${missingIngredients.join(', ')}`, type: 'error' } });
      }
      setIsBakeModalOpen(false);
    }
  };

  const handleSell = () => {
    if (selectedProduct && quantity > 0) {
      if (selectedProduct.stock < quantity) {
        dispatch({ type: 'ADD_NOTIFICATION', payload: { message: `No hay suficiente stock para vender.`, type: 'error' } });
        return;
      }
      dispatch({ type: 'SELL_PRODUCT', payload: { productId: selectedProduct.id, quantity } });
      dispatch({ type: 'ADD_NOTIFICATION', payload: { message: `${quantity} ${selectedProduct.name} vendido(s).`, type: 'success' } });
      setIsSellModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl font-bold text-brand-dark">Productos</h1>
        <p className="text-brand-brown mt-1">Gestiona el stock de tus productos terminados.</p>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {state.products.map(product => (
          <div key={product.id} className="bg-white rounded-xl shadow-lg p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-brand-dark">{product.name}</h3>
              <p className="text-3xl font-light text-brand-accent my-3">{product.stock} <span className="text-sm text-gray-500">en stock</span></p>
            </div>
            <div className="flex space-x-2 mt-4">
              <button onClick={() => openBakeModal(product)} className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors">Hornear</button>
              <button onClick={() => openSellModal(product)} className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors">Vender</button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isBakeModalOpen} onClose={() => setIsBakeModalOpen(false)} title={`Hornear ${selectedProduct?.name}`}>
        <div className="space-y-4">
          <label htmlFor="bake-qty">Cantidad a hornear:</label>
          <input id="bake-qty" type="number" min="1" value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value, 10)))} className="w-full p-2 border border-gray-200 bg-gray-50 rounded-md focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition" />
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={handleBake} className="bg-brand-brown text-white px-4 py-2 rounded-lg shadow hover:bg-brand-dark transition-colors">Confirmar</button>
        </div>
      </Modal>

      <Modal isOpen={isSellModalOpen} onClose={() => setIsSellModalOpen(false)} title={`Vender ${selectedProduct?.name}`}>
        <div className="space-y-4">
          <label htmlFor="sell-qty">Cantidad a vender:</label>
          <input id="sell-qty" type="number" min="1" max={selectedProduct?.stock} value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value, 10)))} className="w-full p-2 border border-gray-200 bg-gray-50 rounded-md focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition" />
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={handleSell} className="bg-brand-brown text-white px-4 py-2 rounded-lg shadow hover:bg-brand-dark transition-colors">Confirmar Venta</button>
        </div>
      </Modal>
    </div>
  );
};

export default Products;