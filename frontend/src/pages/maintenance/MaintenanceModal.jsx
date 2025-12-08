import { useState, useEffect, useRef } from 'react';
import { X, Save, Hammer, Calendar, DollarSign, Wrench, Search, Building2 } from 'lucide-react';
import { maintenanceService } from '../../services/maintenanceService';

export default function MaintenanceModal({ onClose, onSuccess, jobToEdit, properties }) {
  const [formData, setFormData] = useState({
    propertyId: '',
    serviceDescription: '',
    serviceProvider: '',
    requestDate: new Date().toISOString().split('T')[0],
    completionDate: '',
    maintenanceStatus: 'PENDING',
    totalCost: ''
  });

  const [propertySearch, setPropertySearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (jobToEdit) {
      setFormData({
        propertyId: jobToEdit.propertyId,
        serviceDescription: jobToEdit.serviceDescription,
        serviceProvider: jobToEdit.serviceProvider || '',
        requestDate: jobToEdit.requestDate,
        completionDate: jobToEdit.completionDate || '',
        maintenanceStatus: jobToEdit.maintenanceStatus,
        totalCost: jobToEdit.totalCost || ''
      });

      const prop = properties.find(p => p.id === jobToEdit.propertyId);
      if (prop) {
        setPropertySearch(`${prop.address} - ${prop.cityName}/${prop.stateCode}`);
      }
    }
  }, [jobToEdit, properties]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const filteredProperties = properties.filter(prop => 
    prop.address.toLowerCase().includes(propertySearch.toLowerCase()) ||
    prop.cityName.toLowerCase().includes(propertySearch.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectProperty = (prop) => {
    setFormData(prev => ({ ...prev, propertyId: prop.id }));
    setPropertySearch(`${prop.address} - ${prop.cityName}/${prop.stateCode}`);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.propertyId) {
      setError('Por favor, selecione um imóvel válido da lista.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        propertyId: parseInt(formData.propertyId),
        totalCost: formData.totalCost ? parseFloat(formData.totalCost) : 0.0
      };

      if (jobToEdit) {
        await maintenanceService.updateJob(jobToEdit.id, payload);
      } else {
        await maintenanceService.createJob(payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar manutenção. Verifique os campos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Hammer className="w-5 h-5 text-blue-600" />
            {jobToEdit ? 'Editar Manutenção' : 'Nova Manutenção'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          {/* Section: Property & Service */}
          <div className="space-y-4">
            
            {/* Search Property Field */}
            <div className="relative" ref={wrapperRef}>
              <label className="block text-sm font-medium text-slate-700 mb-1">Imóvel *</label>
              <div className="relative">
                <input
                  type="text"
                  value={propertySearch}
                  onChange={(e) => {
                    setPropertySearch(e.target.value);
                    setShowSuggestions(true);
                    if(e.target.value === '') setFormData(prev => ({...prev, propertyId: ''}));
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Busque por endereço ou cidade..."
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all ${error && !formData.propertyId ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
                  required
                />
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>

              {/* Sugestion List */}
              {showSuggestions && (
                <ul className="absolute z-20 w-full bg-white border border-slate-200 rounded-lg shadow-xl mt-1 max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                  {filteredProperties.length === 0 ? (
                    <li className="px-4 py-3 text-sm text-slate-400 text-center italic">
                      Nenhum imóvel encontrado.
                    </li>
                  ) : (
                    filteredProperties.map(prop => (
                      <li 
                        key={prop.id}
                        onClick={() => handleSelectProperty(prop)}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-slate-700 flex flex-col border-b border-slate-50 last:border-0"
                      >
                        <span className="font-medium text-slate-900">{prop.address}</span>
                        <span className="text-xs text-slate-500">{prop.cityName} - {prop.stateCode}</span>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Descrição do Serviço *</label>
              <input
                name="serviceDescription"
                value={formData.serviceDescription}
                onChange={handleChange}
                required
                placeholder="Ex: Reparo no encanamento da cozinha"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Prestador de Serviço</label>
                <div className="relative">
                  <input
                    name="serviceProvider"
                    value={formData.serviceProvider}
                    onChange={handleChange}
                    placeholder="Nome da empresa ou profissional"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>
              
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Custo Total (R$)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    name="totalCost"
                    value={formData.totalCost}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 my-4"></div>

          {/* Section: Status & Dates */}
          <div className="grid md:grid-cols-3 gap-4">
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data Solicitação *</label>
              <div className="relative">
                <input
                  type="date"
                  name="requestDate"
                  value={formData.requestDate}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data Conclusão</label>
               <div className="relative">
                <input
                  type="date"
                  name="completionDate"
                  value={formData.completionDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                name="maintenanceStatus"
                value={formData.maintenanceStatus}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="PENDING">Pendente</option>
                <option value="IN_PROGRESS">Em Andamento</option>
                <option value="COMPLETED">Concluído</option>
                <option value="CANCELED">Cancelado</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-white font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm disabled:opacity-70"
            >
              {isLoading ? 'Salvando...' : <><Save className="w-4 h-4" /> Salvar</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}