import { useState, useEffect, useRef } from 'react';
import { MapPin, X } from 'lucide-react';

export default function CityFilter({ value, onChange, options = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  {/* Close dropdown when clicking outside */}
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  {/* Filter options locally based on typing */}
  const filteredOptions = options.filter(city => 
    city.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className="relative md:w-64" ref={wrapperRef}>
      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
      
      <input
        type="text"
        placeholder="Filtrar por cidade..."
        value={value}
        onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400"
      />

      {/* Clear Button (only shows when there is value) */}
      {value && (
        <button 
            onClick={() => { onChange(''); setIsOpen(false); }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
            <X className="w-4 h-4" />
        </button>
      )}

      {/* Custom Dropdown List */}
      {isOpen && (filteredOptions.length > 0 || options.length > 0) && (
        <div className="absolute z-20 w-full bg-white border border-slate-200 rounded-lg shadow-xl mt-1 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
          <ul className="py-1">
            {/* Show message if no matches found */}
            {value && filteredOptions.length === 0 && (
                <li className="px-4 py-3 text-sm text-slate-400 text-center italic">
                    Nenhuma cidade encontrada
                </li>
            )}

            {/* List Options */}
            {filteredOptions.map((city) => (
              <li 
                key={city}
                onClick={() => {
                  onChange(city);
                  setIsOpen(false);
                }}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-slate-700 flex items-center gap-2 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                {city}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}