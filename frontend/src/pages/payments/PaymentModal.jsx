import { useState, useEffect } from 'react';
import { X, Save, DollarSign, Calendar, FileText, AlertCircle } from 'lucide-react';
import { paymentService } from '../../services/paymentService';

export default function PaymentModal({ lease, referenceDate, onClose, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    amountPaid: '',
    paymentDate: new Date().toISOString().split('T')[0], // Today yyyy-mm-dd
    paymentMethod: 'PIX',
    lateFees: '0.00',
    notes: ''
  });

  {/* Initialize Form Data */}
  useEffect(() => {
    if (lease) {
      // Pre-fill amount with base rent + condo (simple logic, can be expanded)
      // Ideally, the lease object should return the total expected value
      const totalExpected = (lease.baseRentValue || 0); 
      
      setFormData(prev => ({
        ...prev,
        amountPaid: totalExpected.toFixed(2)
      }));
    }
  }, [lease]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const payload = {
        leaseId: lease.id,
        amountPaid: parseFloat(formData.amountPaid),
        paymentDate: formData.paymentDate,
        paymentMethod: formData.paymentMethod,
        referenceMonth: referenceDate.getMonth() + 1, // JS Month is 0-indexed
        referenceYear: referenceDate.getFullYear(),
        lateFees: parseFloat(formData.lateFees),
        notes: formData.notes
      };

      await paymentService.createPayment(payload);
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Erro ao registrar pagamento. Verifique os dados.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              Registrar Pagamento
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Referência: <span className="font-medium text-slate-700 capitalize">{referenceDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Tenant Info (Read Only) */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm">
            <div className="flex justify-between mb-1">
                <span className="text-slate-500">Inquilino:</span>
                <span className="font-medium text-slate-900">{lease?.tenant?.fullName}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-slate-500">Imóvel:</span>
                <span className="font-medium text-slate-900 truncate max-w-[250px]">{lease?.property?.address}</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-200 flex items-center gap-2">
               <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data Pagamento *</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="date"
                        required
                        value={formData.paymentDate}
                        onChange={e => setFormData({...formData, paymentDate: e.target.value})}
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Método *</label>
                <select 
                    value={formData.paymentMethod}
                    onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                    <option value="PIX">Pix</option>
                    <option value="BANK_SLIP">Boleto</option>
                    <option value="WIRE_TRANSFER">Transferência</option>
                    <option value="CASH">Dinheiro</option>
                    <option value="CREDIT_CARD">Cartão de Crédito</option>
                </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Valor Pago (R$) *</label>
                <input 
                    type="number"
                    step="0.01"
                    required
                    value={formData.amountPaid}
                    onChange={e => setFormData({...formData, amountPaid: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-900"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Multa/Juros (R$)</label>
                <input 
                    type="number"
                    step="0.01"
                    value={formData.lateFees}
                    onChange={e => setFormData({...formData, lateFees: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-red-600"
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
            <textarea 
                rows={2}
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                placeholder="Ex: Pagamento parcial, desconto aplicado..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                disabled={isLoading}
            >
                Cancelar
            </button>
            <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
                {isLoading ? 'Registrando...' : <><Save className="w-4 h-4" /> Confirmar Pagamento</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}