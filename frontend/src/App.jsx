import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- LAYOUTS ---
import DashboardLayout from './layouts/DashboardLayout';

// --- COMPONENTS ---
import Navbar from './components/Navbar';

// --- PAGES: PUBLIC ---
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// --- PAGES: PROTECTED (DASHBOARD) ---
import Dashboard from './pages/Dashboard';
import PropertiesList from './pages/properties/PropertiesList';
import PropertyDetails from './pages/properties/PropertyDetails';
import TenantsList from './pages/tenants/TenantsList';
import TenantDetails from './pages/tenants/TenantDetails';
import GuarantorsList from './pages/guarantors/GuarantorsList';
import LandlordsList from './pages/landlords/LandlordsList';
import LandlordDetails from './pages/landlords/LandlordDetails';
import LandlordForm from './pages/landlords/LandlordForm';
import LeasesList from './pages/leases/LeasesList';
import LeaseForm from './pages/leases/LeaseForm';
import LeaseDetails from './pages/leases/LeaseDetails';
import PaymentsList from './pages/payments/PaymentsList';
import MaintenanceList from './pages/maintenance/MaintenanceList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route 
          path="/" 
          element={
            <>
              <Navbar />
              <Landing />
            </>
          } 
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          
          <Route path="properties" element={<PropertiesList />} />
          <Route path="properties/:id" element={<PropertyDetails />} />
          
          <Route path="tenants" element={<TenantsList />} />
          <Route path="tenants/:id" element={<TenantDetails />} />
          
          <Route path="guarantors" element={<GuarantorsList />} />

          <Route path="landlords" element={<LandlordsList />} />
          <Route path="landlords/new" element={<LandlordForm />} />
          <Route path="landlords/:id" element={<LandlordDetails />} />
          <Route path="landlords/:id/edit" element={<LandlordForm />} />

          <Route path="leases" element={<LeasesList />} />
          <Route path="leases/new" element={<LeaseForm />} />
          <Route path="leases/:id" element={<LeaseDetails />} />
          
          <Route path="payments" element={<PaymentsList />} />
          <Route path="maintenance" element={<MaintenanceList />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;