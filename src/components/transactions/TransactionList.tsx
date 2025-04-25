import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Search, Filter, Trash2, Edit2, RefreshCw } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Transaction } from '../../types';
import { formatCurrency } from '../../utils/budgetUtils';
import { useBudget } from '../../context/BudgetContext';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onEdit }) => {
  const { deleteIncome, deleteExpense, resetBudget } = useBudget();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  
  const filteredTransactions = transactions
    .filter(transaction => {
      // Apply type filter
      if (filter !== 'all' && transaction.type !== filter) {
        return false;
      }
      
      // Apply search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          transaction.description.toLowerCase().includes(searchLower) ||
          transaction.category.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }).format(date);
  };

  const handleDelete = (transaction: Transaction) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      if (transaction.type === 'income') {
        deleteIncome(transaction.id);
      } else {
        deleteExpense(transaction.id);
      }
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all budget data? This cannot be undone.')) {
      resetBudget();
    }
  };
  
  return (
    <Card title="Recent Transactions" className="h-full">
      <div className="flex flex-col space-y-4">
        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className="flex-shrink-0"
            >
              All
            </Button>
            <Button 
              variant={filter === 'income' ? 'success' : 'outline'}
              size="sm"
              onClick={() => setFilter('income')}
              className="flex-shrink-0"
            >
              Income
            </Button>
            <Button 
              variant={filter === 'expense' ? 'danger' : 'outline'}
              size="sm"
              onClick={() => setFilter('expense')}
              className="flex-shrink-0"
            >
              Expense
            </Button>
          </div>
        </div>

        {/* Reset button */}
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-red-400 hover:text-red-300"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset All Data
          </Button>
        </div>
        
        {/* Transactions list */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'income' ? 'bg-green-600/20' : 'bg-red-600/20'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{transaction.description}</p>
                    <p className="text-xs text-gray-400">{transaction.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-gray-400">{formatDate(transaction.date)}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(transaction)}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <Filter className="h-8 w-8 mb-2 text-gray-600" />
              <p>No transactions found</p>
              {searchTerm && (
                <p className="text-sm text-gray-600 mt-1">Try a different search term</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TransactionList;