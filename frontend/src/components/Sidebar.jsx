import { 
  Home, Building2, Users, DollarSign, Wrench, Calendar, 
  Settings, LogOut 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

export default function Sidebar({ isOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Building2, label: 'Imóveis', path: '/dashboard/properties' },
    { icon: Users, label: 'Inquilinos', path: '/dashboard/tenants' },
    { icon: DollarSign, label: 'Pagamentos', path: '/dashboard/payments' },
    { icon: Wrench, label: 'Manutenções', path: '/dashboard/maintenance' },
    { icon: Calendar, label: 'Contratos', path: '/dashboard/leases' }
  ];

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
      {/* Logo Area */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          {isOpen ? (
            <div className="flex items-center space-x-2">
              <Building2 className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-blue-600">Rentify</span>
            </div>
          ) : (
            <Building2 className="w-8 h-8 text-blue-600 mx-auto" />
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, idx) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-blue-50 text-blue-600 font-semibold' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
              title={!isOpen ? item.label : ''}
            >
              <item.icon className="w-5 h-5" />
              {isOpen && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t space-y-2">
        <button 
          onClick={() => navigate('/dashboard/settings')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 transition-all"
        >
          <Settings className="w-5 h-5" />
          {isOpen && <span>Configurações</span>}
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          {isOpen && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}