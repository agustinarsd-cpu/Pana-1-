import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { Recipe, InventoryItem, Product, Notification, Action, Unit, ProductionLogEntry } from '../types';

interface BakeryState {
  recipes: Recipe[];
  inventory: InventoryItem[];
  products: Product[];
  notifications: Notification[];
  productionLog: ProductionLogEntry[];
}

const initialState: BakeryState = {
  recipes: [
    {
      id: 'rec_pan_frances',
      name: 'Pan Francés',
      instructions: 'Instrucciones para Pan Francés.',
      yield: 10,
      ingredients: [
        { id: 'ing1-1', name: 'Harina', quantity: 25, unit: Unit.Kilograms },
        { id: 'ing1-2', name: 'Aditivo', quantity: 0.008, unit: Unit.Kilograms },
        { id: 'ing1-3', name: 'Agua', quantity: 15, unit: Unit.Liters },
        { id: 'ing1-4', name: 'Sal', quantity: 0.5, unit: Unit.Kilograms },
        { id: 'ing1-5', name: 'Levadura', quantity: 0.05, unit: Unit.Kilograms },
      ],
    },
    {
      id: 'rec_bizcochitos',
      name: 'Bizcochitos',
      instructions: 'Instrucciones para Bizcochitos.',
      yield: 4,
      ingredients: [
        { id: 'ing2-1', name: 'Harina', quantity: 5, unit: Unit.Kilograms },
        { id: 'ing2-2', name: 'Agua', quantity: 1, unit: Unit.Liters },
        { id: 'ing2-3', name: 'Leche', quantity: 1, unit: Unit.Liters },
        { id: 'ing2-4', name: 'Sal', quantity: 0.17, unit: Unit.Kilograms },
        { id: 'ing2-5', name: 'Levadura', quantity: 0.025, unit: Unit.Kilograms },
        { id: 'ing2-6', name: 'Grasa', quantity: 2.2, unit: Unit.Kilograms },
      ],
    },
    {
      id: 'rec_criollitos',
      name: 'Criollitos',
      instructions: 'Instrucciones para Criollitos.',
      yield: 5,
      ingredients: [
        { id: 'ing3-1', name: 'Harina', quantity: 5, unit: Unit.Kilograms },
        { id: 'ing3-2', name: 'Aditivo', quantity: 0.003, unit: Unit.Kilograms },
        { id: 'ing3-3', name: 'Agua', quantity: 3, unit: Unit.Liters },
        { id: 'ing3-4', name: 'Sal', quantity: 0.15, unit: Unit.Kilograms },
        { id: 'ing3-5', name: 'Levadura', quantity: 0.05, unit: Unit.Kilograms },
        { id: 'ing3-6', name: 'Grasa', quantity: 0.4, unit: Unit.Kilograms },
        { id: 'ing3-7', name: 'Margarina H', quantity: 1, unit: Unit.Kilograms },
      ],
    },
    {
      id: 'rec_cremonitas',
      name: 'Cremonitas',
      instructions: 'Instrucciones para Cremonitas.',
      yield: 5,
      ingredients: [
        { id: 'ing4-1', name: 'Harina', quantity: 5, unit: Unit.Kilograms },
        { id: 'ing4-2', name: 'Aditivo', quantity: 0.003, unit: Unit.Kilograms },
        { id: 'ing4-3', name: 'Agua', quantity: 3, unit: Unit.Liters },
        { id: 'ing4-4', name: 'Sal', quantity: 0.15, unit: Unit.Kilograms },
        { id: 'ing4-5', name: 'Levadura', quantity: 0.05, unit: Unit.Kilograms },
        { id: 'ing4-6', name: 'Grasa', quantity: 0.4, unit: Unit.Kilograms },
        { id: 'ing4-7', name: 'Margarina H', quantity: 1, unit: Unit.Kilograms },
      ],
    },
    {
      id: 'rec_cremonas',
      name: 'Cremonas',
      instructions: 'Instrucciones para Cremonas.',
      yield: 5,
      ingredients: [
        { id: 'ing5-1', name: 'Harina', quantity: 5, unit: Unit.Kilograms },
        { id: 'ing5-2', name: 'Aditivo', quantity: 0.003, unit: Unit.Kilograms },
        { id: 'ing5-3', name: 'Agua', quantity: 3, unit: Unit.Liters },
        { id: 'ing5-4', name: 'Sal', quantity: 0.15, unit: Unit.Kilograms },
        { id: 'ing5-5', name: 'Levadura', quantity: 0.05, unit: Unit.Kilograms },
        { id: 'ing5-6', name: 'Grasa', quantity: 0.4, unit: Unit.Kilograms },
        { id: 'ing5-7', name: 'Margarina H', quantity: 1, unit: Unit.Kilograms },
      ],
    },
    {
      id: 'rec_figazzas',
      name: 'Figazzas',
      instructions: 'Instrucciones para Figazzas.',
      yield: 8,
      ingredients: [
        { id: 'ing6-1', name: 'Harina', quantity: 10, unit: Unit.Kilograms },
        { id: 'ing6-2', name: 'Aditivo', quantity: 0.006, unit: Unit.Kilograms },
        { id: 'ing6-3', name: 'Agua', quantity: 6, unit: Unit.Liters },
        { id: 'ing6-4', name: 'Sal', quantity: 0.2, unit: Unit.Kilograms },
        { id: 'ing6-5', name: 'Levadura', quantity: 0.08, unit: Unit.Kilograms },
        { id: 'ing6-6', name: 'Grasa', quantity: 0.5, unit: Unit.Kilograms },
        { id: 'ing6-7', name: 'Margarina M', quantity: 0.5, unit: Unit.Kilograms },
        { id: 'ing6-8', name: 'Azúcar', quantity: 0.5, unit: Unit.Kilograms },
      ],
    },
    {
      id: 'rec_negritos',
      name: 'Negritos',
      instructions: 'Instrucciones para Negritos.',
      yield: 8,
      ingredients: [
        { id: 'ing7-1', name: 'Harina', quantity: 10, unit: Unit.Kilograms },
        { id: 'ing7-2', name: 'Aditivo', quantity: 0.006, unit: Unit.Kilograms },
        { id: 'ing7-3', 'name': 'Agua', quantity: 6, unit: Unit.Liters },
        { id: 'ing7-4', name: 'Sal', quantity: 0.2, unit: Unit.Kilograms },
        { id: 'ing7-5', name: 'Levadura', quantity: 0.08, unit: Unit.Kilograms },
        { id: 'ing7-6', name: 'Grasa', quantity: 0.5, unit: Unit.Kilograms },
        { id: 'ing7-7', name: 'Margarina M', quantity: 0.5, unit: Unit.Kilograms },
        { id: 'ing7-8', name: 'Azúcar', quantity: 0.5, unit: Unit.Kilograms },
      ],
    },
    {
      id: 'rec_pebetes',
      name: 'Pebetes',
      instructions: 'Instrucciones para Pebetes.',
      yield: 6,
      ingredients: [
        { id: 'ing8-1', name: 'Harina', quantity: 5, unit: Unit.Kilograms },
        { id: 'ing8-2', name: 'Aditivo', quantity: 0.003, unit: Unit.Kilograms },
        { id: 'ing8-3', name: 'Agua', quantity: 1, unit: Unit.Liters },
        { id: 'ing8-4', name: 'Leche', quantity: 1, unit: Unit.Liters },
        { id: 'ing8-5', name: 'Sal', quantity: 0.1, unit: Unit.Kilograms },
        { id: 'ing8-6', name: 'Levadura', quantity: 0.08, unit: Unit.Kilograms },
        { id: 'ing8-7', name: 'Margarina M', quantity: 0.5, unit: Unit.Kilograms },
        { id: 'ing8-8', name: 'Manteca', quantity: 0.6, unit: Unit.Kilograms },
        { id: 'ing8-9', name: 'Azúcar', quantity: 0.3, unit: Unit.Kilograms },
      ],
    },
  ],
  inventory: [
    { id: 'inv1', name: 'Harina', stock: 50, unit: Unit.Kilograms },
    { id: 'inv2', name: 'Agua', stock: 50, unit: Unit.Liters },
    { id: 'inv3', name: 'Sal', stock: 5, unit: Unit.Kilograms },
    { id: 'inv4', name: 'Leche', stock: 10, unit: Unit.Liters },
    { id: 'inv5', name: 'Azúcar', stock: 10, unit: Unit.Kilograms },
    { id: 'inv6', name: 'Aditivo', stock: 1, unit: Unit.Kilograms },
    { id: 'inv7', name: 'Levadura', stock: 2, unit: Unit.Kilograms },
    { id: 'inv8', name: 'Grasa', stock: 5, unit: Unit.Kilograms },
    { id: 'inv9', name: 'Margarina H', stock: 5, unit: Unit.Kilograms },
    { id: 'inv10', name: 'Margarina M', stock: 5, unit: Unit.Kilograms },
    { id: 'inv11', name: 'Manteca', stock: 5, unit: Unit.Kilograms },
  ],
  products: [
    { id: 'prod1', name: 'Pan Francés', recipeId: 'rec_pan_frances', stock: 0 },
    { id: 'prod2', name: 'Bizcochitos', recipeId: 'rec_bizcochitos', stock: 0 },
    { id: 'prod3', name: 'Criollitos', recipeId: 'rec_criollitos', stock: 0 },
    { id: 'prod4', name: 'Cremonitas', recipeId: 'rec_cremonitas', stock: 0 },
    { id: 'prod5', name: 'Cremonas', recipeId: 'rec_cremonas', stock: 0 },
    { id: 'prod6', name: 'Figazzas', recipeId: 'rec_figazzas', stock: 0 },
    { id: 'prod7', name: 'Negritos', recipeId: 'rec_negritos', stock: 0 },
    { id: 'prod8', name: 'Pebetes', recipeId: 'rec_pebetes', stock: 0 },
  ],
  notifications: [],
  productionLog: [],
};

