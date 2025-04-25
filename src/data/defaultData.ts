import { Category } from '../types';

// Default categories for the budget planner
export const defaultCategories: Category[] = [
  // Income categories
  {
    id: 'income-salary',
    name: 'Salary',
    color: '#10B981', // Green
    budgetLimit: 0,
    icon: 'briefcase',
    type: 'income'
  },
  {
    id: 'income-business',
    name: 'Business',
    color: '#10B981',
    budgetLimit: 0,
    icon: 'store',
    type: 'income'
  },
  {
    id: 'income-investments',
    name: 'Investments',
    color: '#10B981',
    budgetLimit: 0,
    icon: 'trending-up',
    type: 'income'
  },
  {
    id: 'income-other',
    name: 'Other Income',
    color: '#10B981',
    budgetLimit: 0,
    icon: 'plus-circle',
    type: 'income'
  },
  
  // Expense categories
  {
    id: 'expense-housing',
    name: 'Housing',
    color: '#F59E0B', // Amber
    budgetLimit: 15000,
    icon: 'home',
    type: 'expense'
  },
  {
    id: 'expense-food',
    name: 'Food',
    color: '#EC4899', // Pink
    budgetLimit: 8000,
    icon: 'utensils',
    type: 'expense'
  },
  {
    id: 'expense-transportation',
    name: 'Transportation',
    color: '#3B82F6', // Blue
    budgetLimit: 5000,
    icon: 'car',
    type: 'expense'
  },
  {
    id: 'expense-utilities',
    name: 'Utilities',
    color: '#8B5CF6', // Purple
    budgetLimit: 3000,
    icon: 'zap',
    type: 'expense'
  },
  {
    id: 'expense-healthcare',
    name: 'Healthcare',
    color: '#EF4444', // Red
    budgetLimit: 2000,
    icon: 'activity',
    type: 'expense'
  },
  {
    id: 'expense-entertainment',
    name: 'Entertainment',
    color: '#F472B6', // Light pink
    budgetLimit: 4000,
    icon: 'film',
    type: 'expense'
  },
  {
    id: 'expense-shopping',
    name: 'Shopping',
    color: '#6366F1', // Indigo
    budgetLimit: 5000,
    icon: 'shopping-bag',
    type: 'expense'
  },
  {
    id: 'expense-education',
    name: 'Education',
    color: '#2DD4BF', // Teal
    budgetLimit: 3000,
    icon: 'book',
    type: 'expense'
  },
  {
    id: 'expense-other',
    name: 'Other',
    color: '#9CA3AF', // Gray
    budgetLimit: 2000,
    icon: 'more-horizontal',
    type: 'expense'
  }
];

// Default savings goals
export const defaultSavingsGoals = [
  {
    id: 'emergency-fund',
    name: 'Emergency Fund',
    targetAmount: 300000,
    currentAmount: 50000,
  },
  {
    id: 'vacation',
    name: 'Vacation',
    targetAmount: 100000,
    currentAmount: 25000,
    deadline: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(),
  }
];