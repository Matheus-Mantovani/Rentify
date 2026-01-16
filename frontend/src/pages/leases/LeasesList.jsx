import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Filter, FileText, Calendar, 
  AlertTriangle, CheckCircle, XCircle, Eye, Printer 
} from 'lucide-react';
import { leaseService } from '../../services/leaseService';
import ContractModal from '../../components/ContractModal';

export default function LeasesList() {
  const navigate = useNavigate();

  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [selectedLeaseForContract, setSelectedLeaseForContract] = useState(null);
  const [showContractModal, setShowContractModal] = useState(false);

  const fetchLeases = async () => {
    setLoading(true);
    try {
      const data = await leaseService.getAllLeases(); 
      setLeases(data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar contratos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeases();
  }, []);

  const filteredLeases = useMemo(() => {
    return leases.filter(lease => {
      const term = searchTerm.toLowerCase();
      
      const matchesSearch = 
        lease.tenant?.fullName?.toLowerCase().includes(term) ||
        lease.property?.address?.toLowerCase().includes(term);

      const matchesStatus = statusFilter === '' || lease.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leases, searchTerm, statusFilter]);

  const formatMoney = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const [year, month, day] = dateStr.split('-');
    return new Date(year, month - 1, day).toLocaleDateString('pt-BR');
  };

  const isExpiringSoon = (endDate, status) => {
    if (status !== 'ACTIVE') return false;
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  const handleOpenContract = (lease) => {
    setSelectedLeaseForContract(lease);
    setShowContractModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contratos de Locação</h1>
          <p className="text-slate-500">Gerenciamento de vigências e vínculos</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/leases/new')}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Novo Contrato
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por inquilino ou endereço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
        <div className="relative md:w-48">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white appearance-none cursor-pointer"
          >
            <option value="">Todos os Status</option>
            <option value="ACTIVE">Ativos</option>
            <option value="TERMINATED">Encerrados</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center h-40 items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Imóvel / Inquilino</th>
                <th className="px-6 py-4">Vigência</th>
                <th className="px-6 py-4">Valor Base</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeases.length === 0 ? (
                 <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">Nenhum contrato encontrado.</td>
                 </tr>
              ) : filteredLeases.map((lease) => (
                <tr key={lease.id} className="hover:bg-slate-50 transition-colors group">
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-bold text-slate-900 truncate max-w-[250px]" title={lease.property?.address}>
                                {lease.property?.address}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-1">
                                {lease.tenant?.fullName}
                            </div>
                        </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-slate-600">
                        <span className="text-xs text-slate-400">Início: {formatDate(lease.startDate)}</span>
                        <span className="font-medium flex items-center gap-1">
                            Fim: {formatDate(lease.endDate)}
                            {isExpiringSoon(lease.endDate, lease.status) && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 ml-1" title="Vence em menos de 30 dias">
                                    <AlertTriangle className="w-3 h-3 mr-0.5" /> Vence em breve
                                </span>
                            )}
                        </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 font-medium text-slate-700">
                    {formatMoney(lease.baseRentValue)}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium gap-1 
                        ${lease.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
                        {lease.status === 'ACTIVE' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {lease.status === 'ACTIVE' ? 'Ativo' : 'Encerrado'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <button 
                            onClick={() => handleOpenContract(lease)}
                            className="text-slate-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-full"
                            title="Imprimir Contrato"
                        >
                            <Printer className="w-5 h-5" />
                        </button>

                        <button 
                            onClick={() => navigate(`/dashboard/leases/${lease.id}`)}
                            className="text-slate-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-full"
                            title="Ver Detalhes"
                        >
                            <Eye className="w-5 h-5" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ContractModal 
        isOpen={showContractModal}
        onClose={() => setShowContractModal(false)}
        lease={selectedLeaseForContract}
      />
    </div>
  );
}