const bakeryReducer = (state: BakeryState, action: Action): BakeryState => {
  switch (action.type) {
    case 'ADD_RECIPE':
      return { ...state, recipes: [...state.recipes, action.payload] };
    case 'EDIT_RECIPE':
      return {
        ...state,
        recipes: state.recipes.map(recipe =>
          recipe.id === action.payload.id ? action.payload : recipe
        ),
      };
    case 'ADD_INVENTORY_ITEM':
        const newItem = { ...action.payload, id: `inv${Date.now()}` };
        return { ...state, inventory: [...state.inventory, newItem] };
    case 'UPDATE_INVENTORY':
      return {
        ...state,
        inventory: state.inventory.map(item =>
          item.id === action.payload.itemId ? { ...item, stock: item.stock + action.payload.amount } : item
        ),
      };
    case 'BAKE_PRODUCT': {
      const { productId, quantity } = action.payload;
      const product = state.products.find(p => p.id === productId);
      if (!product) return state;

      const recipe = state.recipes.find(r => r.id === product.recipeId);
      if (!recipe) return state;

      const neededIngredients = recipe.ingredients.map(ing => ({
        name: ing.name,
        quantity: ing.quantity * quantity,
      }));

      let canBake = true;
      let newInventory = [...state.inventory];
      
      for (const needed of neededIngredients) {
          const inventoryItem = newInventory.find(item => item.name.toLowerCase() === needed.name.toLowerCase());
          if (!inventoryItem || inventoryItem.stock < needed.quantity) {
              canBake = false;
              break;
          }
      }

      if (canBake) {
        neededIngredients.forEach(needed => {
            const itemIndex = newInventory.findIndex(item => item.name.toLowerCase() === needed.name.toLowerCase());
            newInventory[itemIndex] = { ...newInventory[itemIndex], stock: newInventory[itemIndex].stock - needed.quantity };
        });

        return {
          ...state,
          inventory: newInventory,
          products: state.products.map(p =>
            p.id === productId ? { ...p, stock: p.stock + quantity } : p
          ),
        };
      }
      return state;
    }
    case 'SELL_PRODUCT': {
      const { productId, quantity } = action.payload;
      return {
        ...state,
        products: state.products.map(p =>
          p.id === productId ? { ...p, stock: Math.max(0, p.stock - quantity) } : p
        ),
      };
    }
    case 'ADD_PRODUCT': {
        const productExists = state.products.some(p => p.recipeId === action.payload.recipeId);
        if (productExists) {
            return state;
        }
        return {...state, products: [...state.products, action.payload]};
    }
    case 'LOG_PRODUCTION': {
      if (!action.payload || action.payload.length === 0) {
        return state;
      }
      const newLogEntry: ProductionLogEntry = {
        id: `log-${Date.now()}`,
        date: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
        items: action.payload,
      };
      return {
        ...state,
        productionLog: [newLogEntry, ...state.productionLog],
      };
    }
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, { ...action.payload, id: `notif-${Date.now()}` }],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    default:
      return state;
  }
};

interface BakeryContextType {
  state: BakeryState;
  dispatch: React.Dispatch<Action>;
}

const BakeryContext = createContext<BakeryContextType | undefined>(undefined);

export const BakeryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(bakeryReducer, initialState);
  return <BakeryContext.Provider value={{ state, dispatch }}>{children}</BakeryContext.Provider>;
};

export const useBakery = (): BakeryContextType => {
  const context = useContext(BakeryContext);
  if (!context) {
    throw new Error('useBakery must be used within a BakeryProvider');
  }
  return context;
};