import React from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audioEffects';

interface HeaderProps {
  onNewCake: () => void;
  activeView: 'builder' | 'gallery';
  onToggleView: (view: 'builder' | 'gallery') => void;
  totalCakes: number;
}

export const Header: React.FC<HeaderProps> = ({
  onNewCake,
  activeView,
  onToggleView,
  totalCakes,
}) => {
  return (
    <header className="flex items-center justify-between gap-4 md:gap-8 px-4 md:px-8 py-3.5 bg-white/90 backdrop-blur-md border-b border-pink-100 sticky top-0 z-30 shadow-2xs">
      {/* Zone 1: Cheerful Logo / Brand Name */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          sounds.playPop();
          onToggleView('gallery');
        }}
        className="text-xl md:text-2xl font-black font-display tracking-tight text-[#FF477E] whitespace-nowrap shrink-0 flex items-center gap-2 hover:scale-105 transition-transform"
      >
        <span className="text-2xl">🎂</span>
        <span className="bg-gradient-to-r from-[#FF477E] to-[#FF85A1] bg-clip-text text-transparent">PastelChef</span>
      </a>

      {/* Zone 2: Playful Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-gray-600">
        <button
          type="button"
          onClick={() => {
            sounds.playPop();
            onToggleView('gallery');
          }}
          className={`hover:text-[#FF477E] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeView === 'gallery' ? 'text-[#FF477E] underline underline-offset-4 decoration-2 decoration-[#FF477E]' : ''
          }`}
        >
          <span>🎈 Mis Pasteles</span>
          <span className="bg-pink-100 text-pink-700 text-[10px] px-2 py-0.5 rounded-full font-extrabold">{totalCakes}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            sounds.playPop();
            onToggleView('builder');
          }}
          className={`hover:text-[#FF477E] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeView === 'builder' ? 'text-[#FF477E] underline underline-offset-4 decoration-2 decoration-[#FF477E]' : ''
          }`}
        >
          <span>✨ Crear Pastel</span>
        </button>
        <a
          href="#catalogo-insumos"
          onClick={() => sounds.playPop()}
          className="hover:text-[#FF477E] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <span>🍭 Despensa Dulce</span>
        </a>
      </nav>

      {/* Zone 3: Primary Action */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => {
            sounds.playSparkle();
            onNewCake();
          }}
          className="px-3.5 md:px-4 py-2 text-xs font-black text-white bg-[#FF477E] hover:bg-[#FF2E6D] rounded-2xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-xs active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Nuevo Pastel</span>
        </button>
      </div>
    </header>
  );
};
