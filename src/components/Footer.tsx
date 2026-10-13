import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer id="taller-info" className="w-full bg-white border-t border-pink-100 py-8 px-6 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎂</span>
          <div>
            <span className="text-sm font-black text-gray-800 block">
              PastelChef · El Juego de Crear Pasteles
            </span>
            <p className="text-xs text-gray-500 font-medium">
              ¡Diseña, decora y comparte pasteles deliciosos con toda tu creatividad!
            </p>
          </div>
        </div>

        <div className="text-xs text-gray-400 font-semibold flex items-center gap-2">
          <span>🍓 100% Diversión Dulce</span>
          <span>·</span>
          <span>© {new Date().getFullYear()} PastelChef</span>
        </div>
      </div>
    </footer>
  );
};
