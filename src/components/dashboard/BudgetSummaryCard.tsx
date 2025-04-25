import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';
import Card from '../ui/Card';
import { BudgetSummary } from '../../types';
import { formatCurrency } from '../../utils/budgetUtils';

interface BudgetSummaryCardProps {
  summary: BudgetSummary;
}

const BudgetSummaryCard: React.FC<BudgetSummaryCardProps> = ({ summary }) => {
  const { totalIncome, totalExpenses, balance, savingsRate } = summary;
  
  return (
    <Card className="bg-gray-900 border-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-4 p-3 bg-gray-800 rounded-lg">
          <div className="p-2 bg-green-600/20 rounded-full">
            <ArrowUpCircle className="h-8 w-8 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Income</p>
            <p className="text-xl font-semibold text-white">{formatCurrency(totalIncome)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 p-3 bg-gray-800 rounded-lg">
          <div className="p-2 bg-red-600/20 rounded-full">
            <ArrowDownCircle className="h-8 w-8 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Expenses</p>
            <p className="text-xl font-semibold text-white">{formatCurrency(totalExpenses)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 p-3 bg-gray-800 rounded-lg">
          <div className="p-2 bg-purple-600/20 rounded-full">
            <Wallet className="h-8 w-8 text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Remaining Balance</p>
            <p className={`text-xl font-semibold ${balance >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {formatCurrency(balance)}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-400">Savings Rate</p>
          <p className="text-sm font-medium text-white">{savingsRate.toFixed(1)}%</p>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${
              savingsRate < 0 ? 'bg-red-500' :
              savingsRate < 10 ? 'bg-orange-500' :
              savingsRate < 20 ? 'bg-yellow-500' :
              'bg-emerald-500'
            }`}
            style={{ width: `${Math.max(0, Math.min(100, savingsRate))}%` }}
          ></div>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          {savingsRate < 0 
            ? 'You are spending more than you earn'
            : savingsRate < 10
              ? 'Try to save at least 10% of your income'
              : savingsRate < 20
                ? 'Good savings rate, aim for 20%'
                : 'Excellent savings rate!'}
        </p>
      </div>
    </Card>
  );
};

export default BudgetSummaryCard;