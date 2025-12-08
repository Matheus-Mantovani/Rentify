import { useState } from 'react';
import { X, AlertTriangle, Save } from 'lucide-react';
import { leaseService } from '../../services/leaseService';

export default function LeaseTerminationModal({ leaseId, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    moveOutDate: new Date().toISOString().split('T')[0],
    moveOutCondition: 'GOOD',
    moveOutReason: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await leaseService.terminateLease(leaseId, formData);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao encerrar contrato.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Encerrar Contrato
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-red-100 rounded-full text-red-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-slate-600 mb-4">
            Esta ação finalizará a vigência do contrato e liberará o imóvel para novas locações.
          </p>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Data de Saída *</label>
            <input 
              type="date"
              required
              value={formData.moveOutDate}
              onChange={e => setFormData({...formData, moveOutDate: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Condição do Imóvel *</label>
            <select
              value={formData.moveOutCondition}
              onChange={e => setFormData({...formData, moveOutCondition: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white"
            >
              <option value="EXCELLENT">Excelente (Sem reparos)</option>
              <option value="GOOD">Bom (Desgaste natural)</option>
              <option value="FAIR">Razoável (Pequenos reparos)</option>
              <option value="NEEDS_REPAIRS">Precisa de Reparos (Manutenção)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Motivo / Observações</label>
            <textarea 
              rows={3}
              required
              value={formData.moveOutReason}
              onChange={e => setFormData({...formData, moveOutReason: e.target.value})}
              placeholder="Ex: Fim de contrato, Despejo, Mudança de cidade..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm flex items-center gap-2"
            >
              {loading ? 'Processando...' : 'Confirmar Encerramento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}