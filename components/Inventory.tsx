import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import { Unit } from '../types';
import Modal from './Modal';
import { PlusIcon } from './icons/EditorIcons';

const Inventory: React.FC = () => {
  const { state, dispatch } = useBakery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);
  
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemUnit, setNewItemUnit] = useState<Unit>(Unit.Kilograms);


  const handleUpdateStock = () => {
    if (selectedItem && amount !== 0) {
      dispatch({ type: 'UPDATE_INVENTORY', payload: { itemId: selectedItem, amount } });
      dispatch({ type: 'ADD_NOTIFICATION', payload: { message: `Inventario actualizado.`, type: 'success' } });
      setIsModalOpen(false);
      setSelectedItem(null);
      setAmount(0);
    }
  };

  const handleAddNewItem = () => {
    if (newItemName.trim() !== "") {
        const itemExists = state.inventory.some(item => item.name.toLowerCase() === newItemName.trim().toLowerCase());
        if(itemExists) {
             dispatch({ type: 'ADD_NOTIFICATION', payload: { message: `El ingrediente '${newItemName}' ya existe.`, type: 'error' } });
             return;
        }
        dispatch({ type: 'ADD_INVENTORY_ITEM', payload: { name: newItemName, stock: 0, unit: newItemUnit } });
        dispatch({ type: 'ADD_NOTIFICATION', payload: { message: `Ingrediente '${newItemName}' añadido.`, type: 'success' } });
        setIsNewItemModalOpen(false);
        setNewItemName('');
        setNewItemUnit(Unit.Kilograms);
    } else {
        dispatch({ type: 'ADD_NOTIFICATION', payload: { message: `El nombre del ingrediente no puede estar vacío.`, type: 'error' } });
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-brand-dark">Inventario</h1>
          <p className="text-brand-brown mt-1">Controla el stock de tus materias primas.</p>
        </div>
        <button onClick={() => setIsNewItemModalOpen(true)} className="flex items-center bg-brand-brown text-white px-4 py-2 rounded-lg shadow-md hover:bg-brand-dark transition-colors">
            <PlusIcon /> <span className="ml-2">Nuevo Ingrediente</span>
        </button>
      </header>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 font-semibold text-sm text-brand-brown">Ingrediente</th>
              <th className="p-4 font-semibold text-sm text-brand-brown">Stock Actual</th>
              <th className="p-4 font-semibold text-sm text-brand-brown">Unidad</th>
              <th className="p-4 font-semibold text-sm text-brand-brown text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {state.inventory.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-4 text-brand-dark font-medium">{item.name}</td>
                <td className="p-4 text-gray-600">{item.stock.toLocaleString()}</td>
                <td className="p-4 text-gray-600">{item.unit}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => {
                      setSelectedItem(item.id);
                      setIsModalOpen(true);
                    }}
                    className="bg-brand-sand text-brand-brown px-3 py-1 rounded-md text-sm font-semibold hover:bg-brand-accent hover:text-white transition-colors"
                  >
                    Ajustar Stock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ajustar Stock">
        <div className="space-y-4">
          <p>Ajustar stock para: <span className="font-bold">{state.inventory.find(i => i.id === selectedItem)?.name}</span></p>
          <p className="text-xs text-gray-500">Usa un número positivo para añadir stock y un número negativo para reducirlo.</p>
          <input type="number" value={amount} onChange={e => setAmount(parseInt(e.target.value, 10))} className="w-full p-2 border border-gray-200 bg-gray-50 rounded-md focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition" />
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={handleUpdateStock} className="bg-brand-brown text-white px-4 py-2 rounded-lg shadow hover:bg-brand-dark transition-colors">Actualizar</button>
        </div>
      </Modal>

      <Modal isOpen={isNewItemModalOpen} onClose={() => setIsNewItemModalOpen(false)} title="Añadir Nuevo Ingrediente">
          <div className="space-y-4 text-sm">
            <input type="text" placeholder="Nombre del ingrediente" value={newItemName} onChange={e => setNewItemName(e.target.value)} className="w-full p-2 border border-gray-200 bg-gray-50 rounded-md focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition"/>
            <select value={newItemUnit} onChange={e => setNewItemUnit(e.target.value as Unit)} className="w-full p-2 border border-gray-200 bg-gray-50 rounded-md focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition">
                {Object.values(Unit).map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={handleAddNewItem} className="bg-brand-brown text-white px-4 py-2 rounded-lg shadow hover:bg-brand-dark transition-colors">Guardar Ingrediente</button>
          </div>
      </Modal>

    </div>
  );
};

export default Inventory;