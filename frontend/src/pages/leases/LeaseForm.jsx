import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Save, Building2, User, Calendar, DollarSign, Briefcase 
} from 'lucide-react';
import { leaseService } from '../../services/leaseService';
import { propertyService } from '../../services/propertyService';
import { tenantService } from '../../services/tenantService';
import { landlordService } from '../../services/landlordService';

export default function LeaseForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  const isEditMode = !!id;
  
  const preselectedTenantId = location.state?.preselectedTenantId || '';

  const [formData, setFormData] = useState({
    propertyId: '',
    tenantId: preselectedTenantId,
    landlordProfileId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    paymentDueDay: '10',
    baseRentValue: '',
    securityDepositValue: '',
    paintingFeeValue: ''
  });

  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [landlords, setLandlords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    const loadResources = async () => {
      try {
        const [tenantsData, allProperties, landlordsData] = await Promise.all([
            tenantService.getAllTenants(),
            propertyService.getAllProperties(),
            landlordService.getAllLandlords()
        ]);

        setTenants(tenantsData);
        setLandlords(landlordsData);

        if (isEditMode) {
            const lease = await leaseService.getLeaseById(id);
            setFormData({
                propertyId: lease.property.id,
                tenantId: lease.tenant.id,
                landlordProfileId: lease.landlordProfile?.id || '',
                startDate: lease.startDate,
                endDate: lease.endDate,
                paymentDueDay: lease.paymentDueDay,
                baseRentValue: lease.baseRentValue,
                securityDepositValue: lease.securityDepositValue || '',
                paintingFeeValue: lease.paintingFeeValue || ''
            });
            const validProperties = allProperties.filter(p => p.status === 'AVAILABLE' || p.id === lease.property.id);
            setProperties(validProperties);
        } else {
            setProperties(allProperties.filter(p => p.status === 'AVAILABLE'));
            
            if (preselectedTenantId) {
                setFormData(prev => ({ ...prev, tenantId: preselectedTenantId }));
            }

            const defaultLandlord = landlordsData.find(l => l.isDefault);
            if (defaultLandlord) {
                setFormData(prev => ({ ...prev, landlordProfileId: defaultLandlord.id }));
            }
        }

      } catch (err) {
        console.error("Failed to load form resources", err);
        alert("Erro ao carregar dados. Verifique a conexão.");
      } finally {
        setFetchingData(false);
      }
    };
    loadResources();
  }, [id, isEditMode, preselectedTenantId]);

  const handlePropertyChange = (propId) => {
    const property = properties.find(p => p.id === parseInt(propId));
    
    setFormData(prev => ({
        ...prev,
        propertyId: propId,
        baseRentValue: property?.currentMarketValue || prev.baseRentValue,
    }));
  };

  const calculateEndDate = (months) => {
    if (!formData.startDate) return;
    const start = new Date(formData.startDate);
    const end = new Date(start.setMonth(start.getMonth() + months));
    end.setDate(end.getDate() - 1);
    
    setFormData(prev => ({ ...prev, endDate: end.toISOString().split('T')[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const payload = {
            ...formData,
            propertyId: parseInt(formData.propertyId),
            tenantId: parseInt(formData.tenantId),
            landlordProfileId: parseInt(formData.landlordProfileId),
            paymentDueDay: parseInt(formData.paymentDueDay),
            baseRentValue: parseFloat(formData.baseRentValue),
            securityDepositValue: formData.securityDepositValue ? parseFloat(formData.securityDepositValue) : null,
            paintingFeeValue: formData.paintingFeeValue ? parseFloat(formData.paintingFeeValue) : null,
        };

        delete payload.landlordName;

        if (isEditMode) {
            await leaseService.updateLease(id, payload);
        } else {
            await leaseService.createLease(payload);
        }
        
        navigate('/dashboard/leases');
    } catch (err) {
        console.error(err);
        alert("Erro ao salvar contrato. Verifique os campos.");
    } finally {
        setLoading(false);
    }
  };

  if (fetchingData) return <div className="p-10 text-center">Carregando formulário...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/dashboard/leases')} className="p-2 hover:bg-slate-100 rounded-full">
            <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <div>
            <h1 className="text-2xl font-bold text-slate-900">{isEditMode ? 'Editar Contrato' : 'Novo Contrato de Locação'}</h1>
            <p className="text-slate-500">Preencha os dados para formalizar o vínculo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: ENTITIES */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Vinculação
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
                
                {/* Property Select */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Imóvel *</label>
                    <select
                        required
                        value={formData.propertyId}
                        onChange={(e) => handlePropertyChange(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                        disabled={isEditMode}
                    >
                        <option value="">Selecione um imóvel disponível...</option>
                        {properties.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.address} {p.addressComplement ? ` - ${p.addressComplement}` : ''} ({p.cityName})
                            </option>
                        ))}
                    </select>
                    {!isEditMode && properties.length === 0 && (
                        <p className="text-xs text-red-500 mt-1">Nenhum imóvel disponível no momento.</p>
                    )}
                </div>

                {/* Tenant Select */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Inquilino *</label>
                    <select
                        required
                        value={formData.tenantId}
                        onChange={(e) => setFormData({...formData, tenantId: e.target.value})}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-slate-100 disabled:text-slate-500"
                        disabled={!!preselectedTenantId}
                    >
                        <option value="">Selecione o inquilino...</option>
                        {tenants.map(t => (
                            <option key={t.id} value={t.id}>{t.fullName} (CPF: {t.cpf})</option>
                        ))}
                    </select>
                </div>

                {/* Landlord Select */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1 items-center gap-2">
                        <Briefcase className="w-4 h-4 text-slate-400" />
                        Locador (Proprietário do Contrato) *
                    </label>
                    <select
                        required
                        value={formData.landlordProfileId}
                        onChange={(e) => setFormData({...formData, landlordProfileId: e.target.value})}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="">Selecione o perfil do locador...</option>
                        {landlords.map(l => (
                            <option key={l.id} value={l.id}>
                                {l.profileAlias} — {l.fullName} {l.isDefault ? '(Padrão)' : ''}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-1">
                        Selecione qual identidade legal assinará este contrato. <a href="/dashboard/landlords/new" className="text-blue-600 hover:underline">Criar novo perfil</a>
                    </p>
                </div>
            </div>
        </div>

        {/* SECTION 2: DATES */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Vigência e Prazos
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6 items-end">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Data de Início *</label>
                    <input 
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Data de Término *</label>
                    <div className="flex gap-2">
                        <input 
                            type="date"
                            required
                            value={formData.endDate}
                            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Quick Buttons */}
                <div className="flex gap-2 pb-1">
                    <button type="button" onClick={() => calculateEndDate(12)} className="px-3 py-2 text-xs bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors">12 Meses</button>
                    <button type="button" onClick={() => calculateEndDate(24)} className="px-3 py-2 text-xs bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors">24 Meses</button>
                    <button type="button" onClick={() => calculateEndDate(30)} className="px-3 py-2 text-xs bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors">30 Meses</button>
                </div>

                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Dia do Vencimento *</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="number"
                            min="1" max="31"
                            required
                            value={formData.paymentDueDay}
                            onChange={(e) => setFormData({...formData, paymentDueDay: e.target.value})}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* SECTION 3: FINANCIALS */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Valores Financeiros
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Valor do Aluguel Base *</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">R$</span>
                        <input 
                            type="number"
                            step="0.01"
                            required
                            value={formData.baseRentValue}
                            onChange={(e) => setFormData({...formData, baseRentValue: e.target.value})}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-bold text-slate-800"
                            placeholder="0.00"
                        />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Este valor será usado para gerar os pagamentos mensais.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Caução / Depósito</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
                        <input 
                            type="number"
                            step="0.01"
                            value={formData.securityDepositValue}
                            onChange={(e) => setFormData({...formData, securityDepositValue: e.target.value})}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Taxa de Pintura</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
                        <input 
                            type="number"
                            step="0.01"
                            value={formData.paintingFeeValue}
                            onChange={(e) => setFormData({...formData, paintingFeeValue: e.target.value})}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="0.00"
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4">
            <button
                type="button"
                onClick={() => navigate('/dashboard/leases')}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-white font-medium transition-colors"
            >
                Cancelar
            </button>
            <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md flex items-center gap-2 transition-colors disabled:opacity-70"
            >
                {loading ? 'Salvando...' : <><Save className="w-5 h-5" /> Salvar Contrato</>}
            </button>
        </div>

      </form>
    </div>
  );
}