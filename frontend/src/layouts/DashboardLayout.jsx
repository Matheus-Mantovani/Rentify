import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X, Bell } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header / Topbar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
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

            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="w-6 h-6 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
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