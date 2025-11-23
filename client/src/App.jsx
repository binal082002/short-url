import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/Dashboard";
import StatsPage from "./pages/StatsPage";
import HealthPage from "./pages/HealthPage";
import RedirectPage from "./pages/RedirectPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/code/:code" element={<StatsPage />} />
      <Route path="/healthz" element={<HealthPage />} />
      <Route path="/:code" element={<RedirectPage />} />
    </Routes>
  );
}

export default App;
