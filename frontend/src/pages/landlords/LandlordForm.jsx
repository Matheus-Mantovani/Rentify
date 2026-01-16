import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Save, Building, User, MapPin, CreditCard 
} from 'lucide-react';
import { landlordService } from '../../services/landlordService';

export default function LandlordForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    profileAlias: '',
    isDefault: false,
    fullName: '',
    nationality: '',
    maritalStatus: 'SINGLE',
    profession: '',
    rg: '',
    cpfCnpj: '',
    email: '',
    phone: '',
    fullAddress: '',
    pixKey: '',
    bankDetails: ''
  });

  useEffect(() => {
    if (isEditMode) {
      loadLandlord();
    }
  }, [id]);

  const loadLandlord = async () => {
    try {
      setLoading(true);
      const data = await landlordService.getLandlordById(id);
      setFormData({
        profileAlias: data.profileAlias || '',
        isDefault: data.isDefault || false,
        fullName: data.fullName || '',
        nationality: data.nationality || '',
        maritalStatus: data.maritalStatus || 'SINGLE',
        profession: data.profession || '',
        rg: data.rg || '',
        cpfCnpj: data.cpfCnpj || '',
        email: data.email || '',
        phone: data.phone || '',
        fullAddress: data.fullAddress || '',
        pixKey: data.pixKey || '',
        bankDetails: data.bankDetails || ''
      });
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar dados do perfil. Redirecionando...');
      navigate('/dashboard/landlords');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditMode) {
        await landlordService.updateLandlord(id, formData);
        alert('Perfil atualizado com sucesso!');
      } else {
        await landlordService.createLandlord(formData);
        alert('Perfil criado com sucesso!');
      }
      navigate('/dashboard/landlords');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar perfil. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const InputGroup = ({ label, name, type = "text", required = false, placeholder, colSpan = "col-span-1" }) => (
    <div className={colSpan}>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required={required}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
      />
    </div>
  );

  if (loading && isEditMode && !formData.fullName) {
      return <div className="p-10 text-center">Carregando dados...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/dashboard/landlords')}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEditMode ? 'Editar Perfil' : 'Novo Perfil de Locador'}
          </h1>
          <p className="text-slate-500">
             {isEditMode ? 'Atualize os dados cadastrais do locador' : 'Preencha os dados completos para qualificação contratual'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION: PROFILE IDENTIFICATION */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <Building className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-slate-800">Identificação Interna</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <InputGroup 
              label="Apelido do Perfil (Alias)" 
              name="profileAlias" 
              required 
              placeholder="Ex: Minha Holding, Pessoa Física, etc." 
            />
            
            <div className="flex items-center h-full pt-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 transition-all checked:border-blue-600 checked:bg-blue-600 hover:border-blue-400"
                  />
                  <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 14" fill="none">
                    <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-slate-700 block group-hover:text-blue-600 transition-colors">Definir como Padrão</span>
                    <span className="text-slate-500 text-xs">Será pré-selecionado em novos contratos</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* SECTION: CIVIL QUALIFICATION */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <User className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-slate-800">Qualificação Civil (Dados do Contrato)</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <InputGroup label="Nome Completo / Razão Social" name="fullName" required colSpan="md:col-span-2" />
            <InputGroup label="CPF / CNPJ" name="cpfCnpj" required />
            
            <InputGroup label="RG" name="rg" required />
            <InputGroup label="Nacionalidade" name="nationality" required />
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Estado Civil <span className="text-red-500">*</span></label>
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="SINGLE">Solteiro(a)</option>
                <option value="MARRIED">Casado(a)</option>
                <option value="DIVORCED">Divorciado(a)</option>
                <option value="WIDOWED">Viúvo(a)</option>
                <option value="SEPARATED">Separado(a)</option>
              </select>
            </div>

            <InputGroup label="Profissão" name="profession" required colSpan="md:col-span-3" />
          </div>
        </div>

        {/* SECTION: ADDRESS & CONTACT */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-slate-800">Endereço e Contato</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <InputGroup label="Email" name="email" type="email" />
            <InputGroup label="Telefone" name="phone" />
            <InputGroup label="Endereço Completo" name="fullAddress" required colSpan="md:col-span-2" placeholder="Rua, Número, Bairro, Cidade - UF, CEP" />
          </div>
        </div>

        {/* SECTION: FINANCIAL DATA */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-slate-800">Dados Financeiros (Opcional)</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <InputGroup label="Chave PIX" name="pixKey" />
            <div className="md:col-span-2">
               <label className="block text-sm font-medium text-slate-700 mb-1.5">Dados Bancários</label>
               <textarea 
                  name="bankDetails"
                  value={formData.bankDetails}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Banco, Agência, Conta..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all text-sm"
               />
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/landlords')}
            className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
               <Save className="w-5 h-5" />
            )}
            {loading ? 'Salvando...' : 'Salvar Perfil'}
          </button>
        </div>

      </form>
    </div>
  );
}