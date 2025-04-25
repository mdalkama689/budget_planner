import React, { useState } from 'react';
import { Target } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useBudget } from '../../context/BudgetContext';
import { SavingsGoal } from '../../types';

interface AddSavingsGoalFormProps {
  onClose?: () => void;
}

const AddSavingsGoalForm: React.FC<AddSavingsGoalFormProps> = ({ onClose }) => {
  const { addSavingsGoal } = useBudget();
  
  const [formData, setFormData] = useState<Omit<SavingsGoal, 'id'>>({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    deadline: undefined,
  });
  
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Please enter a goal name');
      return;
    }
    
    if (formData.targetAmount <= 0) {
      setError('Target amount must be greater than zero');
      return;
    }
    
    if (formData.currentAmount < 0) {
      setError('Current amount cannot be negative');
      return;
    }
    
    if (formData.currentAmount > formData.targetAmount) {
      setError('Current amount cannot exceed target amount');
      return;
    }
    
    addSavingsGoal(formData);
    
    // Reset form
    setFormData({
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      deadline: undefined,
    });
    
    setError('');
    
    if (onClose) {
      onClose();
    }
  };
  
  return (
    <Card title="Add New Savings Goal" className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-2 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Goal Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="e.g., Emergency Fund, New Laptop"
            required
          />
        </div>
        
        <div>
          <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-300 mb-1">
            Target Amount (₹)
          </label>
          <input
            type="number"
            id="targetAmount"
            name="targetAmount"
            min="1"
            step="1000"
            value={formData.targetAmount}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label htmlFor="currentAmount" className="block text-sm font-medium text-gray-300 mb-1">
            Initial Amount (₹)
          </label>
          <input
            type="number"
            id="currentAmount"
            name="currentAmount"
            min="0"
            step="1000"
            value={formData.currentAmount}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-300 mb-1">
            Target Date (Optional)
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-2">
          {onClose && (
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="primary">
            <Target className="h-4 w-4 mr-2" />
            Create Goal
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AddSavingsGoalForm;