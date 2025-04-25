import React, { useState, useEffect } from 'react';
import { MinusCircle, Save } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useBudget } from '../../context/BudgetContext';
import { Expense, Transaction } from '../../types';

interface AddExpenseFormProps {
  onClose?: () => void;
  initialData?: Transaction;
  isEditing?: boolean;
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ 
  onClose,
  initialData,
  isEditing = false
}) => {
  const { addExpense, updateExpense, budgetData } = useBudget();
  const expenseCategories = budgetData.categories.filter(cat => cat.type === 'expense');
  
  const [formData, setFormData] = useState<Omit<Expense, 'id'>>({
    category: expenseCategories[0]?.name || '',
    name: '',
    amount: 0,
    date: new Date().toISOString().substring(0, 10),
    isRecurring: false,
  });
  
  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        category: initialData.category,
        name: initialData.description,
        amount: initialData.amount,
        date: initialData.date,
        isRecurring: false, // Default since we don't have this in Transaction type
      });
    }
  }, [initialData, isEditing]);
  
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'amount') {
      const numValue = value ? parseFloat(value) : 0;
      setFormData(prev => ({
        ...prev,
        [name]: numValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' 
          ? (e.target as HTMLInputElement).checked
          : value
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category) {
      setError('Please select a category');
      return;
    }
    
    if (!formData.name.trim()) {
      setError('Please enter a description');
      return;
    }
    
    if (formData.amount <= 0) {
      setError('Amount must be greater than zero');
      return;
    }
    
    if (isEditing && initialData) {
      updateExpense(initialData.id, formData);
    } else {
      addExpense(formData);
    }
    
    // Reset form
    setFormData({
      category: expenseCategories[0]?.name || '',
      name: '',
      amount: 0,
      date: new Date().toISOString().substring(0, 10),
      isRecurring: false,
    });
    
    setError('');
    
    if (onClose) {
      onClose();
    }
  };
  
  return (
    <Card title={isEditing ? "Edit Expense" : "Add New Expense"} className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-2 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value="" disabled>Select category</option>
            {expenseCategories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="e.g., Grocery shopping, Rent payment"
            required
          />
        </div>
        
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
            Amount (₹)
          </label>
          <input
            type="text"
            id="amount"
            name="amount"
            value={formData.amount || ''}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter amount"
            required
          />
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isRecurring"
            name="isRecurring"
            checked={formData.isRecurring}
            onChange={handleChange}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-300">
            This is a recurring expense
          </label>
        </div>
        
        <div className="flex justify-end space-x-3 pt-2">
          {onClose && (
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="danger">
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <MinusCircle className="h-4 w-4 mr-2" />
                Add Expense
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AddExpenseForm;