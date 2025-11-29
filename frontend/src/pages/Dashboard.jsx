import { useState, useEffect } from 'react';
import { 
  DollarSign, TrendingUp, Home, Wrench, 
  ArrowUpRight, ArrowDownRight, 
  Building2, Calendar, AlertCircle 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { reportService } from '../services/reportService';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [activities, setActivities] = useState([]);
  const [financialData, setFinancialData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentYear = new Date().getFullYear();

        const [summaryData, activitiesData, historyData] = await Promise.all([
          reportService.getDashboardSummary(),
          reportService.getRecentActivities(),
          reportService.getFinancialHistory(currentYear)
        ]);
        
        setSummary(summaryData);
        setActivities(activitiesData);
        processChartData(historyData);

      } catch (err) {
        console.error("Error loading dashboard:", err);
        setError('Não foi possível carregar os dados. Verifique sua conexão.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const processChartData = (data) => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    const fullYearData = months.map((name, index) => {
      const foundMonth = data.find(item => item.month === index + 1);
      return {
        name,
        receita: foundMonth ? foundMonth.totalRevenue : 0,
        despesa: foundMonth ? foundMonth.totalExpenses : 0
      };
    });

    setFinancialData(fullYearData);
  };

  const formatMoney = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
        <AlertCircle className="w-6 h-6" />
        <span>{error}</span>
      </div>
    );
  }

  const stats = [
    {
      title: 'Receita Mensal',
      value: formatMoney(summary?.currentMonthRevenue),
      change: summary?.revenueChangePercentage ? `${summary.revenueChangePercentage}%` : '0%',
      changeType: (summary?.revenueChangePercentage || 0) >= 0 ? 'positive' : 'negative',
      icon: DollarSign,
      bgColor: 'bg-green-500',
      lightBg: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Taxa de Ocupação',
      value: summary?.occupancyRate ? `${summary.occupancyRate.toFixed(1)}%` : '0%',
      change: summary?.occupancyRateChangePercentage ? `${summary.occupancyRateChangePercentage}%` : '0%',
      changeType: (summary?.occupancyRateChangePercentage || 0) >= 0 ? 'positive' : 'negative',
      icon: TrendingUp,
      bgColor: 'bg-blue-500',
      lightBg: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Imóveis Alugados',
      value: summary?.rentedProperties || 0,
      subtitle: `de ${summary?.totalProperties || 0} imóveis`,
      icon: Home,
      bgColor: 'bg-purple-500',
      lightBg: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Em Manutenção',
      value: summary?.maintenanceProperties || 0,
      subtitle: `Custo est.: ${formatMoney(summary?.outstandingMaintenanceCosts)}`,
      icon: Wrench,
      bgColor: 'bg-orange-500',
      lightBg: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-slate-200 shadow-lg rounded-lg">
          <p className="font-bold text-slate-800 mb-2">{label}</p>
          <p className="text-green-600 text-sm">
            Receita: {formatMoney(payload[0].value)}
          </p>
          {payload[1] && (
            <p className="text-red-500 text-sm">
              Despesa: {formatMoney(payload[1].value)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-default">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.lightBg} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.changeType === 'positive' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-slate-600 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
            {stat.subtitle && <p className="text-sm text-slate-500">{stat.subtitle}</p>}
          </div>
        ))}
      </div>

      {/* Charts & Actions Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm min-h-[320px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">Fluxo Financeiro (2025)</h2>
            <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500">
              <option>Este Ano</option>
            </select>
          </div>
          
          <div className="flex-1 w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748B', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  tickFormatter={(value) => `R$${value/1000}k`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F1F5F9' }} />
                <Bar 
                  dataKey="receita" 
                  name="Receita" 
                  radius={[4, 4, 0, 0]} 
                  barSize={30}
                >
                   {financialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="url(#colorRevenue)" />
                    ))}
                </Bar>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#2563EB" stopOpacity={1}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Ações Rápidas</h2>
          <div className="space-y-3">
            {[
              { label: 'Novo Imóvel', icon: Building2, color: 'blue', path: '/properties/new' },
              { label: 'Registrar Pagamento', icon: DollarSign, color: 'green', path: '/payments/new' },
              { label: 'Nova Manutenção', icon: Wrench, color: 'orange', path: '/maintenance/new' },
              { label: 'Novo Contrato', icon: Calendar, color: 'purple', path: '/leases/new' }
            ].map((action, idx) => (
              <button key={idx} className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-all group">
                <div className={`bg-${action.color}-50 p-2 rounded-md group-hover:bg-${action.color}-100 transition-colors`}>
                  <action.icon className={`w-5 h-5 text-${action.color}-600`} />
                </div>
                <span className="font-medium text-slate-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Atividades Recentes</h2>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-slate-500 text-center py-8">Nenhuma atividade recente encontrada.</p>
          ) : (
            activities.map((activity, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  activity.type === 'PAYMENT' ? 'bg-green-100' :
                  activity.type === 'MAINTENANCE' ? 'bg-orange-100' : 'bg-yellow-100'
                }`}>
                  {activity.type === 'PAYMENT' && <DollarSign className="w-5 h-5 text-green-600" />}
                  {activity.type === 'MAINTENANCE' && <Wrench className="w-5 h-5 text-orange-600" />}
                  {activity.type === 'EXPIRING_LEASE' && <AlertCircle className="w-5 h-5 text-yellow-600" />}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">{activity.title}</p>
                  <p className="text-sm text-slate-600 truncate">{activity.subtitle}</p>
                </div>

                <div className="text-right shrink-0">
                  {activity.value && (
                    <p className="font-bold text-green-600">{formatMoney(activity.value)}</p>
                  )}
                  
                  {activity.daysRemaining !== null && (
                    <p className="font-bold text-yellow-600">{activity.daysRemaining} dias</p>
                  )}

                  <p className="text-xs text-slate-500 mt-0.5">{activity.date}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}