import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Search, Plus, MoreVertical, 
  Edit, Trash2, MapPin, Star, AlertCircle, Building, Eye 
} from 'lucide-react';
import { landlordService } from '../../services/landlordService';

export default function LandlordsList() {
  const navigate = useNavigate();
  const [landlords, setLandlords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await landlordService.getAllLandlords();
      setLandlords(data);
    } catch (err) {
      console.error(err);
      setError('Não foi possível carregar a lista de locadores.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este perfil de locador?')) {
      try {
        await landlordService.deleteLandlord(id);
        setLandlords(prev => prev.filter(l => l.id !== id));
      } catch (err) {
        alert('Erro ao excluir. O perfil pode estar vinculado a contratos existentes.');
      }
    }
  };

  const filteredLandlords = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return landlords.filter(l => 
      l.fullName?.toLowerCase().includes(term) ||
      l.profileAlias?.toLowerCase().includes(term) ||
      l.cpfCnpj?.includes(term)
    );
  }, [landlords, searchTerm]);

  return (
    <div className="p-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Meus Perfis de Locador</h1>
          <p className="text-slate-500">Gerencie as identidades usadas nos contratos</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/landlords/new')}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Novo Perfil
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nome, apelido ou CPF/CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* GRID */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredLandlords.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Nenhum perfil encontrado</h3>
          <p className="text-slate-500">Crie seu primeiro perfil de locador para emitir contratos.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredLandlords.map((landlord) => (
            <div 
              key={landlord.id} 
              className={`bg-white rounded-xl shadow-sm border hover:shadow-md transition-all group flex flex-col relative
                ${landlord.isDefault ? 'border-blue-200 ring-1 ring-blue-100' : 'border-slate-100'}`}
            >
                {/* DEFAULT BADGE */}
                {landlord.isDefault && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl z-10 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> PADRÃO
                  </div>
                )}

                <div className="p-5 flex items-start justify-between">
                   <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg shrink-0 font-bold
                        ${landlord.isDefault ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                          <Building className="w-6 h-6" />
                      </div>
                      <div className="min-w-0 pr-6">
                          <h3 className="font-bold text-slate-900 line-clamp-1 flex items-center gap-2">
                            {landlord.profileAlias}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium truncate">{landlord.fullName}</p>
                          <p className="text-xs text-slate-400 mt-0.5 font-mono">{landlord.cpfCnpj}</p>
                      </div>
                   </div>
                   
                   {/* ACTION MENU */}
                   <div className="relative group/menu">
                      <button className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">
                        <MoreVertical className="w-5 h-5 text-slate-400" />
                      </button>
                      
                      <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-xl border border-slate-100 py-1 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-50">
                        <button 
                          onClick={() => navigate(`/dashboard/landlords/${landlord.id}`)} 
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" /> Detalhes
                        </button>
                        
                        <button 
                          onClick={() => navigate(`/dashboard/landlords/${landlord.id}/edit`)}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" /> Editar
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(landlord.id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Excluir
                        </button>
                      </div>
                   </div>
                </div>

                <div className="px-5 py-4 bg-slate-50 mt-auto border-t border-slate-100 space-y-2 rounded-b-xl">
                    <div className="flex items-start gap-2 text-sm text-slate-600">
                        <MapPin className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
                        <span className="line-clamp-2 text-xs leading-relaxed">{landlord.fullAddress}</span>
                    </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}