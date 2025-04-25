import React, { useState, useEffect } from 'react';
import { PlusCircle, Save } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useBudget } from '../../context/BudgetContext';
import { Income, Transaction } from '../../types';

interface AddIncomeFormProps {
  onClose?: () => void;
  initialData?: Transaction;
  isEditing?: boolean;
}

const AddIncomeForm: React.FC<AddIncomeFormProps> = ({ 
  onClose,
  initialData,
  isEditing = false
}) => {
  const { addIncome, updateIncome, budgetData } = useBudget();
  const incomeCategories = budgetData.categories.filter(cat => cat.type === 'income');
  
  const [formData, setFormData] = useState<Omit<Income, 'id'>>({
    source: incomeCategories[0]?.name || '',
    amount: 0,
    frequency: 'monthly',
    date: new Date().toISOString().substring(0, 10),
  });
  
  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        source: initialData.category,
        amount: initialData.amount,
        frequency: 'monthly', // Default since we don't have this in Transaction type
        date: initialData.date,
      });
    }
  }, [initialData, isEditing]);
  
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      const numValue = value ? parseFloat(value) : 0;
      setFormData(prev => ({
        ...prev,
        [name]: numValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.source) {
      setError('Please select an income source');
      return;
    }
    
    if (formData.amount <= 0) {
      setError('Amount must be greater than zero');
      return;
    }
    
    if (isEditing && initialData) {
      updateIncome(initialData.id, formData);
    } else {
      addIncome(formData);
    }
    
    // Reset form
    setFormData({
      source: incomeCategories[0]?.name || '',
      amount: 0,
      frequency: 'monthly',
      date: new Date().toISOString().substring(0, 10),
    });
    
    setError('');
    
    if (onClose) {
      onClose();
    }
  };
  
  return (
    <Card title={isEditing ? "Edit Income" : "Add New Income"} className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-2 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="source" className="block text-sm font-medium text-gray-300 mb-1">
            Income Source
          </label>
          <select
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value="" disabled>Select source</option>
            {incomeCategories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
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
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-300 mb-1">
            Frequency
          </label>
          <select
            id="frequency"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="yearly">Yearly</option>
            <option value="one-time">One-time</option>
          </select>
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
        
        <div className="flex justify-end space-x-3 pt-2">
          {onClose && (
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="primary">
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Income
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AddIncomeForm;