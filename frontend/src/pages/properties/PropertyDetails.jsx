import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Building2, DollarSign, 
  FileText, Calendar, TrendingUp, Edit, AlertCircle
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { propertyService } from '../../services/propertyService';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Data States
  const [property, setProperty] = useState(null);
  const [financialHistory, setFinancialHistory] = useState([]);
  
  // Filter States
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [availableYears, setAvailableYears] = useState([]);

  // UI States
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Initial Load
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await propertyService.getPropertyById(id);
        setProperty(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load property details.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  // Financial History Load (Lazy)
  useEffect(() => {
    if (activeTab === 'financials' && financialHistory.length === 0) {
      const loadHistory = async () => {
        setHistoryLoading(true);
        try {
          const data = await propertyService.getPropertyFinancialHistory(id);
          
          const formattedData = data.map(item => {
            const [year, month, day] = item.recordDate.split('-');
            const dateObj = new Date(year, month - 1, day);
            
            return {
              ...item,
              year: parseInt(year),
              timestamp: dateObj.getTime(),
              dateFormatted: dateObj.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
            };
          })
          .sort((a, b) => a.timestamp - b.timestamp);
            
          setFinancialHistory(formattedData);

          const years = [...new Set(formattedData.map(item => item.year))].sort((a, b) => b - a);
          setAvailableYears(years);

        } catch (err) {
          console.error("Failed to load financial history:", err);
          setFinancialHistory([]);
          setAvailableYears([]);
        } finally {
          setHistoryLoading(false);
        }
      };
      loadHistory();
    }
  }, [activeTab, id, financialHistory.length]);

  // Helpers
  const formatMoney = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  const getStatusColor = (status) => {
    const colors = {
      AVAILABLE: 'bg-green-100 text-green-700 border-green-200',
      RENTED: 'bg-blue-100 text-blue-700 border-blue-200',
      UNDER_MAINTENANCE: 'bg-orange-100 text-orange-700 border-orange-200',
      INACTIVE: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[status] || 'bg-gray-100';
  };

  // Chart Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg text-sm">
          <p className="font-bold text-slate-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatMoney(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Filter Logic for Chart
  const filteredHistory = selectedYear === 'ALL' 
    ? financialHistory 
    : financialHistory.filter(item => item.year === parseInt(selectedYear));

  // Render Loading
  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  // Render Error
  if (error || !property) return (
    <div className="p-8 text-center">
      <h2 className="text-red-600 text-xl font-bold mb-2">Error</h2>
      <p className="text-slate-600 mb-4">{error || 'Property not found'}</p>
      <button onClick={() => navigate('/dashboard/properties')} className="text-blue-600 hover:underline">Back to list</button>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/dashboard/properties')}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{property.address}</h1>
          <p className="text-slate-500 flex items-center gap-1 text-sm">
            <MapPin className="w-4 h-4" />
            {property.neighborhood}, {property.cityName} - {property.stateCode}
          </p>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(property.status)}`}>
          {property.status}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Edit className="w-4 h-4" /> Edit
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-6">
          {['overview', 'financials', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 text-sm font-medium transition-colors relative ${
                activeTab === tab 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'overview' && 'Overview'}
              {tab === 'financials' && 'Financials'}
              {tab === 'history' && 'Occupancy History'}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="animate-in fade-in duration-300">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" /> Property Details
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                  <div>
                    <dt className="text-sm text-slate-500">Address</dt>
                    <dd className="text-slate-900 font-medium mt-1">{property.address}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500">Complement</dt>
                    <dd className="text-slate-900 font-medium mt-1">{property.addressComplement || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500">Neighborhood</dt>
                    <dd className="text-slate-900 font-medium mt-1">{property.neighborhood}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500">Postal Code</dt>
                    <dd className="text-slate-900 font-medium mt-1">{property.postalCode}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500">City/State</dt>
                    <dd className="text-slate-900 font-medium mt-1">{property.cityName} / {property.stateCode}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500">Registry Number</dt>
                    <dd className="text-slate-900 font-medium mt-1">{property.registrationNumber || 'N/A'}</dd>
                  </div>
                </dl>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-500" /> Notes
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {property.notes || 'No notes registered.'}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" /> Current Values
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                    <span className="text-slate-600">Market Value</span>
                    <span className="font-bold text-lg text-slate-900">{formatMoney(property.currentMarketValue)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                    <span className="text-slate-600">Condo Fee</span>
                    <span className="font-semibold text-slate-900">{formatMoney(property.condoFee)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Annual Tax (IPTU)</span>
                    <span className="font-semibold text-slate-900">{formatMoney(property.propertyTaxValue)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                 <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                   <TrendingUp className="w-4 h-4" /> Performance
                 </h4>
                 <p className="text-sm text-blue-700 mb-4">
                   This property is currently {property.status === 'RENTED' ? 'generating revenue.' : 'vacant.'}
                 </p>
              </div>
            </div>
          </div>
        )}

        {/* Financials Tab */}
        {activeTab === 'financials' && (
          <div className="space-y-6">
            
            {/* Tab Header with Filter */}
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Cost Evolution</h3>
                
                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500 cursor-pointer"
                  disabled={financialHistory.length === 0}
                >
                  <option value="ALL">All time</option>
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
            </div>

            {/* Chart Area */}
            {historyLoading ? (
               <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
            ) : financialHistory.length === 0 ? (
               <div className="bg-slate-50 p-12 rounded-xl text-center border border-dashed border-slate-300">
                  <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600">No financial history found for this property.</p>
               </div>
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-[400px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="dateFormatted" stroke="#64748b" tick={{fontSize: 12}} />
                      <YAxis stroke="#64748b" tick={{fontSize: 12}} tickFormatter={(val) => `R$${val}`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="condoFee" 
                        name="Condo Fee" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="propertyTaxValue" 
                        name="Annual Tax" 
                        stroke="#ef4444" 
                        strokeWidth={2} 
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                 </ResponsiveContainer>
              </div>
            )}
            
            {/* Data Table */}
            {filteredHistory.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-sm text-left">
                   <thead className="bg-slate-50 text-slate-600 font-semibold">
                      <tr>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3">Condo Fee</th>
                        <th className="px-6 py-3">Annual Tax</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {filteredHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                           <td className="px-6 py-3">{item.dateFormatted}</td>
                           <td className="px-6 py-3 text-blue-600 font-medium">{formatMoney(item.condoFee)}</td>
                           <td className="px-6 py-3 text-red-600 font-medium">{formatMoney(item.propertyTaxValue)}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* History Tab (Placeholder) */}
        {activeTab === 'history' && (
           <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-100 text-center">
             <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
             <h3 className="text-lg font-medium text-slate-900">Occupancy History</h3>
             <p className="text-slate-500">Previous tenants and lease contracts will be listed here.</p>
           </div>
        )}
      </div>
    </div>
  );
}