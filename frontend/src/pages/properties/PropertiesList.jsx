import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, Home, Search, Plus, Filter, MoreVertical, 
  Edit, Trash2, Eye, X, MapPin, FileText, Calendar, AlertCircle
} from 'lucide-react';
import { propertyService } from '../../services/propertyService';
import PropertyForm from './PropertyForm';

export default function PropertiesList() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const data = await propertyService.getAllProperties();
      setProperties(data);
    } catch (err) {
      console.error("Erro ao carregar imóveis:", err);
      setError('Não foi possível carregar a lista de imóveis.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este imóvel?')) {
      try {
        await propertyService.deleteProperty(id);
        setProperties(prev => prev.filter(p => p.id !== id));
      } catch (err) {
        alert('Erro ao excluir imóvel.');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      AVAILABLE: 'bg-green-100 text-green-700 border-green-200',
      RENTED: 'bg-blue-100 text-blue-700 border-blue-200',
      UNDER_MAINTENANCE: 'bg-orange-100 text-orange-700 border-orange-200',
      INACTIVE: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[status] || colors.INACTIVE;
  };

  const getStatusLabel = (status) => {
    const labels = {
      AVAILABLE: 'Disponível',
      RENTED: 'Alugado',
      UNDER_MAINTENANCE: 'Em Manutenção',
      INACTIVE: 'Inativo'
    };
    return labels[status] || status;
  };

  const formatMoney = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  const filteredProperties = properties.filter(property => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      property.address?.toLowerCase().includes(searchLower) ||
      property.neighborhood?.toLowerCase().includes(searchLower) ||
      property.cityName?.toLowerCase().includes(searchLower);
      
    const matchesStatus = statusFilter === 'ALL' || property.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { 
      label: 'Total de Imóveis', 
      value: properties.length, 
      color: 'bg-blue-500',
      icon: Building2
    },
    { 
      label: 'Disponíveis', 
      value: properties.filter(p => p.status === 'AVAILABLE').length, 
      color: 'bg-green-500',
      icon: Home
    },
    { 
      label: 'Alugados', 
      value: properties.filter(p => p.status === 'RENTED').length, 
      color: 'bg-purple-500',
      icon: FileText
    },
    { 
      label: 'Em Manutenção', 
      value: properties.filter(p => p.status === 'UNDER_MAINTENANCE').length, 
      color: 'bg-orange-500',
      icon: Calendar
    }
  ];

  return (
    <div className="p-6 space-y-6">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gerenciar Imóveis</h1>
          <p className="text-slate-500">Controle completo do seu portfólio</p>
        </div>
        <button 
          onClick={() => { setSelectedProperty(null); setShowModal(true); }}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Novo Imóvel
        </button>
      </div>

      {/* --- ERROR MESSAGE --- */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
            <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center shadow-sm`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* --- FILTERS --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por endereço, bairro ou cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="relative md:w-64">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white appearance-none cursor-pointer"
          >
            <option value="ALL">Todos os Status</option>
            <option value="AVAILABLE">Disponível</option>
            <option value="RENTED">Alugado</option>
            <option value="UNDER_MAINTENANCE">Em Manutenção</option>
            <option value="INACTIVE">Inativo</option>
          </select>
        </div>
      </div>

      {/* --- PROPERTIES GRID --- */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Nenhum imóvel encontrado</h3>
          <p className="text-slate-500">Tente ajustar os filtros ou adicione um novo imóvel.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all group">
              <div className="h-48 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-500 z-10 opacity-90" />
                <Home className="w-16 h-16 text-white/80 relative z-20" />
                <span className={`absolute top-3 right-3 z-20 px-3 py-1 rounded-full text-xs font-bold bg-white/90 ${getStatusColor(property.status).replace('bg-', 'text-').split(' ')[1]}`}>
                  {getStatusLabel(property.status)}
                </span>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 line-clamp-1" title={property.address}>
                      {property.address}
                    </h3>
                    <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {property.neighborhood}, {property.cityName}-{property.stateCode}
                    </p>
                  </div>
                  
                  {/* Menu de Ações */}
                  <div className="relative group/menu">
                    <button className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">
                      <MoreVertical className="w-5 h-5 text-slate-400" />
                    </button>
                    <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-100 py-1 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20">
                      <button 
                        onClick={() => navigate(`/dashboard/properties/${property.id}`)}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                        <Eye className="w-4 h-4" /> Detalhes
                      </button>
                      <button 
                        onClick={() => { setSelectedProperty(property); setShowModal(true); }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" /> Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(property.id)}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Excluir
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Valor de Mercado</span>
                    <span className="font-semibold text-slate-900">{formatMoney(property.currentMarketValue)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Condomínio</span>
                    <span className="font-semibold text-slate-900">{formatMoney(property.condoFee)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            {showModal && (
              <PropertyForm 
                onClose={() => setShowModal(false)} 
                onSuccess={loadProperties}
                propertyToEdit={selectedProperty}
              />
            )}
        </div>
      )}
    </div>
  );
}