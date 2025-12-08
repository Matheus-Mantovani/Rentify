import { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Search, Filter, Wrench, Calendar, 
  Edit, Trash2, CheckCircle, XCircle, AlertCircle, Clock,
  ArrowUpDown, ArrowUp, ArrowDown
} from 'lucide-react';
import { maintenanceService } from '../../services/maintenanceService';
import { propertyService } from '../../services/propertyService';
import MaintenanceModal from './MaintenanceModal';

export default function MaintenanceList() {
  const [jobs, setJobs] = useState([]);
  const [properties, setProperties] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobsData, propertiesData] = await Promise.all([
        maintenanceService.getAllJobs(),
        propertyService.getAllProperties()
      ]);
      setJobs(jobsData);
      setProperties(propertiesData);
    } catch (err) {
      console.error(err);
      setError('Falha ao carregar registros de manutenção.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      try {
        await maintenanceService.deleteJob(id);
        setJobs(prev => prev.filter(job => job.id !== id));
      } catch (err) {
        alert('Erro ao excluir registro.');
      }
    }
  };

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

  const filteredJobs = useMemo(() => {
    let result = jobs.filter(job => {
      const matchesSearch = 
        job.serviceDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.propertyAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.serviceProvider?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === '' || job.maintenanceStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue, bValue;

        switch (sortConfig.key) {
          case 'propertyAddress':
            aValue = a.propertyAddress?.toLowerCase() || '';
            bValue = b.propertyAddress?.toLowerCase() || '';
            break;
          case 'serviceDescription':
            aValue = a.serviceDescription?.toLowerCase() || '';
            bValue = b.serviceDescription?.toLowerCase() || '';
            break;
          case 'serviceProvider':
            aValue = a.serviceProvider?.toLowerCase() || '';
            bValue = b.serviceProvider?.toLowerCase() || '';
            break;
          case 'requestDate':
            aValue = new Date(a.requestDate);
            bValue = new Date(b.requestDate);
            break;
          case 'totalCost':
            aValue = a.totalCost || 0;
            bValue = b.totalCost || 0;
            break;
          case 'maintenanceStatus':
            const statusPriority = { 
                'PENDING': 1, 
                'IN_PROGRESS': 2, 
                'COMPLETED': 3, 
                'CANCELED': 4 
            };
            aValue = statusPriority[a.maintenanceStatus] || 99;
            bValue = statusPriority[b.maintenanceStatus] || 99;
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

    return result;
  }, [jobs, searchTerm, statusFilter, sortConfig]);

  const formatMoney = (value) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 gap-1">
            <CheckCircle className="w-3 h-3" /> Concluído
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 gap-1">
            <AlertCircle className="w-3 h-3" /> Pendente
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 gap-1">
            <Clock className="w-3 h-3" /> Em Andamento
          </span>
        );
      case 'CANCELED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 gap-1">
            <XCircle className="w-3 h-3" /> Cancelado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 gap-1">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-6 space-y-6 w-full">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manutenção de Imóveis</h1>
          <p className="text-slate-500">Gestão de reparos e serviços prestados</p>
        </div>
        <button 
          onClick={() => { setSelectedJob(null); setShowModal(true); }}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Nova Manutenção
        </button>
      </div>

      {/* Filters Card */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por endereço, serviço ou prestador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        <div className="md:w-48 relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white appearance-none"
            >
                <option value="">Status (Todos)</option>
                <option value="PENDING">Pendente</option>
                <option value="IN_PROGRESS">Em Andamento</option>
                <option value="COMPLETED">Concluído</option>
                <option value="CANCELED">Cancelado</option>
            </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
           <AlertCircle className="w-5 h-5" /> {error}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-100 border-dashed">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wrench className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Nenhuma manutenção encontrada</h3>
          <p className="text-slate-500">Ajuste os filtros ou cadastre um novo serviço.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th 
                    className="px-6 py-4 text-sm whitespace-nowrap cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => handleSort('propertyAddress')}
                  >
                    <div className="flex items-center gap-1">
                      Imóvel
                      {getSortIcon('propertyAddress')}
                    </div>
                  </th>

                  <th 
                    className="px-6 py-4 text-sm whitespace-nowrap cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => handleSort('serviceDescription')}
                  >
                    <div className="flex items-center gap-1">
                      Serviço
                      {getSortIcon('serviceDescription')}
                    </div>
                  </th>

                  <th 
                    className="px-6 py-4 text-sm whitespace-nowrap cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => handleSort('serviceProvider')}
                  >
                     <div className="flex items-center gap-1">
                      Prestador
                      {getSortIcon('serviceProvider')}
                    </div>
                  </th>

                  <th 
                    className="px-6 py-4 text-sm whitespace-nowrap cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => handleSort('requestDate')}
                  >
                     <div className="flex items-center gap-1">
                      Data Solicitação
                      {getSortIcon('requestDate')}
                    </div>
                  </th>

                  <th 
                    className="px-6 py-4 text-sm whitespace-nowrap cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => handleSort('totalCost')}
                  >
                     <div className="flex items-center gap-1">
                      Custo
                      {getSortIcon('totalCost')}
                    </div>
                  </th>

                  <th 
                    className="px-6 py-4 text-sm whitespace-nowrap cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => handleSort('maintenanceStatus')}
                  >
                     <div className="flex items-center gap-1">
                      Status
                      {getSortIcon('maintenanceStatus')}
                    </div>
                  </th>

                  <th className="px-6 py-4 text-sm text-right whitespace-nowrap">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 text-sm text-slate-700 font-medium whitespace-nowrap">
                      {job.propertyAddress}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate" title={job.serviceDescription}>
                      {job.serviceDescription}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                      {job.serviceProvider || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                       <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {formatDate(job.requestDate)}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900 font-medium whitespace-nowrap">
                      {formatMoney(job.totalCost)}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      {getStatusBadge(job.maintenanceStatus)}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                       <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => { setSelectedJob(job); setShowModal(true); }}
                            className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-full transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(job.id)}
                            className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-full transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <MaintenanceModal
          onClose={() => setShowModal(false)}
          onSuccess={() => loadData()}
          jobToEdit={selectedJob}
          properties={properties}
        />
      )}
    </div>
  );
}