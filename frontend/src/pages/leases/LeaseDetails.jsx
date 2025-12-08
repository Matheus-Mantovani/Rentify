import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Building2, User, Calendar, DollarSign, 
  Shield, CheckCircle, XCircle, AlertTriangle, Edit, Ban, Trash2, Plus
} from 'lucide-react';
import { leaseService } from '../../services/leaseService';
import { leaseGuarantorService } from '../../services/leaseGuarantorService';
import LeaseTerminationModal from './LeaseTerminationModal';

export default function LeaseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  {/* State Management */}
  const [lease, setLease] = useState(null);
  const [guarantors, setGuarantors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTerminateModal, setShowTerminateModal] = useState(false);

  {/* Data Loading */}
  const loadData = async () => {
    setLoading(true);
    try {
      const [leaseData, guarantorsData] = await Promise.all([
        leaseService.getLeaseById(id),
        leaseGuarantorService.getByLeaseId(id)
      ]);
      setLease(leaseData);
      setGuarantors(guarantorsData);
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar detalhes do contrato.');
      navigate('/dashboard/leases');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  {/* Helpers */}
  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('pt-BR') : '-';

  const getStatusBadge = (status) => {
    if (status === 'ACTIVE') return <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold"><CheckCircle className="w-4 h-4"/> Ativo</span>;
    if (status === 'TERMINATED') return <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-bold"><XCircle className="w-4 h-4"/> Encerrado</span>;
    return <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{status}</span>;
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;
  if (!lease) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/leases')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">Contrato #{lease.id}</h1>
                {getStatusBadge(lease.status)}
            </div>
            <p className="text-slate-500 text-sm mt-1">
                {lease.property.address} • {lease.tenant.fullName}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
            {lease.status === 'ACTIVE' && (
                <>
                    <button 
                        onClick={() => setShowTerminateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                    >
                        <Ban className="w-4 h-4" /> Encerrar
                    </button>
                    <button 
                        onClick={() => navigate(`/dashboard/leases/edit/${lease.id}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors"
                    >
                        <Edit className="w-4 h-4" /> Editar
                    </button>
                </>
            )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Main Info) */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Property & Tenant Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Building2 className="w-4 h-4" /> Imóvel
                    </h3>
                    <div className="space-y-1">
                        <p className="font-medium text-slate-900">{lease.property.address}</p>
                        {lease.property.addressComplement && <p className="text-slate-600 text-sm">{lease.property.addressComplement}</p>}
                        <p className="text-slate-500 text-sm">{lease.property.neighborhood}</p>
                        <p className="text-slate-500 text-sm">{lease.property.cityName} - {lease.property.stateCode}</p>
                    </div>
                </div>
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <User className="w-4 h-4" /> Inquilino
                    </h3>
                    <div className="space-y-1">
                        <p className="font-medium text-slate-900 text-lg">{lease.tenant.fullName}</p>
                        <p className="text-slate-500 text-sm">CPF: {lease.tenant.cpf}</p>
                        <p className="text-slate-500 text-sm">{lease.tenant.email}</p>
                        <p className="text-slate-500 text-sm">{lease.tenant.phone}</p>
                    </div>
                </div>
            </div>

            {/* Terms & Financials Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Termos e Valores
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <span className="block text-xs text-slate-500 mb-1">Vigência</span>
                        <div className="font-medium text-slate-900">{formatDate(lease.startDate)} <br/><span className="text-slate-400 text-xs">até</span><br/> {formatDate(lease.endDate)}</div>
                    </div>
                    <div>
                        <span className="block text-xs text-slate-500 mb-1">Dia Vencimento</span>
                        <div className="font-medium text-slate-900 text-lg">Dia {lease.paymentDueDay}</div>
                    </div>
                    <div>
                        <span className="block text-xs text-slate-500 mb-1">Aluguel Base</span>
                        <div className="font-bold text-xl text-green-700">{formatMoney(lease.baseRentValue)}</div>
                    </div>
                    <div>
                        <span className="block text-xs text-slate-500 mb-1">Caução</span>
                        <div className="font-medium text-slate-900">{lease.securityDepositValue ? formatMoney(lease.securityDepositValue) : '-'}</div>
                    </div>
                </div>

                {lease.rentValueInWords && (
                    <div className="mt-6 pt-4 border-t border-slate-100">
                        <p className="text-xs text-slate-400 italic">Valor por extenso: {lease.rentValueInWords}</p>
                    </div>
                )}
            </div>

            {/* Termination Info (Conditional) */}
            {lease.status === 'TERMINATED' && (
                <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                    <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Ban className="w-4 h-4" /> Dados do Encerramento
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <span className="block text-xs text-red-400 mb-1">Data de Saída</span>
                            <div className="font-medium text-red-900">{formatDate(lease.moveOutDate)}</div>
                        </div>
                        <div>
                            <span className="block text-xs text-red-400 mb-1">Condição de Entrega</span>
                            <div className="font-medium text-red-900 capitalize">{lease.moveOutCondition?.toLowerCase().replace('_', ' ')}</div>
                        </div>
                        <div className="md:col-span-3">
                            <span className="block text-xs text-red-400 mb-1">Motivo</span>
                            <div className="font-medium text-red-900 bg-white/50 p-3 rounded-lg border border-red-100">
                                {lease.moveOutReason}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Right Column (Guarantors & Sidebar) */}
        <div className="space-y-6">
            
            {/* Guarantors Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Garantias (Fiadores)
                    </h3>
                    {lease.status === 'ACTIVE' && (
                        <button 
                            onClick={() => alert("Funcionalidade de adicionar fiador será implementada em breve!")} 
                            className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors flex items-center gap-1"
                        >
                            <Plus className="w-3 h-3" /> Adicionar
                        </button>
                    )}
                </div>

                {guarantors.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-lg">
                        Nenhum fiador vinculado.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {guarantors.map(g => (
                            <div key={g.id} className="p-3 border border-slate-100 rounded-lg bg-slate-50 hover:border-blue-200 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">{g.guarantor.fullName}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{g.guaranteeType?.replace(/_/g, ' ')}</p>
                                    </div>
                                    <div className="text-right">
                                        {g.guaranteeValue && <p className="text-xs font-medium text-slate-700">{formatMoney(g.guaranteeValue)}</p>}
                                    </div>
                                </div>
                                <div className="mt-2 text-xs text-slate-400 flex flex-col gap-0.5">
                                    <span>{g.guarantor.email}</span>
                                    <span>{g.guarantor.phone}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Landlord Info */}
            <div className="bg-slate-900 text-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Locador Responsável</h3>
                <p className="font-bold text-lg">{lease.landlordName || 'Não informado'}</p>
                <p className="text-xs text-slate-400 mt-1">Este nome aparecerá nos recibos e documentos oficiais.</p>
            </div>

        </div>
      </div>

      {/* Modals */}
      {showTerminateModal && (
        <LeaseTerminationModal 
            leaseId={lease.id}
            onClose={() => setShowTerminateModal(false)}
            onSuccess={() => loadData()}
        />
      )}

    </div>
  );
}