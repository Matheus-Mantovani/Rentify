import { useState, useEffect } from 'react';
import { Building2, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Building2 className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold gradient-text">Rentify</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            {['Início', 'Recursos', 'Depoimentos', 'Contato'].map((item, idx) => (
              <button
                key={item}
                onClick={() => scrollToSection(['hero', 'features', 'testimonials', 'contact'][idx])}
                className="text-slate-700 hover:text-blue-600 font-medium transition-colors"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="hidden md:flex gap-3">
            <button 
              onClick={() => navigate('/login')}
              className="text-blue-600 px-6 py-2.5 rounded-lg hover:bg-blue-50 transition-all font-semibold"
            >
              Entrar
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all hover:scale-105 font-semibold"
            >
              Começar Agora
            </button>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-slate-700">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t mt-3">
          <div className="px-4 py-4 space-y-3">
            {['Início', 'Recursos', 'Depoimentos', 'Contato'].map((item, idx) => (
              <button
                key={item}
                onClick={() => scrollToSection(['hero', 'features', 'testimonials', 'contact'][idx])}
                className="block w-full text-left text-slate-700 hover:text-blue-600 font-medium py-2"
              >
                {item}
              </button>
            ))}
            <button 
              onClick={() => navigate('/login')}
              className="w-full text-blue-600 px-6 py-2.5 rounded-lg hover:bg-blue-50 font-semibold border border-blue-600"
            >
              Entrar
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="w-full bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Começar Agora
            </button>
          </div>
        </div>
      )}

      <style>{`
        .gradient-text { 
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); 
          -webkit-background-clip: text; 
          -webkit-text-fill-color: transparent; 
          background-clip: text; 
        }
      `}</style>
    </nav>
  );
}