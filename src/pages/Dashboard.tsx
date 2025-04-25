import React, { useState } from 'react';
import { 
  PlusCircle, 
  MinusCircle, 
  IndianRupee, 
  PieChart, 
  Target, 
  ArrowUpDown,
  X
} from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import { getTransactionHistory } from '../utils/budgetUtils';
import { Transaction } from '../types';

// UI Components
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

// Dashboard Components
import BudgetSummaryCard from '../components/dashboard/BudgetSummaryCard';
import ExpensesChart from '../components/dashboard/ExpensesChart';
import TransactionList from '../components/transactions/TransactionList';
import SavingsGoals from '../components/savings/SavingsGoals';

// Forms
import AddIncomeForm from '../components/forms/AddIncomeForm';
import AddExpenseForm from '../components/forms/AddExpenseForm';
import AddSavingsGoalForm from '../components/savings/AddSavingsGoalForm';

type ModalType = 'income' | 'expense' | 'goal' | 'edit-income' | 'edit-expense' | null;

const Dashboard: React.FC = () => {
  const { budgetData, summary, updateSavingsGoal } = useBudget();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  // Transaction history
  const transactions = getTransactionHistory(budgetData);
  
  // Handle modal closing
  const closeModal = () => {
    setActiveModal(null);
    setEditingTransaction(null);
  };
  
  // Handle savings goal update
  const handleUpdateGoal = (id: string, amount: number) => {
    updateSavingsGoal(id, { currentAmount: amount });
  };

  // Handle transaction edit
  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setActiveModal(transaction.type === 'income' ? 'edit-income' : 'edit-expense');
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <IndianRupee className="h-8 w-8 mr-2 text-purple-500" />
                Budget Planner
              </h1>
              <p className="text-gray-400 mt-1">Manage your personal finances with ease</p>
            </div>
            
            <div className="flex space-x-2 mt-4 sm:mt-0">
              <Button 
                variant="primary" 
                onClick={() => setActiveModal('income')}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Income
              </Button>
              <Button 
                variant="danger" 
                onClick={() => setActiveModal('expense')}
              >
                <MinusCircle className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </div>
          </div>
          
          {/* Summary card */}
          <BudgetSummaryCard summary={summary} />
        </header>
        
        {/* Modals */}
        {activeModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md relative">
              <button 
                onClick={closeModal}
                className="absolute -right-2 -top-2 bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white z-10"
              >
                <X className="h-5 w-5" />
              </button>
              
              {activeModal === 'income' && <AddIncomeForm onClose={closeModal} />}
              {activeModal === 'expense' && <AddExpenseForm onClose={closeModal} />}
              {activeModal === 'goal' && <AddSavingsGoalForm onClose={closeModal} />}
              {activeModal === 'edit-income' && editingTransaction && (
                <AddIncomeForm 
                  onClose={closeModal} 
                  initialData={editingTransaction}
                  isEditing
                />
              )}
              {activeModal === 'edit-expense' && editingTransaction && (
                <AddExpenseForm 
                  onClose={closeModal} 
                  initialData={editingTransaction}
                  isEditing
                />
              )}
            </div>
          </div>
        )}
        
        {/* Dashboard grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <ExpensesChart 
              expenses={budgetData.expenses} 
              categories={budgetData.categories} 
            />
          </div>
          
          <div className="md:col-span-1">
            <SavingsGoals 
              goals={budgetData.savingsGoals} 
              onAddClick={() => setActiveModal('goal')}
              onUpdateGoal={handleUpdateGoal} 
            />
          </div>
          
          <div className="md:col-span-2 xl:col-span-1">
            <TransactionList 
              transactions={transactions} 
              onEdit={handleEditTransaction}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;