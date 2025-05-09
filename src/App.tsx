import Dashboard from './pages/Dashboard';
import { BudgetProvider } from './context/BudgetContext';
import { useEffect, useState } from 'react';
import MobileShare from './components/share/MobileShare';
import TabShare from './components/share/TabShare';

function App() {
    const [deviceType, setDeviceType] = useState<"big" | "small">("big");

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(window.innerWidth < 1024 ? "small" : "big");
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <BudgetProvider>
       {deviceType === "small" ? <MobileShare /> : <TabShare />}
      <Dashboard />
    </BudgetProvider>
  );
}

export default App;