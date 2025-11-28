import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, User, Mail, Lock, Eye, EyeOff, CheckCircle, ArrowRight } from 'lucide-react';
import { authService } from '../../services/authService';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const passwordRequirements = [
    { text: 'Mínimo de 8 caracteres', met: formData.password.length >= 8 },
    { text: 'Uma letra maiúscula', met: /[A-Z]/.test(formData.password) },
    { text: 'Uma letra minúscula', met: /[a-z]/.test(formData.password) },
    { text: 'Um número', met: /[0-9]/.test(formData.password) },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (!acceptTerms) {
      setError('Você deve aceitar os termos e condições');
      return;
    }

    if (!passwordRequirements.every(req => req.met)) {
      setError('A senha não atende aos requisitos mínimos');
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;

      await authService.register(registerData);

      navigate('/login', { 
        state: { successMessage: 'Conta criada com sucesso! Faça login para continuar.' } 
      });

    } catch (err) {
      console.error(err);
      if (err.response) {
        if (err.response.status === 409 || err.response.data?.message?.includes('duplicate')) {
          setError('Usuário ou E-mail já cadastrados.');
        } else if (err.response.data && typeof err.response.data === 'string') {
           setError(err.response.data);
        } else {
          setError('Erro ao criar conta. Verifique os dados.');
        }
      } else if (err.request) {
        setError('Erro de conexão com o servidor.');
      } else {
        setError('Ocorreu um erro inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <style>{`
        .gradient-text { 
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); 
          -webkit-background-clip: text; 
          -webkit-text-fill-color: transparent; 
          background-clip: text; 
        }
        .fade-in { 
          animation: fadeIn 0.6s ease-out; 
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Navbar */}
      <nav className="bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <button onClick={() => handleLinkClick('/')} className="flex items-center space-x-2">
              <Building2 className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold gradient-text">Rentify</span>
            </button>
            
            <div className="flex items-center gap-4">
              <span className="text-slate-600 hidden sm:block">Já tem uma conta?</span>
              <button 
                onClick={() => handleLinkClick('/login')}
                className="text-blue-600 px-6 py-2.5 rounded-lg hover:bg-blue-50 transition-all font-semibold"
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-8 fade-in">
            <h1 className="text-4xl font-bold text-slate-900 mb-3">
              Crie sua conta
            </h1>
            <p className="text-lg text-slate-600">
              Comece a gerenciar seus imóveis de forma inteligente
            </p>
          </div>

          {/* Register Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 fade-in">
            <div className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Full Name Field */}
              <div>
                <label className="block text-slate-700 font-semibold mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                    placeholder="João da Silva"
                    required
                  />
                </div>
              </div>

              {/* Username & Email Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-2">
                    Usuário
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                      placeholder="joaosilva"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-2">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                      placeholder="joao@email.com"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full pl-11 pr-12 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-2">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="w-full pl-11 pr-12 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Requirements */}
              {formData.password && (
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-semibold text-slate-700 mb-2">Requisitos da senha:</p>
                  {passwordRequirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle 
                        className={`w-4 h-4 ${req.met ? 'text-green-500' : 'text-slate-300'}`}
                      />
                      <span className={`text-sm ${req.met ? 'text-green-700' : 'text-slate-500'}`}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Terms & Conditions */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 mt-0.5"
                />
                <span className="text-sm text-slate-600">
                  Eu aceito os{' '}
                  <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
                    Termos de Serviço
                  </button>
                  {' '}e a{' '}
                  <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
                    Política de Privacidade
                  </button>
                </span>
              </label>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all hover:scale-105 font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Criando conta...
                  </>
                ) : (
                  <>
                    Criar Conta
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">Ou cadastre-se com</span>
                </div>
              </div>

              {/* Social Register */}
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-all font-medium text-slate-700">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-all font-medium text-slate-700">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  GitHub
                </button>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <p className="text-center mt-6 text-slate-600">
            Já tem uma conta?{' '}
            <button 
              onClick={() => handleLinkClick('/login')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Fazer login
            </button>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-slate-600 text-sm">
            © 2024 Rentify. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}