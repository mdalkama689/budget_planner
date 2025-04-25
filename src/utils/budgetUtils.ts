// Budget calculation utilities

import { BudgetData, BudgetSummary, Transaction, Category, Expense } from '../types';

// Format currency in Indian Rupee format
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Calculate budget summary from budget data
export const calculateBudgetSummary = (data: BudgetData): BudgetSummary => {
  const totalIncome = data.incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = data.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

  return {
    totalIncome,
    totalExpenses,
    balance,
    savingsRate,
  };
};

// Get expenses by category
export const getExpensesByCategory = (expenses: Expense[], categories: Category[]): Record<string, number> => {
  const expenseByCategory: Record<string, number> = {};
  
  // Initialize all categories with zero
  categories
    .filter(cat => cat.type === 'expense')
    .forEach(cat => {
      expenseByCategory[cat.name] = 0;
    });
  
  // Sum up expenses by category
  expenses.forEach(expense => {
    if (expenseByCategory[expense.category] !== undefined) {
      expenseByCategory[expense.category] += expense.amount;
    } else {
      expenseByCategory[expense.category] = expense.amount;
    }
  });
  
  return expenseByCategory;
};

// Calculate remaining budget for each category
export const calculateRemainingBudgets = (
  expenses: Expense[],
  categories: Category[]
): Record<string, { spent: number; limit: number; remaining: number }> => {
  const expensesByCategory = getExpensesByCategory(expenses, categories);
  const budgetStatus: Record<string, { spent: number; limit: number; remaining: number }> = {};
  
  categories
    .filter(cat => cat.type === 'expense')
    .forEach(category => {
      const spent = expensesByCategory[category.name] || 0;
      const limit = category.budgetLimit;
      const remaining = limit - spent;
      
      budgetStatus[category.name] = {
        spent,
        limit,
        remaining,
      };
    });
  
  return budgetStatus;
};

// Generate transaction history sorted by date
export const getTransactionHistory = (data: BudgetData): Transaction[] => {
  const transactions: Transaction[] = [];
  
  // Convert incomes to transactions
  data.incomes.forEach(income => {
    transactions.push({
      id: income.id,
      type: 'income',
      amount: income.amount,
      category: income.source,
      date: income.date,
      description: `Income from ${income.source}`,
    });
  });
  
  // Convert expenses to transactions
  data.expenses.forEach(expense => {
    transactions.push({
      id: expense.id,
      type: 'expense',
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      description: expense.name,
    });
  });
  
  // Sort by date, most recent first
  return transactions.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

// Calculate total spent this month
export const calculateMonthlySpending = (expenses: Expense[]): number => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  return expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    })
    .reduce((total, expense) => total + expense.amount, 0);
};