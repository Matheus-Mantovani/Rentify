import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { 
  ArrowLeft, User, MapPin, FileText, Building2, 
  CreditCard, Edit, Trash2, Calendar, CheckCircle, XCircle, 
  ChevronRight, TrendingUp, Wallet, AlertTriangle, Search, Download,
  Filter, ArrowUpDown, Clock, Zap, Landmark, Banknote, FileCheck, AlertCircle, ArrowUp, ArrowDown,
  Printer, CheckSquare, Square, CreditCard as CardIcon, HelpCircle
} from 'lucide-react';

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

import { landlordService } from '../../services/landlordService';
import { leaseService } from '../../services/leaseService';
import { reportService } from '../../services/reportService';
import { paymentService } from '../../services/paymentService';
import RentReceiptBatch from '../../components/RentReceiptBatch';

export default function LandlordDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- DATA STATES ---
  const [landlord, setLandlord] = useState(null);
  const [leases, setLeases] = useState([]);
  const [payments, setPayments] = useState([]);
  const [financialReport, setFinancialReport] = useState(null);

  // --- UI STATES ---
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // --- FILTER STATES (CONTRACTS) ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortOption, setSortOption] = useState('newest');
  const [showExpiringOnly, setShowExpiringOnly] = useState(false);

  // --- FILTER & SORT STATES (PAYMENTS) ---
  const [paymentSearch, setPaymentSearch] = useState('');
  const [paymentStartDate, setPaymentStartDate] = useState('');
  const [paymentEndDate, setPaymentEndDate] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('ALL');
  const [paymentSortConfig, setPaymentSortConfig] = useState({ key: 'date', direction: 'desc' });

  // --- SELECTION & PRINT STATES ---
  const [selectedIds, setSelectedIds] = useState(new Set());
  const batchRef = useRef(null);
  const [batchData, setBatchData] = useState(null);

  // --- PRINT HOOK ---
  const handlePrintBatch = useReactToPrint({
    contentRef: batchRef,
    documentTitle: `Recibos_Locador_${id}_${new Date().toISOString().split('T')[0]}`,
    onAfterPrint: () => {
        setBatchData(null);
        setSelectedIds(new Set());
    },
    removeAfterPrint: true
  });

  useEffect(() => {
    if (batchData && batchData.length > 0) {
        handlePrintBatch();
    }
  }, [batchData, handlePrintBatch]);

  useEffect(() => {
    loadInitialData();
  }, [id]);

  useEffect(() => {
    if (activeTab === 'financials') loadFinancialReport();
    if (activeTab === 'payments' && payments.length === 0) loadPaymentsHistory();
  }, [activeTab, selectedYear]);

  // --- DATA LOADING ---
  const loadInitialData = async () => {
    try {
      const [landlordData, leasesData] = await Promise.all([
        landlordService.getLandlordById(id),
        leaseService.getAllLeases({ landlordProfileId: id })
      ]);
      setLandlord(landlordData);
      setLeases(leasesData);
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar detalhes.');
      navigate('/dashboard/landlords');
    } finally {
      setLoading(false);
    }
  };

  const loadFinancialReport = async () => {
    try {
      const data = await reportService.getAnnualIncome(id, selectedYear);
      setFinancialReport(data);
    } catch (err) {
      console.error("Erro ao carregar relatório financeiro", err);
    }
  };

  const loadPaymentsHistory = async () => {
    try {
      const data = await paymentService.getAllPayments({ landlordProfileId: id });
      setPayments(data);
    } catch (err) {
      console.error("Erro ao carregar pagamentos", err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem a certeza que deseja eliminar este perfil?')) {
      try {
        await landlordService.deleteLandlord(id);
        navigate('/dashboard/landlords');
      } catch (err) {
        alert('Erro ao eliminar. Verifique contratos ativos.');
      }
    }
  };

  // --- FORMATTING HELPERS ---
  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('pt-BR') : '-';
  
  const translateMaritalStatus = (status) => {
    const map = {
      'SINGLE': 'Solteiro(a)',
      'MARRIED': 'Casado(a)',
      'DIVORCED': 'Divorciado(a)',
      'WIDOWED': 'Viúvo(a)',
      'STABLE_UNION': 'União Estável'
    };
    return map[status] || status || '-';
  };

  const isExpiringSoon = (date, status) => {
    if (status !== 'ACTIVE' || !date) return false;
    const diff = new Date(date) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 && days <= 60;
  };

  const getPaymentMethodInfo = (method) => {
    switch (method) {
      case 'PIX': return { icon: <Zap className="w-4 h-4 text-green-600"/>, label: 'Pix', bg: 'bg-green-50' };
      case 'BANK_SLIP': return { icon: <FileText className="w-4 h-4 text-slate-600"/>, label: 'Boleto', bg: 'bg-slate-100' };
      case 'WIRE_TRANSFER': return { icon: <Landmark className="w-4 h-4 text-blue-600"/>, label: 'Transf.', bg: 'bg-blue-50' };
      case 'CASH': return { icon: <Banknote className="w-4 h-4 text-emerald-600"/>, label: 'Dinheiro', bg: 'bg-emerald-50' };
      case 'CREDIT_CARD': return { icon: <CardIcon className="w-4 h-4 text-purple-600"/>, label: 'Cartão', bg: 'bg-purple-50' };
      case 'OTHER': return { icon: <HelpCircle className="w-4 h-4 text-gray-500"/>, label: 'Outros', bg: 'bg-gray-100' };
      default: return { icon: <CreditCard className="w-4 h-4 text-slate-400"/>, label: method, bg: 'bg-slate-50' };
    }
  };

  // --- SELECTION & PRINT LOGIC ---
  const toggleSelection = (paymentId) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(paymentId)) {
        newSelected.delete(paymentId);
    } else {
        if (newSelected.size >= 4) {
            alert("Máximo de 4 recibos por página para impressão.");
            return;
        }
        newSelected.add(paymentId);
    }
    setSelectedIds(newSelected);
  };

  const preparePrint = () => {
    const dataToPrint = filteredPayments
        .filter(p => selectedIds.has(p.id))
        .map(payment => {
            const lease = leases.find(l => l.id === payment.leaseId);
            return {
                lease: lease, 
                payment: payment 
            };
        });
    setBatchData(dataToPrint);
  };

  // --- PAYMENT SORT LOGIC ---
  const handlePaymentSort = (key) => {
    let direction = 'asc';
    if (paymentSortConfig.key === key && paymentSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setPaymentSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (paymentSortConfig.key !== columnKey) return <ArrowUpDown className="w-4 h-4 ml-1 text-slate-400" />;
    if (paymentSortConfig.direction === 'asc') return <ArrowUp className="w-4 h-4 ml-1 text-blue-600" />;
    return <ArrowDown className="w-4 h-4 ml-1 text-blue-600" />;
  };

  // --- KPI CALCULATION ---
  const kpiData = useMemo(() => {
    if (!leases.length) return { totalRevenue: 0, activeCount: 0, avgTicket: 0, totalProperties: 0 };
    const activeLeases = leases.filter(l => l.status === 'ACTIVE');
    const totalRevenue = activeLeases.reduce((acc, curr) => acc + (curr.baseRentValue || 0), 0);
    const activeCount = activeLeases.length;
    return { 
      totalRevenue, 
      activeCount, 
      totalProperties: new Set(leases.map(l => l.property?.id)).size 
    };
  }, [leases]);

  // --- FILTER LOGIC: CONTRACTS ---
  const filteredLeases = useMemo(() => {
    let result = leases;
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(lease => 
        lease.tenant?.fullName.toLowerCase().includes(lowerTerm) ||
        lease.property?.address.toLowerCase().includes(lowerTerm)
      );
    }
    if (statusFilter !== 'ALL') {
      result = result.filter(lease => lease.status === statusFilter);
    }
    if (showExpiringOnly) {
      result = result.filter(lease => isExpiringSoon(lease.endDate, lease.status));
    }
    result = [...result].sort((a, b) => {
      switch (sortOption) {
        case 'value_high': return (b.baseRentValue || 0) - (a.baseRentValue || 0);
        case 'value_low': return (a.baseRentValue || 0) - (b.baseRentValue || 0);
        case 'expiring': return new Date(a.endDate) - new Date(b.endDate);
        case 'oldest': return new Date(a.startDate) - new Date(b.startDate);
        case 'newest': default: return new Date(b.startDate) - new Date(a.startDate);
      }
    });
    return result;
  }, [leases, searchTerm, statusFilter, sortOption, showExpiringOnly]);

  // --- FILTER & SORT LOGIC: PAYMENTS ---
  const filteredPayments = useMemo(() => {
    let result = payments;

    if (paymentSearch) {
      const term = paymentSearch.toLowerCase();
      result = result.filter(p => {
        const relatedLease = leases.find(l => l.id === p.leaseId);
        const tenantName = relatedLease?.tenant?.fullName || '';
        const propertyAddress = relatedLease?.property?.address || '';
        return tenantName.toLowerCase().includes(term) || 
               propertyAddress.toLowerCase().includes(term) ||
               String(p.referenceYear).includes(term);
      });
    }

    if (paymentMethodFilter !== 'ALL') {
        result = result.filter(p => p.paymentMethod === paymentMethodFilter);
    }

    if (paymentStartDate) {
      result = result.filter(p => p.paymentDate >= paymentStartDate);
    }
    if (paymentEndDate) {
      result = result.filter(p => p.paymentDate <= paymentEndDate);
    }

    result = [...result].sort((a, b) => {
        let valA, valB;
        
        switch (paymentSortConfig.key) {
            case 'date':
                valA = new Date(a.paymentDate).getTime();
                valB = new Date(b.paymentDate).getTime();
                break;
            case 'amount':
                valA = a.amountPaid;
                valB = b.amountPaid;
                break;
            case 'tenant':
                const leaseA = leases.find(l => l.id === a.leaseId);
                const leaseB = leases.find(l => l.id === b.leaseId);
                valA = (leaseA?.tenant?.fullName || '').toLowerCase();
                valB = (leaseB?.tenant?.fullName || '').toLowerCase();
                break;
            default:
                return 0;
        }

        if (valA < valB) return paymentSortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return paymentSortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    return result;
  }, [payments, leases, paymentSearch, paymentStartDate, paymentEndDate, paymentMethodFilter, paymentSortConfig]);

  // --- PAYMENT TOTALS ---
  const paymentTotals = useMemo(() => {
    return filteredPayments.reduce((acc, curr) => ({
      totalAmount: acc.totalAmount + (curr.amountPaid || 0),
      totalFines: acc.totalFines + (curr.lateFees || 0),
      count: acc.count + 1
    }), { totalAmount: 0, totalFines: 0, count: 0 });
  }, [filteredPayments]);


  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;
  if (!landlord) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/landlords')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{landlord.profileAlias}</h1>
            <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
              {landlord.fullName} 
              {landlord.isDefault && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded font-bold">Padrão</span>}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate(`/dashboard/landlords/${id}/edit`)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors">
            <Edit className="w-4 h-4" /> Editar
          </button>
          <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors">
            <Trash2 className="w-4 h-4" /> Eliminar
          </button>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="border-b border-slate-200 mt-2">
        <nav className="flex gap-6 overflow-x-auto">
          {['overview', 'contracts', 'financials', 'payments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 text-sm font-medium transition-colors whitespace-nowrap relative ${
                activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'overview' && 'Visão Geral'}
              {tab === 'contracts' && 'Contratos'}
              {tab === 'financials' && 'Relatório Anual'}
              {tab === 'payments' && 'Histórico Pagamentos'}
            </button>
          ))}
        </nav>
      </div>

      {/* CONTENT AREA */}
      <div className="animate-in fade-in duration-300">
        
        {/* --- TAB: OVERVIEW --- */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="bg-green-50 p-3 rounded-lg text-green-600"><TrendingUp className="w-6 h-6" /></div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Receita Mensal (Contratada)</p>
                        <p className="text-xl font-bold text-slate-900">{formatMoney(kpiData.totalRevenue)}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg text-blue-600"><FileText className="w-6 h-6" /></div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Contratos Ativos</p>
                        <p className="text-xl font-bold text-slate-900">{kpiData.activeCount} <span className="text-sm text-slate-400 font-normal">/ {leases.length} total</span></p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="bg-purple-50 p-3 rounded-lg text-purple-600"><Building2 className="w-6 h-6" /></div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Imóveis Vinculados</p>
                        <p className="text-xl font-bold text-slate-900">{kpiData.totalProperties}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" /> Dados Pessoais / Jurídicos
                    </h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                    <div><dt className="text-xs text-slate-500 uppercase">Nome Completo</dt><dd className="text-slate-900 font-medium mt-1">{landlord.fullName}</dd></div>
                    <div><dt className="text-xs text-slate-500 uppercase">CPF / CNPJ</dt><dd className="text-slate-900 font-medium mt-1 font-mono">{landlord.cpfCnpj}</dd></div>
                    <div><dt className="text-xs text-slate-500 uppercase">RG</dt><dd className="text-slate-900 font-medium mt-1">{landlord.rg || '-'}</dd></div>
                    <div><dt className="text-xs text-slate-500 uppercase">Nacionalidade</dt><dd className="text-slate-900 font-medium mt-1">{landlord.nationality || '-'}</dd></div>
                    <div><dt className="text-xs text-slate-500 uppercase">Estado Civil</dt><dd className="text-slate-900 font-medium mt-1 capitalize">{translateMaritalStatus(landlord.maritalStatus)}</dd></div>
                    <div><dt className="text-xs text-slate-500 uppercase">Profissão</dt><dd className="text-slate-900 font-medium mt-1">{landlord.profession || '-'}</dd></div>
                    </dl>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Contactos
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2"><span className="text-xs text-slate-500 uppercase block mb-1">Endereço</span><p className="text-slate-900 font-medium">{landlord.fullAddress}</p></div>
                    <div><span className="text-xs text-slate-500 uppercase block mb-1">Email</span><a href={`mailto:${landlord.email}`} className="text-blue-600 hover:underline">{landlord.email || '-'}</a></div>
                    <div><span className="text-xs text-slate-500 uppercase block mb-1">Telefone</span><a href={`tel:${landlord.phone}`} className="text-slate-900 font-medium">{landlord.phone || '-'}</a></div>
                    </div>
                </div>
                </div>
                <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Dados Financeiros
                    </h3>
                    <div className="space-y-4">
                    <div><span className="text-xs text-slate-400 uppercase block mb-1">Chave PIX</span><div className="font-mono bg-white p-2 rounded border border-slate-200 text-slate-700">{landlord.pixKey || 'Não cadastrada'}</div></div>
                    <div><span className="text-xs text-slate-400 uppercase block mb-1">Dados Bancários</span><div className="text-sm text-slate-700 whitespace-pre-wrap bg-white p-3 rounded border border-slate-200 min-h-[80px]">{landlord.bankDetails || 'Não informado.'}</div></div>
                    </div>
                </div>
                </div>
            </div>
          </div>
        )}

        {/* --- TAB: CONTRACTS --- */}
        {activeTab === 'contracts' && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
               <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                  <input 
                    type="text" 
                    placeholder="Pesquisar por imóvel ou inquilino..." 
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                  <div className="relative min-w-[140px]">
                     <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                     <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm bg-white appearance-none cursor-pointer"
                     >
                        <option value="ALL">Todos Status</option>
                        <option value="ACTIVE">Apenas Ativos</option>
                        <option value="TERMINATED">Encerrados</option>
                     </select>
                  </div>
                  <div className="relative min-w-[160px]">
                     <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                     <select 
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm bg-white appearance-none cursor-pointer"
                     >
                        <option value="newest">Mais Recentes</option>
                        <option value="oldest">Mais Antigos</option>
                        <option value="value_high">Maior Valor</option>
                        <option value="value_low">Menor Valor</option>
                        <option value="expiring">Data Fim (Vencimento)</option>
                     </select>
                  </div>
                  <button 
                     onClick={() => setShowExpiringOnly(!showExpiringOnly)}
                     className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors whitespace-nowrap
                        ${showExpiringOnly 
                           ? 'bg-orange-50 border-orange-200 text-orange-700' 
                           : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                     <Clock className="w-4 h-4" />
                     Vence em Breve
                  </button>
               </div>
            </div>

            {filteredLeases.length === 0 ? (
              <div className="bg-slate-50 p-12 rounded-xl text-center border border-dashed border-slate-300">
                <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">Nenhum contrato encontrado com estes filtros.</p>
                <button 
                  onClick={() => {setSearchTerm(''); setStatusFilter('ALL'); setShowExpiringOnly(false);}}
                  className="text-blue-600 text-sm hover:underline mt-2"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredLeases.map(lease => {
                  const expiring = isExpiringSoon(lease.endDate, lease.status);
                  return (
                    <div key={lease.id} className={`bg-white p-5 rounded-xl border shadow-sm transition-all flex flex-col md:flex-row justify-between gap-4 
                        ${expiring ? 'border-orange-200 bg-orange-50/30' : 'border-slate-200 hover:border-blue-200'}`}>
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${expiring ? 'bg-orange-100 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                          <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                             {lease.property?.address}
                             {expiring && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 uppercase tracking-wide"><AlertTriangle className="w-3 h-3" /> Vence em breve</span>}
                          </h4>
                          <p className="text-sm text-slate-500">Inquilino: <span className="font-medium text-slate-700">{lease.tenant?.fullName}</span></p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                             <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {formatDate(lease.startDate)} - {formatDate(lease.endDate)}</span>
                             <span className="font-semibold text-slate-700">{formatMoney(lease.baseRentValue)}</span>
                             <span className="flex items-center gap-1">Dia Vencimento: <strong className="text-slate-700">{lease.paymentDueDay}</strong></span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-center gap-2">
                         <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${lease.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                            {lease.status === 'ACTIVE' ? <CheckCircle className="w-3 h-3"/> : <XCircle className="w-3 h-3"/>} {lease.status === 'ACTIVE' ? 'Ativo' : 'Encerrado'}
                         </span>
                         <button onClick={() => navigate(`/dashboard/leases/${lease.id}`)} className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 mt-1">
                            Ver Detalhes <ChevronRight className="w-4 h-4" />
                         </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- TAB: FINANCIALS --- */}
        {activeTab === 'financials' && (
          <div className="space-y-6">
             <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                   <div className="bg-purple-100 p-2 rounded-lg text-purple-700"><Wallet className="w-5 h-5" /></div>
                   <div>
                      <p className="text-xs text-slate-500 uppercase">Rendimento Anual</p>
                      <h3 className="text-xl font-bold text-slate-900">{financialReport ? formatMoney(financialReport.yearTotal) : '...'}</h3>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <select 
                      value={selectedYear} 
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                   >
                      {[0, 1, 2, 3].map(i => {
                         const y = new Date().getFullYear() - i;
                         return <option key={y} value={y}>{y}</option>
                      })}
                   </select>
                   <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg border border-slate-200" title="Exportar (Demo)">
                      <Download className="w-4 h-4" />
                   </button>
                </div>
             </div>

             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-80">
                <h4 className="text-sm font-bold text-slate-700 mb-4">Fluxo de Caixa Mensal ({selectedYear})</h4>
                {financialReport ? (
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={financialReport.monthlyData}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                         <XAxis dataKey="monthName" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                         <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(v) => `R$ ${v/1000}k`} />
                         <Tooltip 
                            cursor={{fill: '#f1f5f9'}}
                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                            formatter={(value) => [formatMoney(value), 'Receita']}
                         />
                         <Bar dataKey="totalIncome" radius={[4, 4, 0, 0]}>
                            {financialReport.monthlyData.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={entry.totalIncome > 0 ? '#3b82f6' : '#e2e8f0'} />
                            ))}
                         </Bar>
                      </BarChart>
                   </ResponsiveContainer>
                ) : (
                   <div className="h-full flex items-center justify-center text-slate-400">Carregando gráfico...</div>
                )}
             </div>
          </div>
        )}

        {/* --- TAB: PAYMENTS --- */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
             
             {/* FILTERS & TOOLBAR */}
             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col xl:flex-row gap-4 justify-between">
                <div className="relative flex-1 min-w-[250px]">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                   <input 
                     type="text" 
                     placeholder="Buscar por Inquilino ou Imóvel..." 
                     className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                     value={paymentSearch}
                     onChange={(e) => setPaymentSearch(e.target.value)}
                   />
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                   
                   {/* PAYMENT METHOD FILTER */}
                   <div className="relative min-w-[140px]">
                        <select 
                            value={paymentMethodFilter}
                            onChange={(e) => setPaymentMethodFilter(e.target.value)}
                            className="w-full pl-3 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm bg-white appearance-none cursor-pointer"
                        >
                            <option value="ALL">Todos Métodos</option>
                            <option value="PIX">Pix</option>
                            <option value="BANK_SLIP">Boleto</option>
                            <option value="WIRE_TRANSFER">Transferência</option>
                            <option value="CASH">Dinheiro</option>
                            <option value="CREDIT_CARD">Cartão</option>
                            <option value="OTHER">Outros</option>
                        </select>
                        <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none"/>
                   </div>

                   <span className="text-sm text-slate-500 font-medium ml-2">Período:</span>
                   <input 
                      type="date" 
                      className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none focus:border-blue-500"
                      value={paymentStartDate}
                      onChange={(e) => setPaymentStartDate(e.target.value)}
                   />
                   <span className="text-slate-400">-</span>
                   <input 
                      type="date" 
                      className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none focus:border-blue-500"
                      value={paymentEndDate}
                      onChange={(e) => setPaymentEndDate(e.target.value)}
                   />
                   {(paymentStartDate || paymentEndDate || paymentSearch || paymentMethodFilter !== 'ALL') && (
                      <button 
                        onClick={() => {setPaymentStartDate(''); setPaymentEndDate(''); setPaymentSearch(''); setPaymentMethodFilter('ALL')}}
                        className="text-sm text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors ml-2"
                      >
                        Limpar
                      </button>
                   )}
                </div>
             </div>

             {/* SUMMARY CARDS */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center justify-between">
                   <div>
                      <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Receita Total</p>
                      <p className="text-xl font-bold text-emerald-900">{formatMoney(paymentTotals.totalAmount)}</p>
                   </div>
                   <Wallet className="w-8 h-8 text-emerald-200" />
                </div>
                <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-center justify-between">
                   <div>
                      <p className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-1">Total em Multas</p>
                      <p className="text-xl font-bold text-orange-900">{formatMoney(paymentTotals.totalFines)}</p>
                   </div>
                   <AlertCircle className="w-8 h-8 text-orange-200" />
                </div>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
                   <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Lançamentos</p>
                      <p className="text-xl font-bold text-slate-700">{paymentTotals.count}</p>
                   </div>
                   <FileText className="w-8 h-8 text-slate-300" />
                </div>
             </div>
             
             {/* TABLE TOOLBAR */}
             <div className="bg-white rounded-t-xl border-x border-t p-4 border-b border-slate-100 flex gap-4 items-center">
                {selectedIds.size > 0 ? (
                    <div className="flex-1 flex items-center gap-4 bg-blue-50 p-2 rounded-lg animate-in fade-in">
                        <span className="text-sm font-bold text-blue-800 px-2">
                            {selectedIds.size} selecionado(s)
                        </span>
                        <button 
                            onClick={preparePrint}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
                        >
                            <Printer className="w-4 h-4" /> Imprimir Selecionados
                        </button>
                        <button 
                            onClick={() => setSelectedIds(new Set())}
                            className="text-slate-500 hover:text-slate-700 text-sm ml-auto px-2"
                        >
                            Cancelar
                        </button>
                    </div>
                ) : (
                    <div className="text-sm text-slate-500 italic">Selecione pagamentos na tabela para gerar recibos.</div>
                )}
             </div>

             {/* PAYMENTS TABLE */}
             <div className="bg-white rounded-b-xl shadow-sm border-x border-b border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                   <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                         <tr>
                            <th className="w-10 px-4 py-3 text-center">#</th>
                            <th className="px-6 py-3">Status</th>
                            
                            {/* SORTABLE HEADER: DATE */}
                            <th 
                                className="px-6 py-3 cursor-pointer hover:bg-slate-100 transition-colors"
                                onClick={() => handlePaymentSort('date')}
                            >
                                <div className="flex items-center gap-1">Data {getSortIcon('date')}</div>
                            </th>

                            <th className="px-6 py-3">Ref.</th>
                            
                            {/* SORTABLE HEADER: TENANT/PROPERTY */}
                            <th 
                                className="px-6 py-3 cursor-pointer hover:bg-slate-100 transition-colors"
                                onClick={() => handlePaymentSort('tenant')}
                            >
                                <div className="flex items-center gap-1">Imóvel / Inquilino {getSortIcon('tenant')}</div>
                            </th>

                            <th className="px-6 py-3">Método</th>
                            
                            {/* SORTABLE HEADER: AMOUNT */}
                            <th 
                                className="px-6 py-3 text-right cursor-pointer hover:bg-slate-100 transition-colors"
                                onClick={() => handlePaymentSort('amount')}
                            >
                                <div className="flex items-center justify-end gap-1">Valor {getSortIcon('amount')}</div>
                            </th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {filteredPayments.length === 0 ? (
                            <tr><td colSpan="8" className="px-6 py-12 text-center text-slate-500">Nenhum pagamento encontrado no período selecionado.</td></tr>
                         ) : (
                            filteredPayments.map(payment => {
                               const methodInfo = getPaymentMethodInfo(payment.paymentMethod);
                               const leaseInfo = leases.find(l => l.id === payment.leaseId);
                               const hasLateFee = payment.lateFees > 0;
                               const isSelected = selectedIds.has(payment.id);

                               return (
                               <tr key={payment.id} className={`hover:bg-slate-50 transition-colors group ${isSelected ? 'bg-blue-50 hover:bg-blue-50' : ''}`}>
                                  <td className="px-4 py-3 text-center">
                                      <button
                                          onClick={() => toggleSelection(payment.id)}
                                          className="rounded focus:outline-none cursor-pointer hover:text-blue-600"
                                      >
                                          {isSelected ? (
                                              <CheckSquare className="w-5 h-5 text-blue-600" />
                                          ) : (
                                              <Square className="w-5 h-5 text-slate-300" />
                                          )}
                                      </button>
                                  </td>
                                  <td className="px-6 py-3">
                                     {hasLateFee ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
                                           <AlertCircle className="w-3 h-3" /> Atraso
                                        </span>
                                     ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                           <CheckCircle className="w-3 h-3" /> Em dia
                                        </span>
                                     )}
                                  </td>
                                  <td className="px-6 py-3 text-slate-600">{formatDate(payment.paymentDate)}</td>
                                  <td className="px-6 py-3 font-medium text-slate-900">{payment.referenceMonth}/{payment.referenceYear}</td>
                                  <td className="px-6 py-3">
                                     <div className="flex flex-col">
                                        <span className="text-slate-900 font-medium truncate max-w-[200px]" title={leaseInfo?.property?.address}>
                                           {leaseInfo?.property?.address || `Contrato #${payment.leaseId}`}
                                        </span>
                                        <span className="text-xs text-slate-500 truncate max-w-[200px]">
                                           {leaseInfo?.tenant?.fullName || 'Inquilino desconhecido'}
                                        </span>
                                     </div>
                                  </td>
                                  <td className="px-6 py-3">
                                     <div className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-100 ${methodInfo.bg}`}>
                                        {methodInfo.icon}
                                        <span className="text-xs font-medium text-slate-700">{methodInfo.label}</span>
                                     </div>
                                  </td>
                                  <td className="px-6 py-3 text-right">
                                     <div className="flex flex-col items-end">
                                        <span className="font-bold text-slate-900">{formatMoney(payment.amountPaid)}</span>
                                        {hasLateFee && (
                                           <span className="text-xs text-orange-600 flex items-center gap-1">
                                              (+ {formatMoney(payment.lateFees)} multa)
                                           </span>
                                        )}
                                     </div>
                                  </td>
                               </tr>
                            )})
                         )}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        )}

      </div>

      {/* HIDDEN BATCH PRINT COMPONENT */}
      <div style={{ overflow: 'hidden', height: 0, width: 0, position: 'absolute' }}>
        <RentReceiptBatch 
            ref={batchRef} 
            dataList={batchData} 
        />
      </div>

    </div>
  );
}