import { useState, useEffect, useRef } from 'react';
import { X, Save, MapPin, DollarSign, Home, Search, Building2 } from 'lucide-react';
import { propertyService } from '../../services/propertyService';
import { locationService } from '../../services/locationService';

export default function PropertyForm({ onClose, onSuccess, propertyToEdit }) {
  const [formData, setFormData] = useState({
    address: '',
    addressComplement: '',
    neighborhood: '',
    postalCode: '',
    stateId: '',
    cityId: '',
    status: 'AVAILABLE',
    currentMarketValue: '',
    condoFee: '',
    propertyTaxValue: '',
    registrationNumber: '',
    notes: ''
  });

  // Location control states
  const [states, setStates] = useState([]);
  
  // Autocomplete states
  const [citySearch, setCitySearch] = useState(''); 
  const [citySuggestions, setCitySuggestions] = useState([]); 
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeout = useRef(null); 

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Load States and Initialize Edit Mode
  useEffect(() => {
    locationService.getStates().then(setStates).catch(console.error);

    if (propertyToEdit) {
      setFormData({
        ...propertyToEdit,
        addressComplement: propertyToEdit.addressComplement || '',
        registrationNumber: propertyToEdit.registrationNumber || '',
        notes: propertyToEdit.notes || '',
        stateId: propertyToEdit.stateId || '',
        cityId: propertyToEdit.cityId || '',
      });
      setCitySearch(propertyToEdit.cityName || ''); 
    }
  }, [propertyToEdit]);

  // 2. City Search Logic (Debounce)
  useEffect(() => {
    if (citySearch.length > 1 && showSuggestions) {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);

      searchTimeout.current = setTimeout(async () => {
        try {
          const results = await locationService.searchCities(citySearch, formData.stateId || null);
          setCitySuggestions(results);
        } catch (err) {
          console.error(err);
        }
      }, 500);
    } else {
      setCitySuggestions([]);
    }
  }, [citySearch, formData.stateId, showSuggestions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectCity = (city) => {
    setFormData(prev => ({ ...prev, cityId: city.id }));
    setCitySearch(city.cityName); 
    setShowSuggestions(false); 
    
    // Auto-select state if not selected
    if (!formData.stateId) {
        const state = states.find(s => s.stateCode === city.stateCode);
        if (state) setFormData(prev => ({ ...prev, stateId: state.id }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Data cleaning and formatting
      const payload = {
        ...formData,
        postalCode: formData.postalCode.replace(/\D/g, ''),
        cityId: parseInt(formData.cityId),
        
        currentMarketValue: formData.currentMarketValue ? parseFloat(formData.currentMarketValue) : 0,
        condoFee: formData.condoFee ? parseFloat(formData.condoFee) : 0,
        propertyTaxValue: formData.propertyTaxValue ? parseFloat(formData.propertyTaxValue) : 0,
      };
      
      delete payload.stateId; 

      if (propertyToEdit) {
        await propertyService.updateProperty(propertyToEdit.id, payload);
      } else {
        await propertyService.createProperty(payload);
      }
      
      onSuccess(); 
      onClose();   
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar imóvel. Verifique se todos os campos obrigatórios estão preenchidos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            {propertyToEdit ? 'Editar Imóvel' : 'Novo Imóvel'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-red-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm border border-red-200 flex items-center gap-2">
              <span className="font-bold">!</span> {error}
            </div>
          )}

          {/* Location Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
              <MapPin className="w-4 h-4" /> Localização
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Endereço *</label>
                <input
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Rua, Número"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Complemento</label>
                <input
                  name="addressComplement"
                  value={formData.addressComplement}
                  onChange={handleChange}
                  placeholder="Apto, Bloco..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bairro *</label>
                <input
                  required
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CEP *</label>
                <input
                  required
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="00000-000"
                  maxLength={9}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 md:col-span-1">
                
                {/* State Select */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">UF</label>
                  <select
                    name="stateId"
                    value={formData.stateId}
                    onChange={(e) => {
                      handleChange(e);
                      setCitySearch(''); 
                      setFormData(prev => ({...prev, cityId: ''}));
                    }}
                    className="w-full px-2 py-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  >
                    <option value="">--</option>
                    {states.map(s => <option key={s.id} value={s.id}>{s.stateCode}</option>)}
                  </select>
                </div>

                {/* City Autocomplete */}
                <div className="col-span-2 relative">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cidade *</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={citySearch}
                      onChange={(e) => {
                        setCitySearch(e.target.value);
                        setShowSuggestions(true);
                        if(e.target.value === '') setFormData(prev => ({...prev, cityId: ''}));
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder={formData.stateId ? "Buscar..." : "Buscar..."}
                      className={`w-full pl-8 pr-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all ${error && !formData.cityId ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
                      required={!formData.cityId}
                    />
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>

                  {/* Suggestions Dropdown */}
                  {showSuggestions && citySuggestions.length > 0 && (
                    <ul className="absolute z-20 w-full bg-white border border-slate-200 rounded-lg shadow-xl mt-1 max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                      {citySuggestions.map(city => (
                        <li 
                          key={city.id}
                          onClick={() => handleSelectCity(city)}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-slate-700 flex justify-between items-center border-b border-slate-50 last:border-0"
                        >
                          <span className="font-medium">{city.cityName}</span>
                          <span className="text-slate-400 text-xs bg-slate-100 px-1.5 py-0.5 rounded">{city.stateCode}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Property Details Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
              <Home className="w-4 h-4" /> Detalhes
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
                >
                  <option value="AVAILABLE">Disponível</option>
                  <option value="RENTED">Alugado</option>
                  <option value="UNDER_MAINTENANCE">Em Manutenção</option>
                  <option value="INACTIVE">Inativo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Matrícula</label>
                <input
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  placeholder="Ex: 123456"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Financial Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
              <DollarSign className="w-4 h-4" /> Financeiro
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Valor Mercado</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">R$</span>
                    <input
                    type="number"
                    step="0.01"
                    name="currentMarketValue"
                    value={formData.currentMarketValue}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Condomínio</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">R$</span>
                    <input
                    type="number"
                    step="0.01"
                    name="condoFee"
                    value={formData.condoFee}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">IPTU (Anual)</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">R$</span>
                    <input
                    type="number"
                    step="0.01"
                    name="propertyTaxValue"
                    value={formData.propertyTaxValue}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Informações adicionais sobre o imóvel..."
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
              />
            </div>
          </div>

        </form>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t px-6 py-4 flex justify-end gap-3 z-10 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-white hover:border-slate-400 transition-all font-medium"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Salvar Imóvel
              </>
            )}
          </button>
        </div>

      </div>
      
      {/* Auxiliary Icon Import */}
      <div className="hidden"><Building2 /></div>
    </div>
  );
}