import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CustomCake,
  BuilderStep,
  ShapeId,
  SpongeId,
  FillingId,
  FrostingId,
  ToppingId,
} from '../types/cake';
import {
  CAKE_STEPS,
  CAKE_SHAPES,
  CAKE_SPONGES,
  CAKE_FILLINGS,
  CAKE_FROSTINGS,
  CAKE_TOPPINGS,
} from '../data/cakeOptions';
import { CakeVisualizer } from './CakeVisualizer';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileDown,
  Sparkles,
  Flame,
  Layers,
  Edit2,
  PartyPopper,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { sounds } from '../utils/audioEffects';

interface CakeBuilderProps {
  cake: CustomCake;
  onUpdateCake: (updatedCake: CustomCake) => void;
  onExportPDF: (cake: CustomCake) => void;
  onBackToGallery?: () => void;
}

export const CakeBuilder: React.FC<CakeBuilderProps> = ({
  cake,
  onUpdateCake,
  onExportPDF,
  onBackToGallery,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [tempTitle, setTempTitle] = useState<string>(cake.name);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [soundMuted, setSoundMuted] = useState<boolean>(!sounds.enabled);

  const currentStep = (cake.currentStep || 1) as BuilderStep;
  const currentStepMeta = CAKE_STEPS.find((s) => s.step === currentStep) || CAKE_STEPS[0];

  const triggerConfetti = () => {
    sounds.playCelebration();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FF477E', '#FFB703', '#06D6A0', '#118AB2', '#9B5DE5', '#FFF3B0'],
    });
  };

  const handleToggleSound = () => {
    sounds.enabled = !sounds.enabled;
    setSoundMuted(!sounds.enabled);
    if (sounds.enabled) {
      sounds.playPop();
    }
  };

  const handleStepChange = (targetStep: BuilderStep) => {
    sounds.playSparkle();
    onUpdateCake({
      ...cake,
      currentStep: targetStep,
      updatedAt: new Date().toISOString(),
    });
    if (targetStep === 6) {
      triggerConfetti();
    }
  };

  const handleNextStep = () => {
    if (currentStep < 6) {
      handleStepChange((currentStep + 1) as BuilderStep);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      sounds.playPop();
      handleStepChange((currentStep - 1) as BuilderStep);
    }
  };

  const handleSelectShape = (shapeId: ShapeId) => {
    sounds.playPop();
    onUpdateCake({
      ...cake,
      shapeId,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSelectSponge = (spongeId: SpongeId) => {
    sounds.playPop();
    onUpdateCake({
      ...cake,
      spongeId,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSelectFilling = (fillingId: FillingId) => {
    sounds.playPop();
    onUpdateCake({
      ...cake,
      fillingId,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSelectFrosting = (frostingId: FrostingId) => {
    sounds.playPop();
    onUpdateCake({
      ...cake,
      frostingId,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleToggleTopping = (toppingId: ToppingId) => {
    sounds.playPop();
    const exists = cake.toppingIds.includes(toppingId);
    let newToppings: ToppingId[];
    if (exists) {
      newToppings = cake.toppingIds.filter((id) => id !== toppingId);
    } else {
      newToppings = [...cake.toppingIds, toppingId];
    }

    onUpdateCake({
      ...cake,
      toppingIds: newToppings,
      candlesLit: toppingId === 'candles' && !exists ? true : cake.candlesLit,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleToggleCandles = () => {
    sounds.playCandle();
    onUpdateCake({
      ...cake,
      candlesLit: !cake.candlesLit,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleUpdateMessage = (customMessage: string) => {
    onUpdateCake({
      ...cake,
      customMessage,
      updatedAt: new Date().toISOString(),
    });
  };

  const saveTitle = () => {
    if (tempTitle.trim().length > 0) {
      sounds.playSparkle();
      onUpdateCake({
        ...cake,
        name: tempTitle.trim(),
        updatedAt: new Date().toISOString(),
      });
    }
    setIsEditingTitle(false);
  };

  const handlePDFExportClick = async () => {
    sounds.playSparkle();
    setIsExporting(true);
    try {
      await onExportPDF(cake);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full flex flex-col pb-24 md:pb-8">
      {/* 1. TOP BUILDER TOOLBAR */}
      <div className="bg-white border-b border-pink-100 px-4 md:px-8 py-3 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Cake Title & Inline Rename */}
          <div className="flex items-center gap-2.5">
            {onBackToGallery && (
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  onBackToGallery();
                }}
                className="p-2 rounded-xl border border-pink-200 text-pink-600 hover:bg-pink-50 transition-colors"
                title="Ver carrusel"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            {isEditingTitle ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveTitle();
                    if (e.key === 'Escape') setIsEditingTitle(false);
                  }}
                  autoFocus
                  className="px-3 py-1 text-base md:text-lg font-black text-gray-800 border-2 border-pink-400 rounded-xl focus:outline-none bg-pink-50/50"
                />
                <button
                  type="button"
                  onClick={saveTitle}
                  className="px-3 py-1 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-xl"
                >
                  Listo
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <h1 className="text-lg md:text-xl font-black text-gray-800 font-display flex items-center gap-2">
                  <span>{cake.name}</span>
                </h1>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setTempTitle(cake.name);
                    setIsEditingTitle(true);
                  }}
                  className="p-1.5 text-pink-400 hover:text-pink-600 rounded-lg hover:bg-pink-50 transition-colors"
                  title="Cambiar el nombre del pastel"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Controls: Sound toggle & PDF Certificate button */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {/* Sound toggle button */}
            <button
              type="button"
              onClick={handleToggleSound}
              className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1 font-bold ${
                soundMuted
                  ? 'border-gray-200 text-gray-400 bg-gray-50'
                  : 'border-pink-200 text-pink-600 bg-pink-50 hover:bg-pink-100'
              }`}
              title={soundMuted ? 'Activar sonidos divertidos' : 'Silenciar sonidos'}
            >
              {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{soundMuted ? 'Sin Sonido' : 'Sonido'}</span>
            </button>

            <button
              type="button"
              onClick={handlePDFExportClick}
              disabled={isExporting}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#FFF0F5] hover:bg-[#FFE3EE] text-[#FF477E] border border-pink-200 rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-95"
              title="Descargar Diploma en PDF"
            >
              <FileDown className="w-4 h-4" />
              <span>{isExporting ? 'Descargando...' : 'Descargar Diploma 📄'}</span>
            </button>
          </div>
        </div>

        {/* Stepper with Game Levels */}
        <div className="max-w-7xl mx-auto mt-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between min-w-[580px] border-t border-pink-100 pt-2.5">
            {CAKE_STEPS.map((st) => {
              const isActive = st.step === currentStep;
              const isPast = st.step < currentStep;

              return (
                <button
                  key={st.step}
                  type="button"
                  onClick={() => handleStepChange(st.step)}
                  className={`flex items-center gap-1.5 py-1 px-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                    isActive
                      ? 'bg-[#FF477E] text-white shadow-xs'
                      : isPast
                      ? 'text-gray-700 hover:bg-pink-50'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <span className="text-sm">{st.emoji}</span>
                  <span className="whitespace-nowrap">{st.shortTitle}</span>
                  {isPast && <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE (RESPONSIVE GRID) */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* LEFT COLUMN: LIVE CAKE VISUALIZER (5 COLS) */}
          <div className="lg:col-span-5 bg-white border-2 border-pink-100 rounded-3xl p-5 shadow-sm flex flex-col items-center lg:sticky lg:top-28">
            <div className="w-full flex items-center justify-between border-b border-pink-50 pb-2.5 mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#FF477E] flex items-center gap-1.5">
                <span>{currentStepMeta.emoji}</span>
                <span>{currentStep === 6 ? '¡Pastel Terminado!' : currentStepMeta.title}</span>
              </span>
              <span className="text-xs font-bold text-gray-400 bg-pink-50 px-2.5 py-0.5 rounded-full">
                Vista en Vivo
              </span>
            </div>

            {/* Cake SVG Graphic */}
            <div id="cake-workshop-canvas" className="w-full py-2 flex items-center justify-center">
              <CakeVisualizer
                cake={cake}
                currentStep={currentStep}
                interactive={true}
                onToggleCandles={handleToggleCandles}
                size="lg"
              />
            </div>

            {/* Quick summary strip under cake canvas */}
            <div className="w-full mt-3 pt-3 border-t border-pink-50 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#FFF9FB] p-2.5 rounded-2xl border border-pink-100 text-center">
                <span className="text-pink-400 block text-[10px] font-bold uppercase">Forma</span>
                <span className="font-extrabold text-gray-800">
                  {CAKE_SHAPES.find((s) => s.id === cake.shapeId)?.emoji}{' '}
                  {CAKE_SHAPES.find((s) => s.id === cake.shapeId)?.name}
                </span>
              </div>
              <div className="bg-[#FFF9FB] p-2.5 rounded-2xl border border-pink-100 text-center">
                <span className="text-pink-400 block text-[10px] font-bold uppercase">Bizcocho</span>
                <span className="font-extrabold text-gray-800">
                  {CAKE_SPONGES.find((s) => s.id === cake.spongeId)?.emoji}{' '}
                  {CAKE_SPONGES.find((s) => s.id === cake.spongeId)?.name.split(' ')[0]}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STEP OPTIONS (7 COLS) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {/* Step Header Card */}
            <div className="bg-gradient-to-r from-[#FFF5F8] to-[#FFFBF0] border-2 border-pink-100 rounded-3xl p-5 shadow-2xs">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black uppercase tracking-wider text-[#FF477E] bg-white px-2.5 py-0.5 rounded-full shadow-2xs">
                  {currentStepMeta.emoji} Paso {currentStep} de 5
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-gray-800 mt-1">
                {currentStepMeta.title}
              </h2>
              <p className="text-xs md:text-sm text-gray-600 mt-1 font-medium">
                {currentStepMeta.description}
              </p>
            </div>

            {/* STEP 1: FORMAS DEL PASTEL */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {CAKE_SHAPES.map((option) => {
                  const isSelected = cake.shapeId === option.id;
                  return (
                    <div
                      key={option.id}
                      onClick={() => handleSelectShape(option.id)}
                      className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between active:scale-[0.98] ${
                        isSelected
                          ? 'bg-[#FFF5F8] border-[#FF477E] shadow-sm ring-2 ring-pink-200'
                          : 'bg-white border-pink-100 hover:border-pink-300 hover:bg-[#FFFAFC]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{option.emoji}</span>
                          <span className="text-[11px] font-bold text-[#FF477E] bg-pink-50 px-2 py-0.5 rounded-full">
                            {option.badge}
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-gray-800 mb-1">
                          {option.name}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2 font-medium">
                          {option.subtitle}
                        </p>
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                          {option.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-pink-50 flex items-center justify-between">
                        <span className="text-xs font-bold text-pink-600">
                          {isSelected ? '¡Elegido! ✨' : 'Tocar para elegir'}
                        </span>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                            isSelected
                              ? 'bg-[#FF477E] border-[#FF477E] text-white'
                              : 'border-pink-200 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* STEP 2: SABOR DEL BIZCOCHO */}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {CAKE_SPONGES.map((option) => {
                  const isSelected = cake.spongeId === option.id;
                  return (
                    <div
                      key={option.id}
                      onClick={() => handleSelectSponge(option.id)}
                      className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between active:scale-[0.98] ${
                        isSelected
                          ? 'bg-[#FFF5F8] border-[#FF477E] shadow-sm ring-2 ring-pink-200'
                          : 'bg-white border-pink-100 hover:border-pink-300 hover:bg-[#FFFAFC]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{option.emoji}</span>
                            <span
                              className="w-4 h-4 rounded-full border border-black/10 inline-block shadow-2xs"
                              style={{ backgroundColor: option.color }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                            Bizcocho
                          </span>
                        </div>

                        <h3 className="text-base font-extrabold text-gray-800 mb-1">
                          {option.name}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2 font-medium">
                          {option.description}
                        </p>

                        <div className="bg-amber-50/70 p-2 rounded-2xl text-[11px] text-amber-900 font-semibold mb-2">
                          ✨ {option.flavorVibe}
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-pink-50 flex items-center justify-between">
                        <span className="text-xs font-bold text-pink-600">
                          {isSelected ? '¡Masa seleccionada! 🍪' : 'Elegir sabor'}
                        </span>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                            isSelected
                              ? 'bg-[#FF477E] border-[#FF477E] text-white'
                              : 'border-pink-200 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* STEP 3: RELLENO ENTRE CAPAS */}
            {currentStep === 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {CAKE_FILLINGS.map((option) => {
                  const isSelected = cake.fillingId === option.id;
                  return (
                    <div
                      key={option.id}
                      onClick={() => handleSelectFilling(option.id)}
                      className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between active:scale-[0.98] ${
                        isSelected
                          ? 'bg-[#FFF5F8] border-[#FF477E] shadow-sm ring-2 ring-pink-200'
                          : 'bg-white border-pink-100 hover:border-pink-300 hover:bg-[#FFFAFC]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{option.emoji}</span>
                            <span
                              className="w-4 h-4 rounded-full border border-black/10 inline-block shadow-2xs"
                              style={{ backgroundColor: option.color }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">
                            Relleno
                          </span>
                        </div>

                        <h3 className="text-base font-extrabold text-gray-800 mb-1">
                          {option.name}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2 font-medium">
                          {option.subtitle}
                        </p>
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                          {option.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-pink-50 flex items-center justify-between">
                        <span className="text-xs font-bold text-pink-600">
                          {isSelected ? '¡Relleno untado! 🍓' : 'Untar relleno'}
                        </span>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                            isSelected
                              ? 'bg-[#FF477E] border-[#FF477E] text-white'
                              : 'border-pink-200 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* STEP 4: GLASEADO Y COBERTURA */}
            {currentStep === 4 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {CAKE_FROSTINGS.map((option) => {
                  const isSelected = cake.frostingId === option.id;
                  return (
                    <div
                      key={option.id}
                      onClick={() => handleSelectFrosting(option.id)}
                      className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between active:scale-[0.98] ${
                        isSelected
                          ? 'bg-[#FFF5F8] border-[#FF477E] shadow-sm ring-2 ring-pink-200'
                          : 'bg-white border-pink-100 hover:border-pink-300 hover:bg-[#FFFAFC]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{option.emoji}</span>
                            <span
                              className="w-4 h-4 rounded-full border border-black/15 inline-block shadow-2xs"
                              style={{ backgroundColor: option.color }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                            {option.finish}
                          </span>
                        </div>

                        <h3 className="text-base font-extrabold text-gray-800 mb-1">
                          {option.name}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2 font-medium">
                          {option.subtitle}
                        </p>
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                          {option.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-pink-50 flex items-center justify-between">
                        <span className="text-xs font-bold text-pink-600">
                          {isSelected ? '¡Pastel glaseado! 🍦' : 'Poner glaseado'}
                        </span>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                            isSelected
                              ? 'bg-[#FF477E] border-[#FF477E] text-white'
                              : 'border-pink-200 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* STEP 5: DECORACIONES, TOPPINGS & MENSAJE */}
            {currentStep === 5 && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {CAKE_TOPPINGS.map((option) => {
                    const isSelected = cake.toppingIds.includes(option.id);
                    return (
                      <div
                        key={option.id}
                        onClick={() => handleToggleTopping(option.id)}
                        className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between active:scale-[0.98] ${
                          isSelected
                            ? 'bg-[#FFF5F8] border-[#FF477E] shadow-sm ring-2 ring-pink-200'
                            : 'bg-white border-pink-100 hover:border-pink-300 hover:bg-[#FFFAFC]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{option.emoji}</span>
                            <span className="text-[11px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">
                              {option.categoryName}
                            </span>
                          </div>

                          <h3 className="text-base font-extrabold text-gray-800 mb-1">
                            {option.name}
                          </h3>
                          <p className="text-xs text-gray-600 mb-1 font-medium">
                            {option.subtitle}
                          </p>
                          <p className="text-[11px] text-gray-500 leading-relaxed">
                            {option.description}
                          </p>
                        </div>

                        <div className="mt-3 pt-3 border-t border-pink-50 flex items-center justify-between">
                          <span className="text-xs font-bold text-pink-600">
                            {isSelected ? '✓ ¡Añadido al pastel!' : '+ Tocar para agregar'}
                          </span>
                          <div
                            className={`w-6 h-6 rounded-xl flex items-center justify-center border-2 ${
                              isSelected
                                ? 'bg-[#FF477E] border-[#FF477E] text-white'
                                : 'border-pink-200 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Mensaje dulce en el pastel */}
                <div className="bg-white border-2 border-pink-100 rounded-3xl p-5 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="custom-message-input"
                      className="text-xs font-extrabold uppercase tracking-wider text-gray-800 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4 text-[#FF477E]" />
                      <span>Escribe un mensaje dulce en el pastel 💌</span>
                    </label>
                    <span className="text-[11px] text-pink-400 font-bold">¡Opcional!</span>
                  </div>

                  <input
                    id="custom-message-input"
                    type="text"
                    maxLength={32}
                    value={cake.customMessage}
                    onChange={(e) => handleUpdateMessage(e.target.value)}
                    placeholder="Ejemplo: ¡Feliz Cumple Sofía!, ¡Te Quiero Mucho!..."
                    className="w-full px-4 py-2.5 bg-pink-50/50 border-2 border-pink-200 rounded-2xl text-base font-script font-bold text-gray-800 focus:outline-none focus:border-[#FF477E] placeholder:font-sans placeholder:text-xs placeholder:text-gray-400"
                  />
                  <p className="text-[11px] text-gray-500 mt-2 font-medium">
                    Aparecerá escrito en una placa dulce en la parte frontal de tu pastel.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 6: CELEBRACIÓN Y PASTEL LISTO */}
            {currentStep === 6 && (
              <div className="flex flex-col gap-4">
                <div className="bg-gradient-to-br from-[#FFE5EC] via-[#FFF0F5] to-[#FFF8E7] border-2 border-pink-200 rounded-3xl p-6 shadow-sm text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-xs font-black text-pink-600 shadow-2xs mb-2">
                    <PartyPopper className="w-4 h-4 text-[#FF477E]" />
                    <span>¡OBRA MAESTRA DULCE TERMINADA!</span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black text-gray-800 font-display mb-2">
                    {cake.name} 🎂
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 max-w-lg mx-auto font-medium mb-5">
                    ¡Completaste todos los pasos del pastel! Puedes ver cómo quedó por dentro, encender las velitas o descargar tu diploma oficial de chef pastelero.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={triggerConfetti}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#FF477E] hover:bg-[#FF2E6D] text-white text-xs font-extrabold rounded-2xl transition-all shadow-md active:scale-95"
                    >
                      <PartyPopper className="w-4 h-4" />
                      <span>¡Lanzar Confeti de Fiesta! 🎉</span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePDFExportClick}
                      disabled={isExporting}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white text-pink-700 hover:bg-pink-50 border-2 border-pink-200 text-xs font-extrabold rounded-2xl transition-all shadow-xs active:scale-95"
                    >
                      <FileDown className="w-4 h-4 text-[#FF477E]" />
                      <span>{isExporting ? 'Descargando...' : 'Descargar Diploma PDF 📄'}</span>
                    </button>
                  </div>
                </div>

                {/* Friendly recipe summary card */}
                <div className="bg-white border-2 border-pink-100 rounded-3xl p-5 shadow-2xs">
                  <h4 className="text-xs font-black uppercase tracking-wider text-pink-600 mb-3 flex items-center gap-1.5">
                    <span>🍰</span>
                    <span>Resumen de tu Pastel Mágico</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="p-2.5 bg-pink-50/50 rounded-2xl border border-pink-100 flex items-center justify-between">
                      <span className="text-gray-500 font-medium">1. Forma:</span>
                      <span className="font-extrabold text-gray-800">
                        {CAKE_SHAPES.find((s) => s.id === cake.shapeId)?.emoji}{' '}
                        {CAKE_SHAPES.find((s) => s.id === cake.shapeId)?.name}
                      </span>
                    </div>

                    <div className="p-2.5 bg-amber-50/50 rounded-2xl border border-amber-100 flex items-center justify-between">
                      <span className="text-gray-500 font-medium">2. Bizcocho:</span>
                      <span className="font-extrabold text-gray-800">
                        {CAKE_SPONGES.find((s) => s.id === cake.spongeId)?.emoji}{' '}
                        {CAKE_SPONGES.find((s) => s.id === cake.spongeId)?.name}
                      </span>
                    </div>

                    <div className="p-2.5 bg-rose-50/50 rounded-2xl border border-rose-100 flex items-center justify-between">
                      <span className="text-gray-500 font-medium">3. Relleno:</span>
                      <span className="font-extrabold text-gray-800">
                        {CAKE_FILLINGS.find((f) => f.id === cake.fillingId)?.emoji}{' '}
                        {CAKE_FILLINGS.find((f) => f.id === cake.fillingId)?.name}
                      </span>
                    </div>

                    <div className="p-2.5 bg-purple-50/50 rounded-2xl border border-purple-100 flex items-center justify-between">
                      <span className="text-gray-500 font-medium">4. Glaseado:</span>
                      <span className="font-extrabold text-gray-800">
                        {CAKE_FROSTINGS.find((fr) => fr.id === cake.frostingId)?.emoji}{' '}
                        {CAKE_FROSTINGS.find((fr) => fr.id === cake.frostingId)?.name}
                      </span>
                    </div>
                  </div>

                  {cake.customMessage && (
                    <div className="mt-3 p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
                      <span className="text-xs text-amber-800 font-bold">Mensaje escrito:</span>
                      <span className="font-script text-base text-pink-700 font-bold">
                        "{cake.customMessage}"
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* DESKTOP STEPPER FOOTER BUTTONS */}
            <div className="bg-white border-2 border-pink-100 rounded-3xl p-4 shadow-2xs hidden md:flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold border-2 transition-all active:scale-95 ${
                  currentStep === 1
                    ? 'opacity-30 cursor-not-allowed border-transparent text-gray-400'
                    : 'border-pink-200 text-pink-700 hover:bg-pink-50'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Paso Anterior</span>
              </button>

              <span className="text-xs font-bold text-gray-500">
                Paso <strong>{currentStep}</strong> de <strong>6</strong>
              </span>

              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#FF477E] hover:bg-[#FF2E6D] text-white rounded-2xl text-xs font-black transition-all shadow-sm active:scale-95"
                >
                  <span>Siguiente Paso</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePDFExportClick}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#06D6A0] hover:bg-[#05BA8B] text-white rounded-2xl text-xs font-black transition-all shadow-sm active:scale-95"
                >
                  <FileDown className="w-4 h-4" />
                  <span>{isExporting ? 'Descargando...' : 'Descargar Diploma 📄'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. MOBILE STICKY BOTTOM ACTION BAR (RESPONSIVE FLUID BAR) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-pink-200 p-3 px-4 shadow-lg flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handlePrevStep}
          disabled={currentStep === 1}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold border-2 transition-all ${
            currentStep === 1
              ? 'opacity-30 border-transparent text-gray-400'
              : 'border-pink-200 text-pink-700 bg-pink-50'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Atrás</span>
        </button>

        <span className="text-xs font-black text-pink-600">
          {currentStep} / 6
        </span>

        {currentStep < 6 ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="flex-1 max-w-[170px] flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#FF477E] active:bg-[#FF2E6D] text-white rounded-2xl text-xs font-black shadow-xs"
          >
            <span>Siguiente</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePDFExportClick}
            disabled={isExporting}
            className="flex-1 max-w-[170px] flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#06D6A0] active:bg-[#05BA8B] text-white rounded-2xl text-xs font-black shadow-xs"
          >
            <FileDown className="w-4 h-4" />
            <span>{isExporting ? '...' : 'Diploma'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
