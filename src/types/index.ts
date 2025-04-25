// Type definitions for the budget planner application

export interface Income {
  id: string;
  source: string;
  amount: number;
  frequency: 'monthly' | 'weekly' | 'yearly' | 'one-time';
  date: string;
}

export interface Expense {
  id: string;
  category: string;
  name: string;
  amount: number;
  date: string;
  isRecurring: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  budgetLimit: number;
  icon?: string;
  type: 'income' | 'expense';
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  description: string;
}

export interface BudgetData {
  incomes: Income[];
  expenses: Expense[];
  categories: Category[];
  savingsGoals: SavingsGoal[];
  transactions: Transaction[];
}

export interface BudgetSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
}