import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import { Unit } from '../types';

interface ProductionPlan {
  [productId: string]: number;
}

interface CalculationResult {
  name: string;
  needed: number;
  stock: number;
  difference: number;
  unit: Unit;
}

const Calculator: React.FC = () => {
  const { state, dispatch } = useBakery();
  const [productionPlan, setProductionPlan] = useState<ProductionPlan>({});
  const [results, setResults] = useState<CalculationResult[] | null>(null);

  const handlePlanChange = (productId: string, quantity: string) => {
    const qty = parseInt(quantity, 10);
    setProductionPlan(prev => ({
      ...prev,
      [productId]: isNaN(qty) || qty < 0 ? 0 : qty,
    }));
  };

  const handleCalculate = () => {
    const totalIngredients: { [ingredientName: string]: { needed: number, unit: Unit } } = {};

    for (const productId in productionPlan) {
      const desiredLatas = productionPlan[productId];
      if (desiredLatas > 0) {
        const product = state.products.find(p => p.id === productId);
        if (product) {
          const recipe = state.recipes.find(r => r.id === product.recipeId);
          if (recipe && recipe.yield > 0) {
            const recipeMultiplier = desiredLatas / recipe.yield;
            recipe.ingredients.forEach(ing => {
              const ingName = ing.name.toLowerCase();
              if (!totalIngredients[ingName]) {
                totalIngredients[ingName] = { needed: 0, unit: ing.unit };
              }
              totalIngredients[ingName].needed += ing.quantity * recipeMultiplier;
            });
          }
        }
      }
    }

    const finalResults: CalculationResult[] = Object.keys(totalIngredients).map(ingName => {
      const inventoryItem = state.inventory.find(item => item.name.toLowerCase() === ingName);
      const stock = inventoryItem ? inventoryItem.stock : 0;
      const needed = totalIngredients[ingName].needed;
      
      return {
        name: inventoryItem?.name || ingName.charAt(0).toUpperCase() + ingName.slice(1),
        needed: needed,
        stock: stock,
        difference: stock - needed,
        unit: totalIngredients[ingName].unit,
      };
    });
    
    setResults(finalResults.sort((a,b) => a.name.localeCompare(b.name)));
  };
  
  const handleClear = () => {
    setProductionPlan({});
    setResults(null);
  };

  const handleLogProduction = () => {
    const logItems = Object.keys(productionPlan)
      .filter(key => productionPlan[key] > 0)
      .map(productId => {
        const product = state.products.find(p => p.id === productId);
        return {
          productName: product?.name || 'Producto Desconocido',
          quantity: productionPlan[productId],
        };
      });

    if (logItems.length === 0) {
      dispatch({ type: 'ADD_NOTIFICATION', payload: { message: 'El plan de producción está vacío.', type: 'info' } });
      return;
    }

    dispatch({ type: 'LOG_PRODUCTION', payload: logItems });
    dispatch({ type: 'ADD_NOTIFICATION', payload: { message: 'Plan de producción guardado en el historial.', type: 'success' } });
  };


  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl font-bold text-brand-dark">Calculadora de Producción</h1>
        <p className="text-brand-brown mt-1">Planifica tu producción y calcula los ingredientes necesarios.</p>
      </header>
      
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="font-bold text-lg text-brand-dark mb-4">Plan de Producción</h3>
        <p className="text-sm text-gray-600 mb-4">Introduce cuántas latas de cada producto quieres hornear.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.products.map(product => (
            <div key={product.id} className="flex items-center space-x-3">
              <label htmlFor={`prod-${product.id}`} className="flex-1 text-sm font-medium text-gray-700">{product.name}</label>
              <input
                id={`prod-${product.id}`}
                type="number"
                min="0"
                value={productionPlan[product.id] || ''}
                onChange={e => handlePlanChange(product.id, e.target.value)}
                placeholder="0"
                className="w-24 p-2 border border-gray-200 bg-gray-50 rounded-md text-right focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition"
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex space-x-4">
            <button onClick={handleCalculate} className="bg-brand-brown text-white px-4 py-2 rounded-lg shadow hover:bg-brand-dark transition-colors">
                Calcular Ingredientes
            </button>
            <button onClick={handleClear} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                Limpiar
            </button>
            {results && (
                 <button onClick={handleLogProduction} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors">
                    Guardar Producción
                </button>
            )}
        </div>
      </div>

      {results && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="font-bold text-lg text-brand-dark mb-4">Resultados del Cálculo</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3 font-semibold text-brand-brown">Ingrediente</th>
                            <th className="p-3 font-semibold text-brand-brown text-right">Necesario</th>
                            <th className="p-3 font-semibold text-brand-brown text-right">En Stock</th>
                            <th className="p-3 font-semibold text-brand-brown text-right">Diferencia</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {results.map(res => (
                            <tr key={res.name} className={res.difference < 0 ? 'bg-red-50' : ''}>
                                <td className="p-3 font-medium text-brand-dark">{res.name}</td>
                                <td className="p-3 text-right text-gray-600">{res.needed.toFixed(2)} {res.unit}</td>
                                <td className="p-3 text-right text-gray-600">{res.stock.toFixed(2)} {res.unit}</td>
                                <td className={`p-3 text-right font-bold ${res.difference < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {res.difference.toFixed(2)} {res.unit}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;