import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  User, Search, Plus, MoreVertical, 
  Edit, Trash2, Eye, MapPin, Phone, Mail, AlertCircle, CheckCircle, XCircle
} from 'lucide-react';
import { tenantService } from '../../services/tenantService';
import { leaseService } from '../../services/leaseService';
import { locationService } from '../../services/locationService';
import TenantForm from './TenantForm';
import CityFilter from '../../components/CityFilter'; 

export default function TenantsList() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [tenants, setTenants] = useState([]);
  const [states, setStates] = useState([]);
  const [activeTenantIds, setActiveTenantIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);

  useEffect(() => {
    if (location.state?.openModal) {
      setSelectedTenant(null);
      setShowModal(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  {/* Initial Data Loading */}
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tenantsData, activeLeasesData, statesData] = await Promise.all([
        tenantService.getAllTenants(),
        leaseService.getAllLeases({ status: 'ACTIVE' }),
        locationService.getStates()
      ]);

      setTenants(tenantsData);
      setStates(statesData);

      const activeIds = new Set(activeLeasesData.map(lease => lease.tenant?.id));
      setActiveTenantIds(activeIds);

    } catch (err) {
      console.error("Error loading data:", err);
      setError('Não foi possível carregar a lista de inquilinos. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este inquilino? Esta ação não pode ser desfeita.')) {
      try {
        await tenantService.deleteTenant(id);
        setTenants(prev => prev.filter(t => t.id !== id));
      } catch (err) {
        alert('Erro ao excluir inquilino. Verifique se ele possui contratos ou pendências ativas.');
      }
    }
  };

  {/* Client-Side Filtering Logic */}
  const filteredTenants = useMemo(() => {
    return tenants.filter(tenant => {
      const searchLower = searchTerm.toLowerCase();
      const cityLower = cityFilter.toLowerCase(); 

      const matchesSearch = 
        tenant.fullName?.toLowerCase().includes(searchLower) ||
        tenant.email?.toLowerCase().includes(searchLower);
        
      const matchesState = stateFilter === '' || tenant.stateCode === stateFilter;

      const matchesCity = cityFilter === '' || 
        tenant.cityName?.toLowerCase().includes(cityLower);
      
      return matchesSearch && matchesState && matchesCity;
    });
  }, [tenants, searchTerm, stateFilter, cityFilter]);

  {/* Unique Cities Extraction (Filtered by State) */}
  const uniqueCities = useMemo(() => {
    const relevantTenants = stateFilter 
      ? tenants.filter(t => t.stateCode === stateFilter)
      : tenants;

    return [...new Set(relevantTenants.map(t => t.cityName).filter(Boolean))].sort();
  }, [tenants, stateFilter]);

  return (
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gerenciar Inquilinos</h1>
          <p className="text-slate-500">Base de contatos e histórico</p>
        </div>
        <button 
          onClick={() => { setSelectedTenant(null); setShowModal(true); }}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Novo Inquilino
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
        
        {/* State Filter */}
        <div className="md:w-32">
            <select
                value={stateFilter}
                onChange={(e) => {
                    setStateFilter(e.target.value);
                    setCityFilter('');
                }}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
            >
                <option value="">UF (Todos)</option>
                {states.map(state => (
                    <option key={state.id} value={state.stateCode}>{state.stateCode}</option>
                ))}
            </select>
        </div>

        {/* Custom City Filter Component */}
        <CityFilter 
            value={cityFilter}
            onChange={setCityFilter}
            options={uniqueCities}
        />
      </div>

      {/* Tenants Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredTenants.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Nenhum inquilino encontrado</h3>
          <p className="text-slate-500">Tente ajustar os filtros ou adicione um novo inquilino.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTenants.map((tenant) => {
            const isActive = activeTenantIds.has(tenant.id);
            
            return (
              <div key={tenant.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all group flex flex-col">
                
                <div className="p-5 pb-0 flex items-start justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shrink-0">
                          {tenant.fullName ? tenant.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0">
                          <h3 className="font-bold text-slate-900 line-clamp-1" title={tenant.fullName}>
                              {tenant.fullName}
                          </h3>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {tenant.cityName || 'N/A'}-{tenant.stateCode || 'N/A'}
                          </p>
                      </div>
                   </div>
                   
                   <div className="relative group/menu">
                      <button className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">
                        <MoreVertical className="w-5 h-5 text-slate-400" />
                      </button>
                      <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-100 py-1 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20">
                        <button onClick={() => navigate(`/dashboard/tenants/${tenant.id}`)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                          <Eye className="w-4 h-4" /> Detalhes
                        </button>
                        <button 
                          onClick={() => { setSelectedTenant(tenant); setShowModal(true); }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" /> Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(tenant.id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Excluir
                        </button>
                      </div>
                   </div>
                </div>

                <div className="p-5 pt-4 flex-1 flex flex-col">
                  <div className="mb-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium gap-1
                        ${isActive ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
                          {isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {isActive ? 'Ativo (Alugando)' : 'Inativo'}
                      </span>
                  </div>

                  <div className="space-y-3 mt-auto">
                      <a href={`mailto:${tenant.email}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-blue-600 transition-colors group/link">
                          <div className="p-1.5 bg-slate-50 rounded-md group-hover/link:bg-blue-50">
                              <Mail className="w-4 h-4" />
                          </div>
                          <span className="truncate" title={tenant.email}>{tenant.email}</span>
                      </a>
                      <a href={`tel:${tenant.phone}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-green-600 transition-colors group/link">
                          <div className="p-1.5 bg-slate-50 rounded-md group-hover/link:bg-green-50">
                              <Phone className="w-4 h-4" />
                          </div>
                          <span className="truncate">{tenant.phone}</span>
                      </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {showModal && (
        <TenantForm 
            onClose={() => setShowModal(false)}
            onSuccess={() => {
                loadData();
            }}
            tenantToEdit={selectedTenant}
        />
      )}
    </div>
  );
}