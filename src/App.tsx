import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import MyObjectsPage from './pages/my-objects/MyObjectsPage';
import NewObjectPage from './pages/my-objects/NewObjectPage';
import LeadsCatalogPage from './pages/leads-catalog/LeadsCatalogPage';
import DealsPage from './pages/deals/DealsPage';

const App = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/my-objects" element={<MyObjectsPage />} />
      <Route path="/my-objects/new" element={<NewObjectPage />} />
      <Route path="/leads-catalog" element={<LeadsCatalogPage />} />
      <Route path="/deals" element={<DealsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);

export default App;
