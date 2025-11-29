import React, { useState, useEffect } from 'react';
import { Building2, TrendingUp, Shield, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Landing() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', phone: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <style>{`
        .fade-in { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .animate-in { opacity: 1; transform: translateY(0); }
        .hover-lift { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .hover-lift:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.12); }
        .gradient-text { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
      `}</style>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Gerencie seus <span className="gradient-text">imóveis</span> com inteligência
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                A plataforma completa para proprietários que desejam maximizar lucros e minimizar problemas com aluguéis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all hover:scale-105 flex items-center justify-center gap-2 font-semibold">
                  Experimente Grátis <ArrowRight className="w-5 h-5" />
                </button>
                <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-all font-semibold">
                  Ver Demonstração
                </button>
              </div>
            </div>
            <div className="fade-in">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform">
                <div className="bg-white rounded-xl p-6 transform -rotate-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <span className="font-semibold text-slate-700">Receita Mensal</span>
                      <span className="text-2xl font-bold text-green-600">R$ 45.890</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <span className="font-semibold text-slate-700">Imóveis Ativos</span>
                      <span className="text-2xl font-bold text-blue-600">24</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                      <span className="font-semibold text-slate-700">Taxa de Ocupação</span>
                      <span className="text-2xl font-bold text-purple-600">98%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Recursos que <span className="gradient-text">facilitam</span> sua vida
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Tudo o que você precisa para gerenciar seus imóveis em um só lugar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: TrendingUp, title: 'Análise Financeira', desc: 'Relatórios detalhados de receitas, despesas e rentabilidade em tempo real.' },
              { icon: Shield, title: 'Gestão de Contratos', desc: 'Automatize contratos, renovações e garanta conformidade legal completa.' },
              { icon: Clock, title: 'Automação Inteligente', desc: 'Lembretes automáticos de pagamentos, manutenções e vencimentos.' }
            ].map((feature, idx) => (
              <div key={idx} className="fade-in hover-lift bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-xl border border-slate-200">
                <div className="bg-blue-600 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              O que nossos <span className="gradient-text">clientes</span> dizem
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Maria Silva', role: '12 imóveis', text: 'Rentify transformou completamente a forma como gerencio meus imóveis. Economizo mais de 15 horas por semana!' },
              { name: 'João Santos', role: '8 imóveis', text: 'A automação de pagamentos e lembretes reduziu drasticamente a inadimplência. Recomendo fortemente!' },
              { name: 'Ana Costa', role: '25 imóveis', text: 'Finalmente consigo ter uma visão clara e completa do meu portfólio. Ferramenta indispensável!' }
            ].map((testimonial, idx) => (
              <div key={idx} className="fade-in hover-lift bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <CheckCircle key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold text-slate-900">{testimonial.name}</p>
                  <p className="text-slate-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Comece hoje mesmo
            </h2>
            <p className="text-xl text-blue-100">
              Preencha o formulário e nossa equipe entrará em contato
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl fade-in">
            {formSubmitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Mensagem enviada!</h3>
                <p className="text-slate-600">Entraremos em contato em breve.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-slate-700 font-semibold mb-2">Nome Completo</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-2">E-mail</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-2">Telefone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all hover:scale-105 font-semibold text-lg"
                >
                  Solicitar Demonstração
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Building2 className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold">Rentify</span>
              </div>
              <p className="text-slate-400">Gestão inteligente de imóveis para locação.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Produto</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demonstração</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Empresa</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Suporte</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>© 2024 Rentify. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}