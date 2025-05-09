import Dashboard from './pages/Dashboard';
import { BudgetProvider } from './context/BudgetContext';

function App() {
  return (
    <BudgetProvider>
      <Dashboard />
    </BudgetProvider>
  );
}

export default App;