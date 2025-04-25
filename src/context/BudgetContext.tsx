import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BudgetData, Income, Expense, Category, SavingsGoal, BudgetSummary } from '../types';
import { calculateBudgetSummary } from '../utils/budgetUtils';
import { defaultCategories } from '../data/defaultData';

// Initial empty budget state
const initialBudgetData: BudgetData = {
  incomes: [],
  expenses: [],
  categories: defaultCategories,
  savingsGoals: [],
  transactions: []
};

interface BudgetContextType {
  budgetData: BudgetData;
  summary: BudgetSummary;
  addIncome: (income: Omit<Income, 'id'>) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateIncome: (id: string, income: Partial<Income>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  updateSavingsGoal: (id: string, goal: Partial<SavingsGoal>) => void;
  deleteIncome: (id: string) => void;
  deleteExpense: (id: string) => void;
  deleteCategory: (id: string) => void;
  deleteSavingsGoal: (id: string) => void;
  resetBudget: () => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};

interface BudgetProviderProps {
  children: ReactNode;
}

export const BudgetProvider: React.FC<BudgetProviderProps> = ({ children }) => {
  const [budgetData, setBudgetData] = useState<BudgetData>(() => {
    // Load from localStorage if available
    const savedData = localStorage.getItem('budgetData');
    return savedData ? JSON.parse(savedData) : initialBudgetData;
  });
  
  const [summary, setSummary] = useState<BudgetSummary>(() => 
    calculateBudgetSummary(budgetData)
  );
  
  // Generate unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };
  
  // Save to localStorage whenever budgetData changes
  useEffect(() => {
    localStorage.setItem('budgetData', JSON.stringify(budgetData));
    setSummary(calculateBudgetSummary(budgetData));
  }, [budgetData]);
  
  // Add new income
  const addIncome = (income: Omit<Income, 'id'>) => {
    const newIncome = { ...income, id: generateId() };
    setBudgetData(prev => ({
      ...prev,
      incomes: [...prev.incomes, newIncome]
    }));
  };
  
  // Add new expense
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: generateId() };
    setBudgetData(prev => ({
      ...prev,
      expenses: [...prev.expenses, newExpense]
    }));
  };
  
  // Add new category
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: generateId() };
    setBudgetData(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory]
    }));
  };
  
  // Add new savings goal
  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal = { ...goal, id: generateId() };
    setBudgetData(prev => ({
      ...prev,
      savingsGoals: [...prev.savingsGoals, newGoal]
    }));
  };
  
  // Update existing income
  const updateIncome = (id: string, income: Partial<Income>) => {
    setBudgetData(prev => ({
      ...prev,
      incomes: prev.incomes.map(inc => 
        inc.id === id ? { ...inc, ...income } : inc
      )
    }));
  };
  
  // Update existing expense
  const updateExpense = (id: string, expense: Partial<Expense>) => {
    setBudgetData(prev => ({
      ...prev,
      expenses: prev.expenses.map(exp => 
        exp.id === id ? { ...exp, ...expense } : exp
      )
    }));
  };
  
  // Update existing category
  const updateCategory = (id: string, category: Partial<Category>) => {
    setBudgetData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.id === id ? { ...cat, ...category } : cat
      )
    }));
  };
  
  // Update existing savings goal
  const updateSavingsGoal = (id: string, goal: Partial<SavingsGoal>) => {
    setBudgetData(prev => ({
      ...prev,
      savingsGoals: prev.savingsGoals.map(g => 
        g.id === id ? { ...g, ...goal } : g
      )
    }));
  };
  
  // Delete income
  const deleteIncome = (id: string) => {
    setBudgetData(prev => ({
      ...prev,
      incomes: prev.incomes.filter(inc => inc.id !== id)
    }));
  };
  
  // Delete expense
  const deleteExpense = (id: string) => {
    setBudgetData(prev => ({
      ...prev,
      expenses: prev.expenses.filter(exp => exp.id !== id)
    }));
  };
  
  // Delete category
  const deleteCategory = (id: string) => {
    setBudgetData(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat.id !== id)
    }));
  };
  
  // Delete savings goal
  const deleteSavingsGoal = (id: string) => {
    setBudgetData(prev => ({
      ...prev,
      savingsGoals: prev.savingsGoals.filter(goal => goal.id !== id)
    }));
  };

  // Reset all budget data
  const resetBudget = () => {
    setBudgetData(initialBudgetData);
  };
  
  const value = {
    budgetData,
    summary,
    addIncome,
    addExpense,
    addCategory,
    addSavingsGoal,
    updateIncome,
    updateExpense,
    updateCategory,
    updateSavingsGoal,
    deleteIncome,
    deleteExpense,
    deleteCategory,
    deleteSavingsGoal,
    resetBudget
  };
  
  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};