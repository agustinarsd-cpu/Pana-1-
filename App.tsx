import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Recipes from './components/Recipes';
import Inventory from './components/Inventory';
import Products from './components/Products';
import Calculator from './components/Calculator';
import { BakeryProvider, useBakery } from './context/BakeryContext';
import { View, ProductionLogEntry } from './types';
import NotificationContainer from './components/NotificationContainer';

// Fix: Moved ProductionLog component from `types.ts` to `App.tsx` to resolve file content and structural issues.
const ProductionLog: React.FC = () => {
  const { state } = useBakery();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl font-bold text-brand-dark">Historial de Producción</h1>
        <p className="text-brand-brown mt-1">Consulta los registros de producción guardados.</p>
      </header>

      {state.productionLog.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <p className="text-gray-500">No hay registros de producción guardados.</p>
            <p className="text-sm text-gray-400 mt-2">Usa la Calculadora y guarda un plan para verlo aquí.</p>
        </div>
      ) : (
        <div className="space-y-4">
            {state.productionLog.map((log: ProductionLogEntry) => (
                <div key={log.id} className="bg-white rounded-xl shadow-lg p-5">
                    <h3 className="text-lg font-bold text-brand-dark mb-3">{log.date}</h3>
                    <ul className="space-y-2">
                        {log.items.map((item, index) => (
                            <li key={index} className="flex justify-between items-center text-sm p-2 rounded-md bg-gray-50">
                                <span className="text-gray-700">{item.productName}</span>
                                <span className="font-semibold text-brand-brown">{item.quantity} {item.quantity === 1 ? 'lata' : 'latas'}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'recipes':
        return <Recipes />;
      case 'inventory':
        return <Inventory />;
      case 'products':
        return <Products />;
      case 'calculator':
        return <Calculator />;
      case 'productionLog':
        return <ProductionLog />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <BakeryProvider>
      <div className="flex h-screen bg-brand-cream text-brand-dark font-sans">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
          {renderView()}
        </main>
        <NotificationContainer />
      </div>
    </BakeryProvider>
  );
};

export default App;