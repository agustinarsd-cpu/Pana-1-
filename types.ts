export type View = 'dashboard' | 'recipes' | 'inventory' | 'products' | 'calculator' | 'productionLog';

export enum Unit {
  Kilograms = 'kg',
  Liters = 'l',
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: Unit;
}

export interface Recipe {
  id: string;
  name: string;
  instructions: string;
  yield: number; // Rendimiento en latas/bandejas
  ingredients: Ingredient[];
}

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  unit: Unit;
}

export interface Product {
  id: string;
  name: string;
  recipeId: string;
  stock: number;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface ProductionLogEntry {
  id: string;
  date: string;
  items: {
    productName: string;
    quantity: number;
  }[];
}

export type Action =
  | { type: 'ADD_RECIPE'; payload: Recipe }
  | { type: 'EDIT_RECIPE'; payload: Recipe }
  | { type: 'ADD_INVENTORY_ITEM'; payload: Omit<InventoryItem, 'id'> }
  | { type: 'UPDATE_INVENTORY'; payload: { itemId: string; amount: number } }
  | { type: 'BAKE_PRODUCT'; payload: { productId: string; quantity: number } }
  | { type: 'SELL_PRODUCT'; payload: { productId: string; quantity: number } }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'LOG_PRODUCTION'; payload: { productName: string; quantity: number }[] }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string };