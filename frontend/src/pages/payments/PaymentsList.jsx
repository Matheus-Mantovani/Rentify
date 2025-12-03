import { useState, useEffect, useMemo, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { 
  ChevronLeft, ChevronRight, DollarSign, Calendar, 
  CheckCircle, AlertTriangle, Clock, Search, FileText, Printer, CheckSquare, Square,
  ArrowUpDown, ArrowUp, ArrowDown
} from 'lucide-react';
import { leaseService } from '../../services/leaseService';
import { paymentService } from '../../services/paymentService';
import PaymentModal from './PaymentModal';
import RentReceiptBatch from '../../components/RentReceiptBatch';

export default function PaymentsList() {
  
  {/* State Management */}
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [activeLeases, setActiveLeases] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLease, setSelectedLease] = useState(null); 

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  {/* Selection Logic */}
  const [selectedIds, setSelectedIds] = useState(new Set());

  const toggleSelection = (row) => {
    const newSelected = new Set(selectedIds);
    
    if (row.status !== 'PAID') return;

    const id = row.payment.id;

    if (newSelected.has(id)) {
        newSelected.delete(id);
    } else {
        if (newSelected.size >= 4) {
            alert("Máximo de 4 recibos por página.");
            return;
        }
        newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  {/* Print Logic */}
  const batchRef = useRef(null);
  const [batchData, setBatchData] = useState(null);

  const handlePrintBatch = useReactToPrint({
    contentRef: batchRef,
    documentTitle: `Recibos_${new Date().toISOString().split('T')[0]}`,
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

  {/* Data Loading */}
  useEffect(() => {
    loadDashboardData();
  }, [currentDate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [leasesData, paymentsData] = await Promise.all([
        leaseService.getAllLeases({ status: 'ACTIVE' }),
        paymentService.getAllPayments()
      ]);
      
      setActiveLeases(leasesData);
      setPayments(paymentsData);
    } catch (error) {
      console.error("Failed to load financial data", error);
    } finally {
      setLoading(false);
    }
  };

  {/* Date Helpers */}
  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const currentMonthLabel = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  const refMonth = currentDate.getMonth() + 1; 
  const refYear = currentDate.getFullYear();

  {/* Data Processing & Filtering */}
  const financialRows = useMemo(() => {
    let rows = activeLeases.map(lease => {
        const payment = payments.find(p => 
            p.leaseId === lease.id && 
            p.referenceMonth === refMonth && 
            p.referenceYear === refYear
        );

        const dueDay = lease.paymentDueDay || 5;
        const dueDate = new Date(refYear, refMonth - 1, dueDay);
        const today = new Date();
        today.setHours(0,0,0,0);

        let status = 'PENDING';
        if (payment) status = 'PAID';
        else if (today > dueDate) status = 'LATE';

        return {
            lease,
            payment,
            status,
            dueDate,
            tenantName: lease.tenant?.fullName || 'Desconhecido',
            propertyName: lease.property?.address || 'Imóvel sem endereço',
            amount: lease.baseRentValue || 0
        };
    }).filter(row => {
        const term = searchTerm.toLowerCase();
        return row.tenantName.toLowerCase().includes(term) || 
               row.propertyName.toLowerCase().includes(term);
    });

    if (sortConfig.key) {
      rows.sort((a, b) => {
        let aValue, bValue;

        switch (sortConfig.key) {
          case 'tenantName':
            aValue = a.tenantName.toLowerCase();
            bValue = b.tenantName.toLowerCase();
            break;
          case 'dueDate':
            aValue = a.dueDate;
            bValue = b.dueDate;
            break;
          case 'amount':
            aValue = a.amount;
            bValue = b.amount;
            break;
          case 'status':
            const statusPriority = { 'LATE': 0, 'PENDING': 1, 'PAID': 2 };
            aValue = statusPriority[a.status];
            bValue = statusPriority[b.status];
            break;
          default:
            return 0;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return rows;
  }, [activeLeases, payments, refMonth, refYear, searchTerm, sortConfig]);

  const preparePrint = () => {
    const dataToPrint = financialRows.filter(row => 
        row.payment && selectedIds.has(row.payment.id)
    );
    setBatchData(dataToPrint);
  };

  {/* KPIs */}
  const kpis = useMemo(() => {
    const expected = financialRows.reduce((acc, row) => acc + (row.lease.baseRentValue || 0), 0);
    const received = financialRows.reduce((acc, row) => acc + (row.payment?.amountPaid || 0), 0);
    const pending = expected - received; 
    
    return { expected, received, pending };
  }, [financialRows]);

  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown className="w-4 h-4 ml-1 text-slate-400" />;
    if (sortConfig.direction === 'asc') return <ArrowUp className="w-4 h-4 ml-1 text-blue-600" />;
    return <ArrowDown className="w-4 h-4 ml-1 text-blue-600" />;
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestão de Pagamentos</h1>
            <p className="text-slate-500">Controle mensal de recebimentos</p>
        </div>

        <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-sm">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-50 text-slate-600 border-r border-slate-100">
                <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="px-6 py-2 font-semibold text-slate-800 capitalize min-w-[180px] text-center flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                {currentMonthLabel}
            </div>
            <button onClick={handleNextMonth} className="p-2 hover:bg-slate-50 text-slate-600 border-l border-slate-100">
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-sm text-slate-500 mb-1">Total Esperado</p>
                <h3 className="text-2xl font-bold text-slate-900">{formatMoney(kpis.expected)}</h3>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <FileText className="w-5 h-5" />
            </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-sm text-slate-500 mb-1">Recebido</p>
                <h3 className="text-2xl font-bold text-green-600">{formatMoney(kpis.received)}</h3>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                <CheckCircle className="w-5 h-5" />
            </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-sm text-slate-500 mb-1">Pendente</p>
                <h3 className="text-2xl font-bold text-orange-600">{formatMoney(kpis.pending > 0 ? kpis.pending : 0)}</h3>
            </div>
            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
                <Clock className="w-5 h-5" />
            </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex gap-4 items-center">
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
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Buscar inquilino ou imóvel..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                    />
                </div>
            )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                    <tr>
                        <th className="w-10 px-4 py-3 text-center">#</th>
                        
                        {/* Sortable Header: Tenant/Property */}
                        <th 
                          className="px-6 py-3 cursor-pointer hover:bg-slate-50 transition-colors group"
                          onClick={() => handleSort('tenantName')}
                        >
                          <div className="flex items-center">
                            Inquilino / Imóvel
                            {getSortIcon('tenantName')}
                          </div>
                        </th>

                        {/* Sortable Header: Due Date */}
                        <th 
                          className="px-6 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
                          onClick={() => handleSort('dueDate')}
                        >
                          <div className="flex items-center">
                            Vencimento
                            {getSortIcon('dueDate')}
                          </div>
                        </th>

                        {/* Sortable Header: Amount */}
                        <th 
                          className="px-6 py-3 text-right cursor-pointer hover:bg-slate-50 transition-colors"
                          onClick={() => handleSort('amount')}
                        >
                          <div className="flex items-center justify-end">
                            Valor Aluguel
                            {getSortIcon('amount')}
                          </div>
                        </th>

                        {/* Sortable Header: Status */}
                        <th 
                          className="px-6 py-3 text-center cursor-pointer hover:bg-slate-50 transition-colors"
                          onClick={() => handleSort('status')}
                        >
                          <div className="flex items-center justify-center">
                            Status
                            {getSortIcon('status')}
                          </div>
                        </th>

                        <th className="px-6 py-3 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {loading ? (
                        <tr><td colSpan="6" className="p-8 text-center text-slate-500">Carregando dados financeiros...</td></tr>
                    ) : financialRows.length === 0 ? (
                        <tr><td colSpan="6" className="p-8 text-center text-slate-500">Nenhum contrato ativo encontrado para este período.</td></tr>
                    ) : (
                        financialRows.map((row) => {
                            const isPaid = row.status === 'PAID';
                            const isSelected = row.payment && selectedIds.has(row.payment.id);

                            return (
                                <tr key={row.lease.id} className={`hover:bg-slate-50 transition-colors group ${isSelected ? 'bg-blue-50 hover:bg-blue-50' : ''}`}>
                                    
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => toggleSelection(row)}
                                            disabled={!isPaid}
                                            className={`rounded focus:outline-none transition-colors ${!isPaid ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:text-blue-600'}`}
                                        >
                                            {isSelected ? (
                                                <CheckSquare className="w-5 h-5 text-blue-600" />
                                            ) : (
                                                <Square className="w-5 h-5 text-slate-300" />
                                            )}
                                        </button>
                                    </td>

                                    <td className="px-6 py-3">
                                        <div className="font-medium text-slate-900">{row.tenantName}</div>
                                        <div className="text-xs text-slate-500 truncate max-w-[200px]">{row.propertyName}</div>
                                    </td>
                                    <td className="px-6 py-3 text-slate-600">
                                        {row.dueDate.toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-3 text-right font-medium text-slate-700">
                                        {formatMoney(row.lease.baseRentValue)}
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        {row.status === 'PAID' && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 gap-1">
                                                <CheckCircle className="w-3 h-3" /> Pago
                                            </span>
                                        )}
                                        {row.status === 'LATE' && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 gap-1">
                                                <AlertTriangle className="w-3 h-3" /> Atrasado
                                            </span>
                                        )}
                                        {row.status === 'PENDING' && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 gap-1">
                                                <Clock className="w-3 h-3" /> Pendente
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        {row.status !== 'PAID' ? (
                                            <button 
                                                onClick={() => setSelectedLease(row.lease)}
                                                className="text-blue-600 hover:text-blue-800 font-medium hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1"
                                            >
                                                <DollarSign className="w-4 h-4" /> Pagar
                                            </button>
                                        ) : (
                                            <span className="text-xs text-slate-400 font-medium">
                                                Pago {new Date(row.payment.paymentDate + 'T00:00:00').toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedLease && (
        <PaymentModal 
            lease={selectedLease}
            referenceDate={currentDate}
            onClose={() => setSelectedLease(null)}
            onSuccess={() => {
                loadDashboardData();
            }}
        />
      )}

      {/* Hidden Batch Print Component */}
      <div style={{ overflow: 'hidden', height: 0, width: 0, position: 'absolute' }}>
        <RentReceiptBatch 
            ref={batchRef} 
            dataList={batchData} 
        />
      </div>

    </div>
  );
}