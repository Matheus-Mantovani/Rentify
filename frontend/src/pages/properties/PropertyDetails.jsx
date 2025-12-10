import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Building2, DollarSign, 
  FileText, Calendar, TrendingUp, Edit, AlertCircle,
  User, CheckCircle, XCircle
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { propertyService } from '../../services/propertyService';
import { leaseService } from '../../services/leaseService';
import PropertyForm from './PropertyForm';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [property, setProperty] = useState(null);
  const [financialHistory, setFinancialHistory] = useState([]);
  const [valuationHistory, setValuationHistory] = useState([]);
  const [occupancyHistory, setOccupancyHistory] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [availableYears, setAvailableYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [occupancyLoading, setOccupancyLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const statusLabels = {
    AVAILABLE: 'Disponível',
    RENTED: 'Alugado',
    UNDER_MAINTENANCE: 'Em Manutenção',
    INACTIVE: 'Inativo'
  };

  const conditionLabels = {
    EXCELLENT: 'Excelente',
    GOOD: 'Bom',
    FAIR: 'Regular',
    NEEDS_REPAIRS: 'Reparos Necessários'
  };

  const loadPropertyData = async () => {
    try {
      const data = await propertyService.getPropertyById(id);
      setProperty(data);
    } catch (err) {
      console.error(err);
      setError('Falha ao carregar detalhes do imóvel.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadPropertyData();
  }, [id]);

  useEffect(() => {
    if (activeTab === 'financials' && financialHistory.length === 0) {
      const loadHistory = async () => {
        setHistoryLoading(true);
        try {
          const [financialsData, valuationsData] = await Promise.all([
            propertyService.getPropertyFinancialHistory(id),
            propertyService.getPropertyValuationHistory(id)
          ]);
          
          const formattedFinancials = financialsData.map(item => {
            const [year, month, day] = item.recordDate.split('-');
            const dateObj = new Date(year, month - 1, day);
            return {
              ...item,
              year: parseInt(year),
              timestamp: dateObj.getTime(),
              dateFormatted: dateObj.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
            };
          }).sort((a, b) => a.timestamp - b.timestamp);
            
          setFinancialHistory(formattedFinancials);

          const formattedValuations = valuationsData.map(item => {
            const [year, month, day] = item.recordDate.split('-');
            const dateObj = new Date(year, month - 1, day);
            return {
              ...item,
              dateFormatted: dateObj.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
              timestamp: dateObj.getTime(),
              propertyValue: item.propertyValue
            };
          }).sort((a, b) => a.timestamp - b.timestamp);

          setValuationHistory(formattedValuations);

          const allYears = new Set([
              ...formattedFinancials.map(i => i.year),
              ...formattedValuations.map(i => parseInt(i.recordDate ? i.recordDate.split('-')[0] : 0))
          ]);
          const validYears = [...allYears].filter(y => y > 0).sort((a, b) => b - a);
          setAvailableYears(validYears);

        } catch (err) {
          console.error("Falha ao carregar históricos:", err);
        } finally {
          setHistoryLoading(false);
        }
      };
      loadHistory();
    }
  }, [activeTab, id, financialHistory.length]);

  useEffect(() => {
    if (activeTab === 'history' && occupancyHistory.length === 0) {
      const loadOccupancy = async () => {
        setOccupancyLoading(true);
        try {
          const allLeases = await leaseService.getAllLeases();
          const propertyLeases = allLeases
            .filter(lease => lease.property?.id === parseInt(id))
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

          setOccupancyHistory(propertyLeases);
        } catch (err) {
          console.error("Falha ao carregar contratos:", err);
        } finally {
          setOccupancyLoading(false);
        }
      };
      loadOccupancy();
    }
  }, [activeTab, id, occupancyHistory.length]);

  const formatMoney = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day).toLocaleDateString('pt-BR');
  };

  const formatCPF = (cpf) => {
    if (!cpf) return '-';
    const cleaned = cpf.replace(/\D/g, '');
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
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

  const getMonthlyFixedCost = () => {
    if (!property) return 0;
    const monthlyTax = (property.propertyTaxValue || 0) / 12;
    return (property.condoFee || 0) + monthlyTax;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg text-sm">
          <p className="font-bold text-slate-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.stroke || entry.fill }}>
              {entry.name}: {formatMoney(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const filteredCosts = selectedYear === 'ALL' 
    ? financialHistory 
    : financialHistory.filter(item => item.year === parseInt(selectedYear));

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (error || !property) return (
    <div className="p-8 text-center">
      <h2 className="text-red-600 text-xl font-bold mb-2">Erro</h2>
      <p className="text-slate-600 mb-4">{error || 'Imóvel não encontrado'}</p>
      <button onClick={() => navigate('/dashboard/properties')} className="text-blue-600 hover:underline">Voltar para a lista</button>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 justify-between">
        <div className="flex items-center gap-4 flex-1">
            <button 
                onClick={() => navigate('/dashboard/properties')}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                title="Voltar"
            >
                <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>
            <div>
                <h1 className="text-2xl font-bold text-slate-900">{property.address}</h1>
                <p className="text-slate-500 flex items-center gap-1 text-sm mt-1">
                    <MapPin className="w-4 h-4" />
                    {property.neighborhood}, {property.cityName} - {property.stateCode}
                </p>
            </div>
        </div>
        
        <div className="flex items-center gap-3">
            <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(property.status)}`}>
                {statusLabels[property.status] || property.status}
            </div>
            <button 
                onClick={() => setShowModal(true)} 
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
                <Edit className="w-4 h-4" /> Editar Imóvel
            </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-6 overflow-x-auto">
          {['overview', 'financials', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 text-sm font-medium transition-colors relative whitespace-nowrap ${
                activeTab === tab 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'overview' && 'Visão Geral'}
              {tab === 'financials' && 'Financeiro & Análise'}
              {tab === 'history' && 'Histórico de Ocupação'}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="animate-in fade-in duration-300 min-h-[400px]">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" /> Detalhes do Imóvel
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                  <div>
                    <dt className="text-sm text-slate-500">Endereço Completo</dt>
                    <dd className="text-slate-900 font-medium mt-1">{property.address}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500">Complemento</dt>
                    <dd className="text-slate-900 font-medium mt-1">{property.addressComplement || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500">Bairro</dt>
                    <dd className="text-slate-900 font-medium mt-1">{property.neighborhood}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500">CEP</dt>
                    <dd className="text-slate-900 font-medium mt-1">{property.postalCode}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500">Cidade / UF</dt>
                    <dd className="text-slate-900 font-medium mt-1">{property.cityName} / {property.stateCode}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500">Matrícula</dt>
                    <dd className="text-slate-900 font-medium mt-1">{property.registrationNumber || 'Não informada'}</dd>
                  </div>
                </dl>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-500" /> Observações Internas
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {property.notes || 'Nenhuma observação registrada para este imóvel.'}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" /> Valores Vigentes
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                    <span className="text-slate-600 text-sm">Valor de Mercado</span>
                    <span className="font-bold text-lg text-slate-900">{formatMoney(property.currentMarketValue)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                    <span className="text-slate-600 text-sm">Condomínio Mensal</span>
                    <span className="font-semibold text-slate-900">{formatMoney(property.condoFee)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">IPTU (Anual)</span>
                    <span className="font-semibold text-slate-900">{formatMoney(property.propertyTaxValue)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                 <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                   <TrendingUp className="w-4 h-4" /> Status Atual
                 </h4>
                 <p className="text-sm text-blue-700">
                   Este imóvel está atualmente <strong>{statusLabels[property.status]?.toLowerCase()}</strong>. 
                   {property.status === 'RENTED' 
                     ? ' Verifique a aba de Contratos para detalhes do aluguel.' 
                     : ' Lembre-se de manter os dados atualizados para atrair inquilinos.'}
                 </p>
              </div>
            </div>
          </div>
        )}

        {/* Financials Tab */}
        {activeTab === 'financials' && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-sm text-slate-500 font-medium mb-1">Valor Patrimonial</p>
                    <h3 className="text-2xl font-bold text-blue-600">{formatMoney(property.currentMarketValue)}</h3>
                    <p className="text-xs text-slate-400 mt-1">Baseado na última avaliação</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-sm text-slate-500 font-medium mb-1">Custo Fixo (Vacância)</p>
                    <h3 className="text-2xl font-bold text-slate-700">{formatMoney(getMonthlyFixedCost())}<span className="text-xs font-normal text-slate-400">/mês</span></h3>
                    <p className="text-xs text-slate-400 mt-1">Condomínio + (IPTU proporcional)</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-sm text-slate-500 font-medium mb-1">IPTU Total</p>
                    <h3 className="text-2xl font-bold text-slate-700">{formatMoney(property.propertyTaxValue)}</h3>
                    <p className="text-xs text-slate-400 mt-1">Custo anual recorrente</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-slate-100 gap-4">
                <h3 className="text-lg font-bold text-slate-900">Análise Gráfica</h3>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-slate-500">Filtrar Ano:</label>
                    <select 
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500 cursor-pointer min-w-[120px]"
                      disabled={financialHistory.length === 0}
                    >
                      <option value="ALL">Todo período</option>
                      {availableYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                </div>
            </div>

            {historyLoading ? (
               <div className="flex justify-center p-12 bg-slate-50 rounded-xl"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
                <>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" /> Evolução Patrimonial (Valor de Mercado)
                        </h4>
                        <div className="h-[300px]">
                            {valuationHistory.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={valuationHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                        <XAxis dataKey="dateFormatted" stroke="#94a3b8" tick={{fontSize: 12}} />
                                        <YAxis stroke="#94a3b8" tick={{fontSize: 12}} tickFormatter={(val) => `R$${val/1000}k`} width={80} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line 
                                            type="monotone" 
                                            dataKey="propertyValue" 
                                            name="Valor Imóvel"
                                            stroke="#2563eb" 
                                            strokeWidth={3}
                                            dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                                            activeDot={{ r: 7 }} 
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400 italic">
                                    Sem dados de valorização registrados.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" /> Histórico de Custos (Condomínio & Impostos)
                        </h4>
                        <div className="h-[300px]">
                            {filteredCosts.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={filteredCosts} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                        <XAxis dataKey="dateFormatted" stroke="#94a3b8" tick={{fontSize: 12}} />
                                        <YAxis stroke="#94a3b8" tick={{fontSize: 12}} tickFormatter={(val) => `R$${val}`} width={80} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                        <Line 
                                            type="monotone" 
                                            dataKey="condoFee" 
                                            name="Condomínio" 
                                            stroke="#f59e0b" 
                                            strokeWidth={2} 
                                            dot={{r:3}}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="propertyTaxValue" 
                                            name="IPTU Anual" 
                                            stroke="#ef4444" 
                                            strokeWidth={2} 
                                            dot={{r:3}}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400 italic">
                                    Sem histórico de custos para o período selecionado.
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
           <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">Histórico de Ocupação</h3>
                <button 
                  onClick={() => navigate('/dashboard/leases')}
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  Ver todos contratos <ArrowLeft className="w-3 h-3 rotate-180" />
                </button>
             </div>

             {occupancyLoading ? (
                <div className="flex justify-center p-12 bg-slate-50 rounded-xl"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
             ) : occupancyHistory.length === 0 ? (
                <div className="bg-slate-50 p-12 rounded-xl text-center border border-dashed border-slate-300">
                  <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900">Nenhum registro de ocupação</h3>
                  <p className="text-slate-500 mt-2">
                    Este imóvel ainda não possui histórico de contratos vinculados.
                  </p>
                </div>
             ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4">Inquilino</th>
                          <th className="px-6 py-4">Período</th>
                          <th className="px-6 py-4">Valor Base</th>
                          <th className="px-6 py-4">Saída (Motivo)</th>
                          <th className="px-6 py-4 text-center">Status</th>
                          <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {occupancyHistory.map(lease => (
                          <tr key={lease.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-medium text-slate-900">{lease.tenant?.fullName || 'Desconhecido'}</div>
                              <div className="text-xs text-slate-500">CPF: {formatCPF(lease.tenant?.cpf)}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-slate-600">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                {formatDate(lease.startDate)} - {lease.moveOutDate ? formatDate(lease.moveOutDate) : formatDate(lease.endDate)}
                              </div>
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-900">
                              {formatMoney(lease.baseRentValue)}
                            </td>
                            <td className="px-6 py-4">
                              {lease.moveOutReason ? (
                                <div className="text-slate-600">
                                  <span className="block text-xs uppercase font-bold text-slate-400 mb-0.5">
                                    {conditionLabels[lease.moveOutCondition] || '-'}
                                  </span>
                                  {lease.moveOutReason}
                                </div>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {lease.status === 'ACTIVE' ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 gap-1">
                                  <CheckCircle className="w-3 h-3" /> Vigente
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 gap-1">
                                  <XCircle className="w-3 h-3" /> Encerrado
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => navigate(`/dashboard/leases/${lease.id}`)}
                                className="text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors"
                              >
                                Ver Contrato
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
             )}
           </div>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <PropertyForm 
              onClose={() => setShowModal(false)} 
              onSuccess={loadPropertyData}
              propertyToEdit={property}
            />
        </div>
      )}
    </div>
  );
}