import { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, Search, Plus, MoreVertical, 
  Edit, Trash2, Phone, Mail, AlertCircle 
} from 'lucide-react';
import { guarantorService } from '../../services/guarantorService';
import GuarantorForm from './GuarantorForm';

export default function GuarantorsList() {
  const [guarantors, setGuarantors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [selectedGuarantor, setSelectedGuarantor] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await guarantorService.getAllGuarantors();
      setGuarantors(data);
    } catch (err) {
      console.error(err);
      setError('Não foi possível carregar a lista de fiadores.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este fiador?')) {
      try {
        await guarantorService.deleteGuarantor(id);
        setGuarantors(prev => prev.filter(g => g.id !== id));
      } catch (err) {
        alert('Erro ao excluir. Verifique se o fiador está vinculado a um contrato ativo.');
      }
    }
  };

  const filteredGuarantors = useMemo(() => {
    return guarantors.filter(g => 
      g.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [guarantors, searchTerm]);

  return (
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gerenciar Fiadores</h1>
          <p className="text-slate-500">Cadastro e controle de garantias</p>
        </div>
        <button 
          onClick={() => { setSelectedGuarantor(null); setShowModal(true); }}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Novo Fiador
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredGuarantors.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Nenhum fiador encontrado</h3>
          <p className="text-slate-500">Adicione um novo fiador para começar.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGuarantors.map((guarantor) => (
            <div key={guarantor.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all group flex flex-col">
                <div className="p-5 flex items-start justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg shrink-0">
                          {guarantor.fullName ? guarantor.fullName.substring(0, 2).toUpperCase() : 'F'}
                      </div>
                      <div className="min-w-0">
                          <h3 className="font-bold text-slate-900 line-clamp-1" title={guarantor.fullName}>
                            {guarantor.fullName}
                          </h3>
                          <p className="text-xs text-slate-500">Fiador Cadastrado</p>
                      </div>
                   </div>
                   
                   <div className="relative group/menu">
                      <button className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">
                        <MoreVertical className="w-5 h-5 text-slate-400" />
                      </button>
                      <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-100 py-1 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20">
                        <button 
                          onClick={() => { setSelectedGuarantor(guarantor); setShowModal(true); }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" /> Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(guarantor.id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Excluir
                        </button>
                      </div>
                   </div>
                </div>

                <div className="p-5 pt-0 mt-auto space-y-3">
                    <a href={`mailto:${guarantor.email}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-blue-600 transition-colors">
                        <div className="p-1.5 bg-slate-50 rounded-md"><Mail className="w-4 h-4" /></div>
                        <span className="truncate">{guarantor.email}</span>
                    </a>
                    <a href={`tel:${guarantor.phone}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-green-600 transition-colors">
                        <div className="p-1.5 bg-slate-50 rounded-md"><Phone className="w-4 h-4" /></div>
                        <span className="truncate">{guarantor.phone}</span>
                    </a>
                </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <GuarantorForm 
            onClose={() => setShowModal(false)}
            onSuccess={() => loadData()}
            guarantorToEdit={selectedGuarantor}
        />
      )}
    </div>
  );
}