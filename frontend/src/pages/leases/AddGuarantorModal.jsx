import { useState, useEffect } from 'react';
import { X, Save, UserPlus, Search } from 'lucide-react';
import { leaseGuarantorService } from '../../services/leaseGuarantorService';
import { guarantorService } from '../../services/guarantorService';

export default function AddGuarantorModal({ leaseId, existingGuarantors, onClose, onSuccess }) {
  const [guarantors, setGuarantors] = useState([]);
  const [selectedGuarantorId, setSelectedGuarantorId] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadGuarantors = async () => {
      try {
        const allGuarantors = await guarantorService.getAllGuarantorsDetails();
        
        const existingIds = existingGuarantors.map(g => g.guarantor.id);
        const available = allGuarantors.filter(g => !existingIds.includes(g.id));
        
        setGuarantors(available);
      } catch (error) {
        console.error("Error loading guarantors", error);
      } finally {
        setFetching(false);
      }
    };
    loadGuarantors();
  }, [existingGuarantors]);

  const maskCpf = (cpf) => {
    if (!cpf) return '***.***.***-**';
    const cleanCpf = cpf.replace(/\D/g, '');
    
    if (cleanCpf.length !== 11) return cpf;

    return `${cleanCpf.substring(0, 3)}.***.***-${cleanCpf.substring(9, 11)}`;
  };

  const filteredGuarantors = guarantors.filter(g => {
    const name = (g.fullName || '').toLowerCase();
    const cpf = (g.cpf || '').toString();          
    const term = searchTerm.toLowerCase();

    return name.includes(term) || cpf.includes(term);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGuarantorId) return;

    setLoading(true);
    try {
      const payload = {
        leaseId: parseInt(leaseId),
        guarantorId: parseInt(selectedGuarantorId),
        signatureDate: new Date().toISOString().split('T')[0],
        leaseGuarantorStatus: 'ACTIVE',
        notes: 'Added via Lease Details page'
      };

      await leaseGuarantorService.createLeaseGuarantor(payload);
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert('Erro ao vincular fiador.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            Adicionar Fiador
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Buscar Fiador</label>
            
            <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    type="text"
                    placeholder="Digite o nome ou CPF..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    autoFocus
                />
            </div>

            <label className="block text-sm font-medium text-slate-700 mb-1">Selecione na lista</label>
            {fetching ? (
              <div className="w-full h-10 bg-slate-100 animate-pulse rounded-lg"></div>
            ) : (
              <select
                required
                size={5}
                value={selectedGuarantorId}
                onChange={(e) => setSelectedGuarantorId(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                disabled={guarantors.length === 0}
              >
                {filteredGuarantors.length === 0 && (
                    <option disabled className="py-2 text-slate-400">
                        {searchTerm ? 'Nenhum fiador encontrado com este termo.' : 'Nenhum fiador disponível.'}
                    </option>
                )}

                {filteredGuarantors.map(g => (
                  <option key={g.id} value={g.id} className="py-2 px-1 border-b border-slate-50 last:border-0 cursor-pointer hover:bg-blue-50">
                    {g.fullName} (CPF: {maskCpf(g.cpf)})
                  </option>
                ))}
              </select>
            )}
            
            <p className="text-xs text-slate-500 mt-2 text-right">
                {filteredGuarantors.length} fiador(es) encontrado(s).
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !selectedGuarantorId}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm disabled:opacity-50 flex justify-center items-center gap-2 transition-colors"
            >
              {loading ? 'Vinculando...' : <><Save className="w-4 h-4" /> Confirmar</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}