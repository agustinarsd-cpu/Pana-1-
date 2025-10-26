import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import { Recipe, Ingredient, Unit, Product } from '../types';
import Modal from './Modal';
import { PlusIcon, TrashIcon, ChevronDownIcon, EditIcon } from './icons/EditorIcons';

const emptyRecipe: Omit<Recipe, 'id'> = {
  name: '',
  instructions: '',
  yield: 0,
  ingredients: [{ id: `ing-${Date.now()}`, name: '', quantity: 0, unit: Unit.Kilograms }],
};

const Recipes: React.FC = () => {
  const { state, dispatch } = useBakery();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [newRecipe, setNewRecipe] = useState<Omit<Recipe, 'id'>>(emptyRecipe);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);

  // --- Handlers for ADDING a recipe ---
  const handleAddIngredient = () => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { id: `ing-${Date.now()}`, name: '', quantity: 0, unit: Unit.Kilograms }],
    }));
  };
  
  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string | number | Unit) => {
    const updatedIngredients = [...newRecipe.ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [field]: field === 'quantity' ? Number(value) : value };
    setNewRecipe({ ...newRecipe, ingredients: updatedIngredients });
  };
  
  const handleRemoveIngredient = (index: number) => {
    setNewRecipe(prev => ({ ...prev, ingredients: prev.ingredients.filter((_, i) => i !== index) }));
  };

  const handleSubmitNewRecipe = () => {
    if (newRecipe.name && newRecipe.instructions) {
      const recipeId = `rec${Date.now()}`;
      const finalRecipe: Recipe = { ...newRecipe, id: recipeId };
      dispatch({ type: 'ADD_RECIPE', payload: finalRecipe });

      const newProduct: Product = {
          id: `prod${Date.now()}`,
          name: finalRecipe.name,
          recipeId: recipeId,
          stock: 0,
      };
      dispatch({type: 'ADD_PRODUCT', payload: newProduct});
      
      dispatch({ type: 'ADD_NOTIFICATION', payload: { message: `Receta '${finalRecipe.name}' creada.`, type: 'success' } });
      
      setIsAddModalOpen(false);
      setNewRecipe(emptyRecipe);
    } else {
       dispatch({ type: 'ADD_NOTIFICATION', payload: { message: 'Por favor, completa el nombre y las instrucciones.', type: 'error' } });
    }
  };

  // --- Handlers for EDITING a recipe ---
  const openEditModal = (recipe: Recipe) => {
    setEditingRecipe(JSON.parse(JSON.stringify(recipe))); // Deep copy to avoid direct state mutation
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (field: keyof Recipe, value: string | number) => {
    if (editingRecipe) {
      setEditingRecipe({ ...editingRecipe, [field]: field === 'yield' ? Number(value) : value });
    }
  };

  const handleEditIngredientChange = (index: number, field: keyof Ingredient, value: string | number | Unit) => {
    if (editingRecipe) {
      const updatedIngredients = [...editingRecipe.ingredients];
      updatedIngredients[index] = { ...updatedIngredients[index], [field]: field === 'quantity' ? Number(value) : value };
      setEditingRecipe({ ...editingRecipe, ingredients: updatedIngredients });
    }
  };

  const handleEditAddIngredient = () => {
    if (editingRecipe) {
      const newIngredients = [...editingRecipe.ingredients, { id: `ing-${Date.now()}`, name: '', quantity: 0, unit: Unit.Kilograms }];
      setEditingRecipe({ ...editingRecipe, ingredients: newIngredients });
    }
  };

  const handleEditRemoveIngredient = (index: number) => {
    if (editingRecipe) {
      const newIngredients = editingRecipe.ingredients.filter((_, i) => i !== index);
      setEditingRecipe({ ...editingRecipe, ingredients: newIngredients });
    }
  };

  const handleSubmitEditRecipe = () => {
    if (editingRecipe && editingRecipe.name) {
      dispatch({ type: 'EDIT_RECIPE', payload: editingRecipe });
      dispatch({ type: 'ADD_NOTIFICATION', payload: { message: `Receta '${editingRecipe.name}' actualizada.`, type: 'success' } });
      setIsEditModalOpen(false);
      setEditingRecipe(null);
    } else {
       dispatch({ type: 'ADD_NOTIFICATION', payload: { message: 'El nombre no puede estar vacío.', type: 'error' } });
    }
  };

  const toggleRecipe = (id: string) => {
    setExpandedRecipe(expandedRecipe === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-brand-dark">Recetas</h1>
          <p className="text-brand-brown mt-1">Crea y gestiona las recetas de tu panadería.</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center bg-brand-brown text-white px-4 py-2 rounded-lg shadow-md hover:bg-brand-dark transition-colors">
          <PlusIcon /> <span className="ml-2">Nueva Receta</span>
        </button>
      </header>
      
      <div className="space-y-4">
        {state.recipes.map(recipe => (
          <div key={recipe.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-brand-dark">{recipe.name}</h3>
              <div className="flex items-center space-x-2">
                <button onClick={() => openEditModal(recipe)} className="text-gray-400 hover:text-brand-accent p-1 rounded-full transition-colors"><EditIcon /></button>
                <button onClick={() => toggleRecipe(recipe.id)} className="p-1"><ChevronDownIcon expanded={expandedRecipe === recipe.id} /></button>
              </div>
            </div>
            {expandedRecipe === recipe.id && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-700 mb-3"><strong className="font-semibold text-brand-brown">Rendimiento:</strong> {recipe.yield} latas</p>
                <h4 className="font-semibold text-brand-brown mb-2">Ingredientes:</h4>
                <ul className="list-disc list-inside mb-4 pl-2 space-y-1 text-sm">
                  {recipe.ingredients.map(ing => (
                    <li key={ing.id} className="text-gray-700">{ing.name} - {ing.quantity} {ing.unit}</li>
                  ))}
                </ul>
                <h4 className="font-semibold text-brand-brown mb-2">Instrucciones:</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{recipe.instructions}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Recipe Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Crear Nueva Receta">
        <div className="space-y-4 text-sm">
          <input type="text" placeholder="Nombre de la receta" value={newRecipe.name} onChange={e => setNewRecipe({ ...newRecipe, name: e.target.value })} className="w-full p-2 border border-gray-200 bg-gray-50 rounded-md focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition"/>
          <textarea placeholder="Instrucciones" value={newRecipe.instructions} onChange={e => setNewRecipe({ ...newRecipe, instructions: e.target.value })} className="w-full p-2 border border-gray-200 bg-gray-50 rounded-md h-24 focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition"/>
          <input type="number" placeholder="Rendimiento (latas)" value={newRecipe.yield || ''} onChange={e => setNewRecipe({ ...newRecipe, yield: parseInt(e.target.value, 10) || 0 })} className="w-full p-2 border border-gray-200 bg-gray-50 rounded-md focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition"/>
          
          <h3 className="font-semibold">Ingredientes</h3>
          {newRecipe.ingredients.map((ing, index) => (
            <div key={ing.id} className="grid grid-cols-12 gap-2 items-center">
              <input type="text" placeholder="Nombre" value={ing.name} onChange={e => handleIngredientChange(index, 'name', e.target.value)} className="col-span-4 p-2 border border-gray-200 bg-gray-50 rounded-md focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition"/>
              <input type="number" placeholder="Cant." value={ing.quantity} onChange={e => handleIngredientChange(index, 'quantity', e.target.value)} className="col-span-3 p-2 border border-gray-200 bg-gray-50 rounded-md focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition"/>
              <select value={ing.unit} onChange={e => handleIngredientChange(index, 'unit', e.target.value as Unit)} className="col-span-4 p-2 border border-gray-200 bg-gray-50 rounded-md focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition">
                {Object.values(Unit).map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              <button onClick={() => handleRemoveIngredient(index)} className="col-span-1 text-red-500 hover:text-red-700"><TrashIcon /></button>
            </div>
          ))}
          <button onClick={handleAddIngredient} className="text-sm text-brand-brown hover:underline">+ Añadir ingrediente</button>
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={handleSubmitNewRecipe} className="bg-brand-brown text-white px-4 py-2 rounded-lg shadow hover:bg-brand-dark transition-colors">Guardar Receta</button>
        </div>
      </Modal>

      {/* Edit Recipe Modal */}
      {editingRecipe && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Editar ${editingRecipe.name}`}>
          <div className="space-y-4 text-sm">
            <input type="text" placeholder="Nombre de la receta" value={editingRecipe.name} onChange={e => handleEditInputChange('name', e.target.value)} className="w-full p-2 border border-gray-200 bg-gray-50 rounded-md focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition"/>
            <textarea placeholder="Instrucciones" value={editingRecipe.instructions} onChange={e => handleEditInputChange('instructions', e.target.value)} className="w-full p-2 border border-gray-200 bg-gray-50 rounded-md h-24 focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition"/>
            <input type="number" placeholder="Rendimiento (latas)" value={editingRecipe.yield || ''} onChange={e => handleEditInputChange('yield', e.target.value)} className="w-full p-2 border border-gray-200 bg-gray-50 rounded-md focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition"/>
            
            <h3 className="font-semibold">Ingredientes</h3>
            {editingRecipe.ingredients.map((ing, index) => (
              <div key={ing.id} className="grid grid-cols-12 gap-2 items-center">
                <input type="text" placeholder="Nombre" value={ing.name} onChange={e => handleEditIngredientChange(index, 'name', e.target.value)} className="col-span-4 p-2 border border-gray-200 bg-gray-50 rounded-md focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition"/>
                <input type="number" placeholder="Cant." value={ing.quantity} onChange={e => handleEditIngredientChange(index, 'quantity', e.target.value)} className="col-span-3 p-2 border border-gray-200 bg-gray-50 rounded-md focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition"/>
                <select value={ing.unit} onChange={e => handleEditIngredientChange(index, 'unit', e.target.value as Unit)} className="col-span-4 p-2 border border-gray-200 bg-gray-50 rounded-md focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition">
                  {Object.values(Unit).map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <button onClick={() => handleEditRemoveIngredient(index)} className="col-span-1 text-red-500 hover:text-red-700"><TrashIcon /></button>
              </div>
            ))}
            <button onClick={handleEditAddIngredient} className="text-sm text-brand-brown hover:underline">+ Añadir ingrediente</button>
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={handleSubmitEditRecipe} className="bg-brand-brown text-white px-4 py-2 rounded-lg shadow hover:bg-brand-dark transition-colors">Guardar Cambios</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Recipes;