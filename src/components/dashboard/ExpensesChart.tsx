import React, { useMemo } from 'react';
import Card from '../ui/Card';
import { Expense, Category } from '../../types';
import { getExpensesByCategory, formatCurrency } from '../../utils/budgetUtils';

interface ExpensesChartProps {
  expenses: Expense[];
  categories: Category[];
}

const ExpensesChart: React.FC<ExpensesChartProps> = ({ expenses, categories }) => {
  const expenseCategories = useMemo(() => {
    return categories.filter(cat => cat.type === 'expense');
  }, [categories]);

  const expenseData = useMemo(() => {
    const expensesByCategory = getExpensesByCategory(expenses, categories);
    const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);
    
    // Map to array and calculate percentages
    return Object.entries(expensesByCategory)
      .filter(([_, amount]) => amount > 0) // Filter out zero amounts
      .map(([category, amount]) => {
        const categoryObj = expenseCategories.find(cat => cat.name === category);
        return {
          category,
          amount,
          percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
          color: categoryObj?.color || '#9CA3AF', // Default gray if category not found
        };
      })
      .sort((a, b) => b.amount - a.amount); // Sort by amount
  }, [expenses, categories, expenseCategories]);

  if (expenseData.length === 0) {
    return (
      <Card title="Expense Breakdown">
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <p>No expenses recorded yet</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Expense Breakdown">
      <div className="space-y-4">
        {/* Pie chart visualization */}
        <div className="relative h-64 w-64 mx-auto">
          <svg viewBox="0 0 100 100" className="transform -rotate-90 h-full w-full">
            {expenseData.reduce((elements, item, index, array) => {
              const total = array.reduce((sum, d) => sum + d.percentage, 0);
              let startAngle = array
                .slice(0, index)
                .reduce((sum, d) => sum + (d.percentage / total) * 360, 0);
              const angle = (item.percentage / total) * 360;
              
              // Convert angles to radians
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = ((startAngle + angle) * Math.PI) / 180;
              
              // Calculate path coordinates
              const x1 = 50 + 40 * Math.cos(startRad);
              const y1 = 50 + 40 * Math.sin(startRad);
              const x2 = 50 + 40 * Math.cos(endRad);
              const y2 = 50 + 40 * Math.sin(endRad);
              
              // Determine if the arc should be drawn as a large arc
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              elements.push(
                <path
                  key={item.category}
                  d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={item.color}
                  stroke="rgba(17, 24, 39, 0.8)"
                  strokeWidth="1"
                  className="transition-all duration-300 hover:opacity-90"
                />
              );
              
              return elements;
            }, [] as React.ReactElement[])}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-xs text-gray-400">Total</p>
              <p className="text-lg font-semibold text-white">
                {formatCurrency(expenses.reduce((sum, exp) => sum + exp.amount, 0))}
              </p>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6">
          {expenseData.map((item) => (
            <div key={item.category} className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-300">{item.category}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-white">{formatCurrency(item.amount)}</span>
                <span className="text-xs text-gray-400">{item.percentage.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ExpensesChart;