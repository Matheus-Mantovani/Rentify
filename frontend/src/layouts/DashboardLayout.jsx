import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, Calendar, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { reportService } from '../services/reportService';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const notifRef = useRef(null);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await reportService.getExpiringLeases(60);
        setNotifications(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifRef]);

  const handleNotificationClick = (leaseId) => {
    setIsNotifOpen(false);
    navigate(`/dashboard/leases/${leaseId}`);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Header / Topbar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            
            {/* Left Actions */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Painel de Controle</h1>
                <p className="text-sm text-slate-600">Visão geral do seu portfólio</p>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              
              {/* Notifications Dropdown */}
              <div className="relative" ref={notifRef}>
                <button 
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className={`relative p-2 rounded-lg transition-colors ${isNotifOpen ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-100 text-slate-600'}`}
                >
                  <Bell className="w-6 h-6" />
                  {!loading && notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center border border-white">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <h3 className="font-semibold text-slate-700 text-sm">Vencimentos Próximos</h3>
                        <span className="text-xs text-slate-500">Próx. 60 dias</span>
                    </div>
                    
                    <div className="max-h-[300px] overflow-y-auto">
                      {loading ? (
                        <div className="p-6 text-center text-slate-400 text-sm">Carregando...</div>
                      ) : notifications.length === 0 ? (
                        <div className="p-6 text-center text-slate-500 flex flex-col items-center gap-2">
                            <CheckCircle className="w-8 h-8 text-green-400 opacity-50" />
                            <span className="text-sm">Tudo em dia! Sem contratos vencendo.</span>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-50">
                          {notifications.map((item) => {
                            const isCritical = item.daysRemaining <= 15;
                            
                            return (
                              <button
                                key={item.leaseId}
                                onClick={() => handleNotificationClick(item.leaseId)}
                                className="w-full text-left p-3 hover:bg-slate-50 transition-colors flex items-start gap-3 group"
                              >
                                <div className={`mt-1 p-1.5 rounded-full ${isCritical ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                    {isCritical ? <AlertTriangle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                        {item.propertyAddress}
                                    </p>
                                    <p className="text-xs text-slate-500 mb-1">{item.tenantName}</p>
                                    <div className="flex items-center gap-2 text-xs font-medium">
                                        <span className={isCritical ? 'text-red-600' : 'text-yellow-600'}>
                                            Faltam {item.daysRemaining} dias
                                        </span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-slate-400 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> {formatDate(item.endDate)}
                                        </span>
                                    </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    
                    {notifications.length > 0 && (
                        <button 
                            onClick={() => { setIsNotifOpen(false); navigate('/dashboard/leases'); }}
                            className="w-full p-2 text-center text-xs font-bold text-blue-600 bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                            Ver todos os contratos
                        </button>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pl-4 border-l">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                  M
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}