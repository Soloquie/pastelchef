import React, { useState, useRef } from 'react';
import { CustomCake } from '../types/cake';
import { CakeVisualizer } from './CakeVisualizer';
import {
  CAKE_SHAPES,
  CAKE_SPONGES,
  CAKE_FROSTINGS,
} from '../data/cakeOptions';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit3,
  Copy,
  Trash2,
  FileDown,
  Sparkles,
  Search,
  CheckCircle2,
  PartyPopper,
} from 'lucide-react';
import { sounds } from '../utils/audioEffects';

interface CakeCarouselProps {
  cakes: CustomCake[];
  selectedCakeId: string;
  onSelectCake: (cakeId: string) => void;
  onEditCake: (cakeId: string) => void;
  onCreateNewCake: () => void;
  onDuplicateCake: (cake: CustomCake) => void;
  onDeleteCake: (cakeId: string) => void;
  onRenameCake: (cakeId: string, newName: string) => void;
  onExportPDF: (cake: CustomCake) => void;
}

export const CakeCarousel: React.FC<CakeCarouselProps> = ({
  cakes,
  selectedCakeId,
  onSelectCake,
  onEditCake,
  onCreateNewCake,
  onDuplicateCake,
  onDeleteCake,
  onRenameCake,
  onExportPDF,
}) => {
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [nameInputValue, setNameInputValue] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const carouselContainerRef = useRef<HTMLDivElement>(null);

  const filteredCakes = cakes.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scroll = (direction: 'left' | 'right') => {
    sounds.playPop();
    if (carouselContainerRef.current) {
      const scrollAmount = direction === 'left' ? -310 : 310;
      carouselContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const startRenaming = (cake: CustomCake, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playPop();
    setEditingNameId(cake.id);
    setNameInputValue(cake.name);
  };

  const submitRenaming = (cakeId: string) => {
    if (nameInputValue.trim().length > 0) {
      sounds.playSparkle();
      onRenameCake(cakeId, nameInputValue.trim());
    }
    setEditingNameId(null);
  };

  return (
    <div className="w-full bg-[#FFF9FB] border-b border-[#FFE0EB] py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Header of Carousel Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-extrabold text-[#FF477E]">
                🎈 Colección de Creaciones
              </span>
              <span className="text-xs text-pink-300">·</span>
              <span className="text-xs font-semibold text-gray-500">
                {cakes.length} {cakes.length === 1 ? 'pastel creado' : 'pasteles creados'}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-[#4A1525] mt-0.5 font-display flex items-center gap-2">
              <span>Tus Pasteles Mágicos</span>
              <span className="text-lg">🎂</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {/* Search filter */}
            <div className="relative flex-1 sm:w-48 min-w-[160px]">
              <Search className="w-4 h-4 text-pink-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar pastel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800 placeholder-pink-300 shadow-2xs font-medium"
              />
            </div>

            {/* Carousel navigation arrows */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="p-2 rounded-xl bg-white border border-pink-200 text-pink-600 hover:bg-pink-50 active:scale-95 transition-all shadow-2xs"
                title="Ver anteriores"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="p-2 rounded-xl bg-white border border-pink-200 text-pink-600 hover:bg-pink-50 active:scale-95 transition-all shadow-2xs"
                title="Ver siguientes"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Create new cake button */}
            <button
              type="button"
              onClick={() => {
                sounds.playSparkle();
                onCreateNewCake();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF477E] hover:bg-[#FF2E6D] text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Nuevo Pastel</span>
            </button>
          </div>
        </div>

        {/* Carousel Horizontal Scroll Strip */}
        <div
          ref={carouselContainerRef}
          className="flex items-stretch gap-4 md:gap-5 overflow-x-auto pb-4 pt-1 px-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {filteredCakes.map((cake) => {
            const isSelected = cake.id === selectedCakeId;
            const shape = CAKE_SHAPES.find((s) => s.id === cake.shapeId) || CAKE_SHAPES[0];
            const sponge = CAKE_SPONGES.find((s) => s.id === cake.spongeId) || CAKE_SPONGES[0];
            const frosting = CAKE_FROSTINGS.find((f) => f.id === cake.frostingId) || CAKE_FROSTINGS[0];
            const isCompleted = cake.currentStep >= 6;

            return (
              <div
                key={cake.id}
                onClick={() => {
                  sounds.playPop();
                  onSelectCake(cake.id);
                }}
                className={`snap-center flex-shrink-0 w-[270px] sm:w-[290px] md:w-[310px] bg-white rounded-3xl border-2 transition-all cursor-pointer flex flex-col relative group overflow-hidden ${
                  isSelected
                    ? 'border-[#FF477E] shadow-md ring-4 ring-[#FF477E]/15 scale-[1.01]'
                    : 'border-pink-100 hover:border-pink-300 hover:shadow-xs'
                }`}
              >
                {/* Status Bar */}
                <div className="px-4 py-2.5 flex items-center justify-between border-b border-pink-50 bg-[#FFFDFE]">
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>¡Listo! 🎉</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Paso {cake.currentStep} de 5</span>
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-semibold text-gray-400">
                    {shape.emoji} {shape.name}
                  </span>
                </div>

                {/* Cake Live Mini SVG Preview */}
                <div className="h-44 bg-gradient-to-b from-[#FFF5F8] to-[#FFEEF3] flex items-center justify-center p-3 relative overflow-hidden">
                  <CakeVisualizer
                    cake={cake}
                    interactive={false}
                    size="sm"
                    forceSliceView={false}
                  />

                  {/* Step progress pills on bottom */}
                  <div className="absolute bottom-2.5 left-4 right-4 flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((st) => (
                      <div
                        key={st}
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          cake.currentStep >= st
                            ? 'bg-[#FF477E]'
                            : 'bg-pink-200/70'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Card Body & Name */}
                <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    {editingNameId === cake.id ? (
                      <div
                        className="flex items-center gap-1 mb-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          value={nameInputValue}
                          onChange={(e) => setNameInputValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') submitRenaming(cake.id);
                            if (e.key === 'Escape') setEditingNameId(null);
                          }}
                          autoFocus
                          className="flex-1 px-2.5 py-1 text-xs font-bold text-gray-800 bg-pink-50 border border-pink-400 rounded-xl focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => submitRenaming(cake.id)}
                          className="px-2.5 py-1 bg-pink-500 text-white rounded-xl text-xs font-bold"
                        >
                          OK
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <h3 className="font-extrabold text-sm text-gray-800 truncate group-hover:text-pink-600 transition-colors" title={cake.name}>
                          {cake.name}
                        </h3>
                        <button
                          type="button"
                          onClick={(e) => startRenaming(cake, e)}
                          className="text-pink-400 hover:text-pink-700 p-1 rounded-lg transition-colors shrink-0"
                          title="Cambiar nombre"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Friendly ingredients tags */}
                    <div className="flex flex-wrap items-center gap-1 text-[11px] font-semibold text-gray-500 mb-3">
                      <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg border border-amber-100">
                        {sponge.emoji} {sponge.name.split(' ')[0]}
                      </span>
                      <span className="bg-pink-50 text-pink-700 px-2 py-0.5 rounded-lg border border-pink-100">
                        {frosting.emoji} {frosting.name.split(' ')[0]}
                      </span>
                      {cake.toppingIds.length > 0 && (
                        <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-lg border border-purple-100">
                          +{cake.toppingIds.length} dulces
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-pink-100 flex items-center justify-between gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        sounds.playPop();
                        onEditCake(cake.id);
                      }}
                      className="flex-1 py-2 px-3 bg-[#FFF0F5] hover:bg-[#FF477E] text-[#FF477E] hover:text-white text-xs font-bold rounded-xl transition-all text-center flex items-center justify-center gap-1.5 active:scale-95 shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isCompleted ? 'Ver & Editar' : '¡Seguir Creando!'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        sounds.playSparkle();
                        onExportPDF(cake);
                      }}
                      className="p-2 text-pink-500 hover:text-pink-700 hover:bg-pink-50 rounded-xl transition-colors active:scale-95"
                      title="Descargar Diploma en PDF"
                    >
                      <FileDown className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        sounds.playPop();
                        onDuplicateCake(cake);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors active:scale-95"
                      title="Hacer una copia"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {cakes.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          sounds.playPop();
                          if (window.confirm(`¿Quieres borrar "${cake.name}"?`)) {
                            onDeleteCake(cake.id);
                          }
                        }}
                        className="p-2 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors active:scale-95"
                        title="Borrar pastel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* "+ Crear Pastel" final card */}
          <div
            onClick={() => {
              sounds.playSparkle();
              onCreateNewCake();
            }}
            className="snap-center flex-shrink-0 w-[240px] border-3 border-dashed border-pink-200 hover:border-[#FF477E] rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-white/70 hover:bg-white transition-all group active:scale-95"
          >
            <div className="w-14 h-14 rounded-full bg-pink-100 group-hover:bg-[#FF477E] text-[#FF477E] group-hover:text-white flex items-center justify-center transition-all shadow-2xs mb-3 group-hover:rotate-12">
              <Plus className="w-7 h-7 stroke-[3]" />
            </div>
            <h4 className="font-black text-sm text-gray-800 group-hover:text-[#FF477E] transition-colors">
              ¡Crear Otro Pastel! 🎂
            </h4>
            <p className="text-xs text-gray-500 mt-1 font-medium max-w-[170px]">
              Elige otra forma y crea un nuevo diseño delicioso.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
