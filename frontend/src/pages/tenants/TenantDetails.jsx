import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Phone, Mail, MapPin, FileText, 
  Building2, DollarSign, CheckCircle, XCircle, Calendar, Edit,
  Eye, EyeOff, ExternalLink, ChevronRight
} from 'lucide-react';
import { tenantService } from '../../services/tenantService';
import { leaseService } from '../../services/leaseService';
import { paymentService } from '../../services/paymentService';
import TenantForm from './TenantForm';

export default function TenantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [tenant, setTenant] = useState(null);
  const [leases, setLeases] = useState([]);
  const [payments, setPayments] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const [showSensitive, setShowSensitive] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tenantData, leasesData, paymentsData] = await Promise.all([
          tenantService.getTenantById(id),
          leaseService.getAllLeases({ tenantId: id }),
          paymentService.getAllPayments({ tenantId: id })
      ]);

      setTenant(tenantData);
      setLeases(leasesData);
      
      const sortedPayments = paymentsData.sort((a, b) => 
          new Date(b.paymentDate) - new Date(a.paymentDate)
      );
      setPayments(sortedPayments);
      
    } catch (err) {
      console.error(err);
      setError('Falha ao carregar detalhes do inquilino.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // Helpers
  const formatDate = (dateString) => {
     if(!dateString) return '-';
     const [year, month, day] = dateString.split('-');
     return new Date(year, month - 1, day).toLocaleDateString('pt-BR');
  };

  const formatMoney = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  const formatCPF = (value) => {
    if (!value) return '-';
    if (!showSensitive) return '***.***.***-**';
    const clean = value.replace(/\D/g, '');
    return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatRG = (value) => {
    if (!value) return '-';
    if (!showSensitive) return '**.***.***-*';
    const clean = value.replace(/\D/g, '');
    if (clean.length === 9) {
        return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const formatPhone = (value) => {
    if (!value) return '-';
    const clean = value.replace(/\D/g, '');
    if (clean.length === 11) {
        return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    if (clean.length === 10) {
        return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const getPaymentMethodLabel = (method) => {
      const methods = {
          'PIX': 'Pix',
          'BANK_SLIP': 'Boleto',
          'WIRE_TRANSFER': 'Transferência',
          'CREDIT_CARD': 'Cartão Crédito',
          'CASH': 'Dinheiro'
      };
      return methods[method] || method;
  };

  const getStatusLabel = (status) => {
      const statuses = {
          'ACTIVE': 'Ativo',
          'TERMINATED': 'Encerrado'
      };
      return statuses[status] || status;
  };

  const getMaritalStatusLabel = (status) => {
      if (!status) return '-';
      const statuses = {
          'SINGLE': 'Solteiro(a)',
          'MARRIED': 'Casado(a)',
          'DIVORCED': 'Divorciado(a)',
          'WIDOWED': 'Viúvo(a)',
          'STABLE_UNION': 'União Estável'
      };
      return statuses[status] || status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (error || !tenant) return (
    <div className="p-8 text-center">
      <h2 className="text-red-600 text-xl font-bold mb-2">Erro</h2>
      <p className="text-slate-600 mb-4">{error || 'Inquilino não encontrado'}</p>
      <button onClick={() => navigate('/dashboard/tenants')} className="text-blue-600 hover:underline">Voltar para a lista</button>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/dashboard/tenants')}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          title="Voltar"
        >
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <div className="flex-1">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                    {tenant.fullName ? tenant.fullName.substring(0, 1).toUpperCase() : 'U'}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{tenant.fullName}</h1>
                    <p className="text-slate-500 text-sm">{tenant.profession || 'Profissão não informada'}</p>
                </div>
            </div>
        </div>
        <button 
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          <Edit className="w-4 h-4" /> Editar Inquilino
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-6">
          {['overview', 'contracts', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 text-sm font-medium transition-colors relative ${
                activeTab === tab 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'overview' && 'Visão Geral'}
              {tab === 'contracts' && 'Contratos'}
              {tab === 'history' && 'Histórico Financeiro'}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="animate-in fade-in duration-300">
        
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6">
             <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" /> Informações Pessoais
                    </h3>
                    <button 
                        onClick={() => setShowSensitive(!showSensitive)}
                        className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                        title={showSensitive ? "Ocultar dados sensíveis" : "Mostrar dados sensíveis"}
                    >
                        {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
                
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                   <div><dt className="text-sm text-slate-500">Nome Completo</dt><dd className="text-slate-900 font-medium mt-1">{tenant.fullName}</dd></div>
                   <div><dt className="text-sm text-slate-500">CPF</dt><dd className="text-slate-900 font-medium mt-1 font-mono text-sm">{formatCPF(tenant.cpf)}</dd></div>
                   <div><dt className="text-sm text-slate-500">RG</dt><dd className="text-slate-900 font-medium mt-1">{formatRG(tenant.rg)}</dd></div>
                   <div><dt className="text-sm text-slate-500">Estado Civil</dt><dd className="text-slate-900 font-medium mt-1">{getMaritalStatusLabel(tenant.maritalStatus)}</dd></div>
                   <div><dt className="text-sm text-slate-500">Nacionalidade</dt><dd className="text-slate-900 font-medium mt-1">{tenant.nationality}</dd></div>
                   <div><dt className="text-sm text-slate-500">Naturalidade</dt><dd className="text-slate-900 font-medium mt-1">{tenant.cityOfBirth}</dd></div>
                </dl>
             </div>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-green-600" /> Contatos
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Telefone / WhatsApp</p>
                            <a href={`tel:${tenant.phone}`} className="flex items-center gap-2 text-slate-900 hover:text-green-600 font-medium transition-colors">
                                <Phone className="w-4 h-4" /> {formatPhone(tenant.phone)}
                            </a>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Endereço de Email</p>
                            <a href={`mailto:${tenant.email}`} className="flex items-center gap-2 text-slate-900 hover:text-blue-600 font-medium transition-colors">
                                <Mail className="w-4 h-4" /> {tenant.email}
                            </a>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Localização Atual</p>
                            <div className="flex items-center gap-2 text-slate-900 font-medium">
                                <MapPin className="w-4 h-4 text-slate-400" /> 
                                {tenant.cityName} - {tenant.stateCode}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* Contracts Tab - ATUALIZADO */}
        {activeTab === 'contracts' && (
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">Contratos de Locação</h3>
                    <button 
                        onClick={() => navigate('/dashboard/leases/new', {
                            state: { preselectedTenantId: tenant.id }
                        })}
                        className="text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 font-medium"
                    >
                        + Novo Contrato
                    </button>
                </div>
                
                {leases.length === 0 ? (
                    <div className="bg-slate-50 p-12 rounded-xl text-center border border-dashed border-slate-300">
                        <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                        <p className="text-slate-600">Nenhum contrato encontrado para este inquilino.</p>
                        <p className="text-sm text-slate-400 mt-1">Crie um novo contrato para iniciar uma locação.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {leases.map(lease => (
                            <div key={lease.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-blue-200 hover:shadow-md">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-50 p-2.5 rounded-lg shrink-0">
                                        <Building2 className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 
                                            onClick={() => navigate(`/dashboard/properties/${lease.property?.id}`)}
                                            className="font-bold text-slate-900 text-lg hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-2 group"
                                            title="Ver Imóvel"
                                        >
                                            {lease.property?.address || 'Endereço indisponível'}
                                            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                                        </h4>
                                        <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" /> 
                                                {formatDate(lease.startDate)} - {formatDate(lease.endDate)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <DollarSign className="w-3.5 h-3.5" /> 
                                                R$ {formatMoney(lease.baseRentValue)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 
                                        ${lease.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {lease.status === 'ACTIVE' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                        {getStatusLabel(lease.status)}
                                    </span>
                                    
                                    <button 
                                        onClick={() => navigate(`/dashboard/leases/${lease.id}`)}
                                        className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors border border-slate-200 hover:border-blue-200"
                                    >
                                        Ver Contrato
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
             </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
           <div className="space-y-6">
               <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">Histórico de Pagamentos</h3>
               </div>
               {payments.length === 0 ? (
                   <div className="bg-slate-50 p-12 rounded-xl text-center border border-dashed border-slate-300">
                       <DollarSign className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                       <p className="text-slate-600">Nenhum pagamento encontrado.</p>
                   </div>
               ) : (
                   <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                       <div className="overflow-x-auto">
                           <table className="w-full text-sm text-left">
                               <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                                   <tr>
                                       <th className="px-6 py-3">Data</th>
                                       <th className="px-6 py-3">Referência</th>
                                       <th className="px-6 py-3">Método</th>
                                       <th className="px-6 py-3">ID Contrato</th>
                                       <th className="px-6 py-3 text-right">Valor</th>
                                   </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-100">
                                   {payments.map(payment => (
                                       <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                                           <td className="px-6 py-3 text-slate-600 whitespace-nowrap">
                                               {formatDate(payment.paymentDate)}
                                           </td>
                                           <td className="px-6 py-3 text-slate-900 font-medium">
                                               {payment.referenceMonth}/{payment.referenceYear}
                                           </td>
                                           <td className="px-6 py-3 text-slate-500">
                                               {getPaymentMethodLabel(payment.paymentMethod)}
                                           </td>
                                           <td className="px-6 py-3 text-slate-500">
                                               #{payment.leaseId}
                                           </td>
                                           <td className="px-6 py-3 text-right font-bold text-green-600 whitespace-nowrap">
                                               {formatMoney(payment.amountPaid)}
                                           </td>
                                       </tr>
                                   ))}
                               </tbody>
                           </table>
                       </div>
                   </div>
               )}
           </div>
        )}

      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <TenantForm 
            onClose={() => setShowEditModal(false)}
            onSuccess={() => {
                loadData();
            }}
            tenantToEdit={tenant}
        />
      )}

    </div>
  );
}