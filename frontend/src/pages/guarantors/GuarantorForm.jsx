import { useState, useEffect, useRef } from 'react';
import { X, Save, ShieldCheck, MapPin, Phone, Search, User } from 'lucide-react';
import { guarantorService } from '../../services/guarantorService';
import { locationService } from '../../services/locationService';

export default function GuarantorForm({ onClose, onSuccess, guarantorToEdit }) {
  const [formData, setFormData] = useState({
    fullName: '',
    cpf: '',
    rg: '',
    phone: '',
    email: '',
    profession: '',
    maritalStatus: 'SINGLE',
    cityOfBirth: '',
    nationality: 'Brasileiro(a)',
    stateId: '',
    cityId: ''
  });

  const [states, setStates] = useState([]);
  const [citySearch, setCitySearch] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeout = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    locationService.getStates().then(setStates).catch(console.error);
  }, []);

  useEffect(() => {
    if (guarantorToEdit) {
      setIsLoading(true);
      guarantorService.getGuarantorById(guarantorToEdit.id)
        .then(details => {
          setFormData({
            ...details,
            cpf: details.cpf || '',
            rg: details.rg || '',
            cityId: details.cityId || '', 
            stateId: details.stateId || ''
          });
          setCitySearch(details.cityName || '');
        })
        .catch(err => {
            console.error(err);
            setError("Falha ao carregar detalhes do fiador.");
        })
        .finally(() => setIsLoading(false));
    }
  }, [guarantorToEdit]);

  useEffect(() => {
    if (citySearch.length > 2 && showSuggestions) {
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
      const payload = {
        fullName: formData.fullName,
        cpf: formData.cpf.replace(/\D/g, ''),
        rg: formData.rg,
        phone: formData.phone,
        email: formData.email,
        profession: formData.profession,
        maritalStatus: formData.maritalStatus,
        cityOfBirth: formData.cityOfBirth,
        nationality: formData.nationality,
        cityId: parseInt(formData.cityId)
      };

      if (!payload.cityId) throw new Error('A cidade é obrigatória');

      if (guarantorToEdit) {
        await guarantorService.updateGuarantor(guarantorToEdit.id, payload);
      } else {
        await guarantorService.createGuarantor(payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar fiador. Verifique os campos obrigatórios.');
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
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            {guarantorToEdit ? 'Editar Fiador' : 'Novo Fiador'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm border border-red-200 flex items-center gap-2">
               <span className="font-bold">!</span> {error}
            </div>
          )}

          {/* Personal Data */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
              <User className="w-4 h-4" /> Dados Pessoais
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo *</label>
                <input required name="fullName" value={formData.fullName} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CPF *</label>
                <input required name="cpf" value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">RG</label>
                <input name="rg" value={formData.rg} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Estado Civil</label>
                <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="SINGLE">Solteiro(a)</option>
                  <option value="MARRIED">Casado(a)</option>
                  <option value="DIVORCED">Divorciado(a)</option>
                  <option value="WIDOWED">Viúvo(a)</option>
                  <option value="STABLE_UNION">União Estável</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Profissão</label>
                <input name="profession" value={formData.profession} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>

          {/* Contact and Address */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
              <MapPin className="w-4 h-4" /> Contato e Endereço
            </h3>
             <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} placeholder="(00) 00000-0000"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
             </div>

             <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">UF</label>
                  <select name="stateId" value={formData.stateId}
                    onChange={(e) => { handleChange(e); setCitySearch(''); setFormData(prev => ({...prev, cityId: ''})); }}
                    className="w-full px-2 py-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    <option value="">--</option>
                    {states.map(s => <option key={s.id} value={s.id}>{s.stateCode}</option>)}
                  </select>
                </div>
                <div className="col-span-2 relative">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cidade *</label>
                  <div className="relative">
                      <input type="text" value={citySearch}
                      onChange={(e) => { setCitySearch(e.target.value); setShowSuggestions(true); if(e.target.value === '') setFormData(prev => ({...prev, cityId: ''})); }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="Buscar..."
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${error && !formData.cityId ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
                      required={!formData.cityId} />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                  {showSuggestions && citySuggestions.length > 0 && (
                    <ul className="absolute z-20 w-full bg-white border border-slate-200 rounded-lg shadow-xl mt-1 max-h-48 overflow-y-auto">
                      {citySuggestions.map(city => (
                        <li key={city.id} onClick={() => handleSelectCity(city)}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-slate-700 flex justify-between border-b border-slate-50">
                          <span className="font-medium">{city.cityName}</span>
                          <span className="text-slate-400 text-xs bg-slate-100 px-1.5 py-0.5 rounded">{city.stateCode}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
             </div>
          </div>
        </form>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t px-6 py-4 flex justify-end gap-3 z-10 rounded-b-2xl">
          <button onClick={onClose} disabled={isLoading} className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-white font-medium">Cancelar</button>
          <button onClick={handleSubmit} disabled={isLoading} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
            {isLoading ? 'Salvando...' : <><Save className="w-4 h-4" /> Salvar Fiador</>}
          </button>
        </div>
      </div>
    </div>
  );
}