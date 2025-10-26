
import React from 'react';
import { useBakery } from '../context/BakeryContext';
import { RecipeIcon, InventoryIcon, ProductsIcon } from './icons/NavIcons';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className={`bg-white p-6 rounded-xl shadow-lg flex items-center justify-between border-l-4 ${color}`}>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-brand-dark">{value}</p>
        </div>
        <div className="text-brand-brown opacity-80">{icon}</div>
    </div>
);


const Dashboard: React.FC = () => {
  const { state } = useBakery();
  const lowStockInventory = state.inventory.filter(item => item.stock < 1 && (item.unit === 'kg' || item.unit === 'l')).slice(0, 5);
  const lowStockProducts = state.products.filter(item => item.stock < 10).slice(0, 5);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-brand-dark">Dashboard</h1>
        <p className="text-brand-brown mt-1">Un resumen del estado de tu panadería.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Recetas Totales" value={state.recipes.length} icon={<RecipeIcon size={40} />} color="border-blue-400" />
        <StatCard title="Items en Inventario" value={state.inventory.length} icon={<InventoryIcon size={40} />} color="border-green-400" />
        <StatCard title="Productos a la Venta" value={state.products.length} icon={<ProductsIcon size={40} />} color="border-yellow-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-lg text-brand-dark mb-4">Inventario Bajo</h3>
          {lowStockInventory.length > 0 ? (
            <ul className="space-y-2">
              {lowStockInventory.map(item => (
                <li key={item.id} className="flex justify-between items-center text-sm p-2 rounded-md bg-red-50 text-red-700">
                  <span>{item.name}</span>
                  <span className="font-semibold">{item.stock} {item.unit}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">¡Todo el inventario está bien abastecido!</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-lg text-brand-dark mb-4">Productos con Poco Stock</h3>
          {lowStockProducts.length > 0 ? (
            <ul className="space-y-2">
              {lowStockProducts.map(product => (
                <li key={product.id} className="flex justify-between items-center text-sm p-2 rounded-md bg-yellow-50 text-yellow-700">
                  <span>{product.name}</span>
                  <span className="font-semibold">{product.stock} unidades</span>
                </li>
              ))}
            </ul>
          ) : (
             <p className="text-sm text-gray-500">¡Todos los productos tienen buen stock!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;