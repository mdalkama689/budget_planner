import React from 'react';
import { Target, Sparkles } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { SavingsGoal } from '../../types';
import { formatCurrency } from '../../utils/budgetUtils';

interface SavingsGoalsProps {
  goals: SavingsGoal[];
  onAddClick: () => void;
  onUpdateGoal: (id: string, amount: number) => void;
}

const SavingsGoals: React.FC<SavingsGoalsProps> = ({ 
  goals, 
  onAddClick,
  onUpdateGoal
}) => {
  // Format date to readable format
  const formatDeadline = (dateString?: string) => {
    if (!dateString) return 'No deadline';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }).format(date);
  };
  
  // Calculate days remaining until deadline
  const getDaysRemaining = (deadlineStr?: string) => {
    if (!deadlineStr) return null;
    
    const deadline = new Date(deadlineStr);
    const today = new Date();
    
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };
  
  // Add money to goal handler
  const handleAddToGoal = (id: string, currentAmount: number) => {
    const amount = prompt('Enter amount to add:');
    if (amount !== null) {
      const parsedAmount = parseFloat(amount);
      if (!isNaN(parsedAmount) && parsedAmount > 0) {
        onUpdateGoal(id, currentAmount + parsedAmount);
      }
    }
  };
  
  return (
    <Card title="Savings Goals" className="h-full">
      <div className="space-y-4">
        {goals.length > 0 ? (
          goals.map(goal => {
            const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
            const daysRemaining = goal.deadline ? getDaysRemaining(goal.deadline) : null;
            
            return (
              <div key={goal.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <Target className="h-5 w-5 text-purple-500 mr-2" />
                    <h4 className="text-lg font-medium text-white">{goal.name}</h4>
                  </div>
                  {goal.deadline && (
                    <div className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                      {daysRemaining === 0 
                        ? 'Due today!'
                        : `${daysRemaining} days left`}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white font-medium">
                    {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                  </span>
                </div>
                
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-3">
                  <div 
                    className={`h-full rounded-full ${
                      progressPercentage < 25 ? 'bg-red-500' :
                      progressPercentage < 50 ? 'bg-orange-500' :
                      progressPercentage < 75 ? 'bg-yellow-500' :
                      progressPercentage < 100 ? 'bg-teal-500' :
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-400">
                    {goal.deadline 
                      ? `Deadline: ${formatDeadline(goal.deadline)}` 
                      : 'No deadline set'}
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleAddToGoal(goal.id, goal.currentAmount)}
                  >
                    Add funds
                  </Button>
                </div>
                
                {progressPercentage >= 100 && (
                  <div className="mt-2 p-2 bg-emerald-900/30 border border-emerald-800 rounded-lg flex items-center">
                    <Sparkles className="h-4 w-4 text-emerald-500 mr-2" />
                    <span className="text-sm text-emerald-400">Goal completed!</span>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <Target className="h-10 w-10 mb-2 text-gray-600" />
            <p>No savings goals yet</p>
          </div>
        )}
        
        <div className="pt-2">
          <Button 
            variant="primary" 
            fullWidth
            onClick={onAddClick}
          >
            Add New Savings Goal
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SavingsGoals;