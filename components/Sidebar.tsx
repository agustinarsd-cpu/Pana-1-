import React from 'react';
import { View } from '../types';
import { DashboardIcon, RecipeIcon, InventoryIcon, ProductsIcon, CalculatorIcon, ClipboardListIcon } from './icons/NavIcons';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  view: View;
  currentView: View;
  onClick: (view: View) => void;
}> = ({ icon, label, view, currentView, onClick }) => (
  <button
    onClick={() => onClick(view)}
    className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 rounded-lg ${
      currentView === view
        ? 'bg-brand-accent text-white font-semibold shadow-md'
        : 'text-brand-brown hover:bg-brand-sand hover:text-brand-dark'
    }`}
  >
    {icon}
    <span className="ml-4 text-sm">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <aside className="hidden md:flex w-64 bg-brand-sand p-4 flex-col justify-between shadow-lg">
      <div>
        <div className="flex items-center justify-start mb-10 p-2">
          <svg className="w-10 h-10 text-brand-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-5.45-5.04l10.9 0M17.46 12a5.45 5.45 0 11-10.9 0 5.45 5.45 0 0110.9 0z"/>
          </svg>
          <h1 className="text-xl font-bold text-brand-dark ml-3">Panadería</h1>
        </div>
        <nav className="space-y-3">
          <NavItem icon={<DashboardIcon />} label="Dashboard" view="dashboard" currentView={currentView} onClick={setCurrentView} />
          <NavItem icon={<RecipeIcon />} label="Recetas" view="recipes" currentView={currentView} onClick={setCurrentView} />
          <NavItem icon={<InventoryIcon />} label="Inventario" view="inventory" currentView={currentView} onClick={setCurrentView} />
          <NavItem icon={<ProductsIcon />} label="Productos" view="products" currentView={currentView} onClick={setCurrentView} />
          <NavItem icon={<CalculatorIcon />} label="Calculadora" view="calculator" currentView={currentView} onClick={setCurrentView} />
          <NavItem icon={<ClipboardListIcon />} label="Historial" view="productionLog" currentView={currentView} onClick={setCurrentView} />
        </nav>
      </div>
       <div className="text-center text-xs text-brand-brown">
        <p>&copy; 2024 Panadería Maestra</p>
      </div>
    </aside>
  );
};

export default Sidebar;