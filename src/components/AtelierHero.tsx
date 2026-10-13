import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { sounds } from '../utils/audioEffects';

interface AtelierHeroProps {
  onStartCreating: () => void;
  totalCakes: number;
}

export const AtelierHero: React.FC<AtelierHeroProps> = ({
  onStartCreating,
  totalCakes,
}) => {
  return (
    <section className="w-full bg-gradient-to-b from-[#FFF5F8] via-[#FFF9FB] to-[#FFF0F5] border-b-2 border-pink-200 overflow-hidden relative">
      {/* Floating cartoon background particles */}
      <div className="absolute top-4 left-6 text-2xl animate-float pointer-events-none select-none">🍓</div>
      <div className="absolute top-16 right-10 text-2xl animate-float-delayed pointer-events-none select-none">🧁</div>
      <div className="absolute bottom-6 left-1/4 text-2xl animate-wiggle pointer-events-none select-none">✨</div>
      <div className="absolute top-1/2 right-1/3 text-2xl animate-float pointer-events-none select-none">🎈</div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Text Block (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white rounded-full text-xs font-black text-[#FF477E] border-2 border-pink-200 shadow-2xs mb-3 animate-wiggle">
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-300" />
              <span>¡JUEGO DIVERTIDO DE PASTELERÍA!</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-gray-800 leading-tight max-w-2xl text-balance">
              ¡Crea y Decora tus Pasteles Mágicos! 🎂
            </h1>

            <p className="text-sm md:text-base text-gray-600 mt-3 mb-6 leading-relaxed max-w-xl font-bold">
              ¡Elige la forma (redondo, corazón, cuadrado o estrella), hornea el bizcocho, ponle relleno delicioso, baña con glaseado y llena de dulces y velitas! 🍓✨
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  sounds.playSparkle();
                  onStartCreating();
                }}
                className="px-6 py-3.5 bg-[#FF477E] hover:bg-[#FF2E6D] text-white text-xs md:text-sm font-black rounded-2xl transition-all shadow-md active:scale-95 flex items-center gap-2 animate-bounce hover:animate-none"
              >
                <span className="text-lg">🧁</span>
                <span>¡Empezar a Hornear Mi Pastel!</span>
              </button>

              <div className="text-xs text-pink-700 font-extrabold flex items-center gap-1.5 py-2.5 px-3.5 bg-white rounded-2xl border-2 border-pink-200 shadow-2xs">
                <Heart className="w-4 h-4 text-[#FF477E] fill-[#FF477E] animate-pulse" />
                <span>{totalCakes} {totalCakes === 1 ? 'pastel en tu cocina' : 'pasteles en tu cocina'}</span>
              </div>
            </div>

            {/* Quick mini-step highlights */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6 pt-5 border-t-2 border-pink-100 w-full max-w-lg">
              <div className="bg-white p-3 rounded-2xl border-2 border-pink-100 text-center shadow-2xs hover:scale-105 transition-transform">
                <span className="text-2xl block animate-bounce">🎨</span>
                <span className="text-xs font-black text-gray-800 block mt-1">4 Formas</span>
                <span className="text-[10px] text-pink-500 font-bold">¡Corazón, cubo & más!</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border-2 border-pink-100 text-center shadow-2xs hover:scale-105 transition-transform">
                <span className="text-2xl block animate-wiggle">🕯️</span>
                <span className="text-xs font-black text-gray-800 block mt-1">Velitas Vivas</span>
                <span className="text-[10px] text-amber-500 font-bold">¡Para encender y soplar!</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border-2 border-pink-100 text-center shadow-2xs hover:scale-105 transition-transform">
                <span className="text-2xl block animate-float">📄</span>
                <span className="text-xs font-black text-gray-800 block mt-1">Diploma PDF</span>
                <span className="text-[10px] text-emerald-500 font-bold">¡Tu certificado de chef!</span>
              </div>
            </div>
          </div>

          {/* Right Visual: 100% ANIMATED CARTOON VECTOR SCENE (NO REALISTIC PHOTOS) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-[#FFE3EC] via-[#FFF3F8] to-[#FFF9E6] p-4 flex items-center justify-center min-h-[300px]">
              {/* Cute Cartoon Vector Bakery Scene */}
              <svg viewBox="0 0 400 320" className="w-full h-auto drop-shadow-sm select-none" xmlns="http://www.w3.org/2000/svg">
                {/* Table Counter */}
                <rect x="30" y="220" width="340" height="70" rx="16" fill="#F4A261" stroke="#E76F51" strokeWidth="3" />
                <rect x="40" y="235" width="320" height="10" fill="#E76F51" rx="4" opacity="0.4" />

                {/* Cake on Table */}
                <g className="animate-float">
                  {/* Plate */}
                  <ellipse cx="250" cy="225" rx="75" ry="16" fill="#FFFFFF" stroke="#FFB4C8" strokeWidth="3" />
                  {/* Tier 1 bottom */}
                  <rect x="195" y="165" width="110" height="48" rx="12" fill="#FF8FAB" stroke="#FF477E" strokeWidth="3" />
                  {/* Tier 2 top */}
                  <rect x="215" y="125" width="70" height="44" rx="10" fill="#FFE5EC" stroke="#FF477E" strokeWidth="3" />
                  {/* Frosting drips */}
                  <path d="M 215,140 Q 225,152 235,140 Q 245,155 255,140 Q 265,152 275,140 Q 285,145 285,135" fill="none" stroke="#FF477E" strokeWidth="3" />
                  {/* Strawberries on top */}
                  <circle cx="235" cy="120" r="7" fill="#E63946" stroke="#C1121F" strokeWidth="1.5" />
                  <circle cx="265" cy="120" r="7" fill="#E63946" stroke="#C1121F" strokeWidth="1.5" />
                  {/* Candle in middle */}
                  <rect x="247" y="98" width="6" height="22" rx="2" fill="#FFD166" stroke="#F4A261" strokeWidth="1.2" />
                  {/* Animated Flame */}
                  <g className="animate-bounce">
                    <circle cx="250" cy="90" r="6" fill="#FFB703" />
                    <circle cx="250" cy="88" r="3" fill="#FFF" />
                  </g>
                  {/* Kawaii Face on cake */}
                  <circle cx="238" cy="190" r="3.5" fill="#2B1810" />
                  <circle cx="262" cy="190" r="3.5" fill="#2B1810" />
                  <ellipse cx="233" cy="193" rx="4" ry="2.5" fill="#FF477E" opacity="0.6" />
                  <ellipse cx="267" cy="193" rx="4" ry="2.5" fill="#FF477E" opacity="0.6" />
                  <path d="M 246,193 Q 250,198 254,193" fill="none" stroke="#2B1810" strokeWidth="2" strokeLinecap="round" />
                </g>

                {/* Animated Cute Chef Mascot */}
                <g className="animate-wiggle" transform="translate(45, 75)">
                  {/* Body & Apron */}
                  <rect x="42" y="105" width="56" height="58" rx="14" fill="#FF70A6" stroke="#FF477E" strokeWidth="3" />
                  <rect x="52" y="112" width="36" height="42" rx="8" fill="#FFFFFF" stroke="#FFB4C8" strokeWidth="2" />
                  {/* Hands */}
                  <circle cx="34" cy="125" r="9" fill="#FFD6BA" stroke="#E07A5F" strokeWidth="2" />
                  <circle cx="106" cy="120" r="9" fill="#FFD6BA" stroke="#E07A5F" strokeWidth="2" />
                  {/* Whisk in hand */}
                  <line x1="106" y1="120" x2="124" y2="95" stroke="#888" strokeWidth="3" strokeLinecap="round" />
                  <ellipse cx="128" cy="90" rx="8" ry="12" fill="none" stroke="#888" strokeWidth="2" transform="rotate(35 128 90)" />

                  {/* Cute Head */}
                  <circle cx="70" cy="72" r="32" fill="#FFE5D9" stroke="#E07A5F" strokeWidth="3" />
                  {/* Big Sparkling Eyes */}
                  <circle cx="58" cy="70" r="6" fill="#2B1810" />
                  <circle cx="56" cy="68" r="2.2" fill="#FFF" />
                  <circle cx="82" cy="70" r="6" fill="#2B1810" />
                  <circle cx="80" cy="68" r="2.2" fill="#FFF" />
                  {/* Rosy Cheeks */}
                  <ellipse cx="50" cy="77" rx="6" ry="3.5" fill="#FF8FAB" />
                  <ellipse cx="90" cy="77" rx="6" ry="3.5" fill="#FF8FAB" />
                  {/* Happy Open Mouth */}
                  <path d="M 64,78 Q 70,88 76,78 Z" fill="#E63946" stroke="#2B1810" strokeWidth="1.5" />

                  {/* Puffy Chef Hat */}
                  <path
                    d={`M 46,45
                       C 32,30 40,5 60,18
                       C 68,0 85,2 90,16
                       C 106,8 114,30 94,45 Z`}
                    fill="#FFFFFF"
                    stroke="#FF70A6"
                    strokeWidth="3"
                  />
                  <rect x="48" y="42" width="44" height="10" rx="3" fill="#FFFFFF" stroke="#FF70A6" strokeWidth="2.5" />
                  {/* Strawberry on hat */}
                  <circle cx="70" cy="18" r="5" fill="#E63946" />
                </g>

                {/* Floating Stars & Hearts */}
                <g className="animate-pulse">
                  <polygon points="175,70 178,78 186,79 180,85 182,93 175,89 168,93 170,85 164,79 172,78" fill="#FFD166" />
                  <polygon points="340,90 342,96 348,97 343,101 345,107 340,104 335,107 337,101 332,97 338,96" fill="#FFD166" />
                  <path d="M 330,150 C 330,145 322,142 322,148 C 322,154 330,158 330,158 C 330,158 338,154 338,148 C 338,142 330,145 330,150 Z" fill="#FF477E" />
                </g>
              </svg>

              {/* Cheerful Overlay Badge */}
              <div className="absolute bottom-3 left-4 right-4 bg-white/90 backdrop-blur-xs py-1.5 px-3 rounded-2xl border-2 border-pink-200 text-center shadow-xs">
                <span className="text-xs font-black text-pink-600">
                  ¡PastelChef: 100% Animado & Hecho para Ti! ✨
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
