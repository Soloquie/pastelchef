import React, { useState } from 'react';
import {
  CustomCake,
  CakeShapeOption,
  CakeSpongeOption,
  CakeFillingOption,
  CakeFrostingOption,
} from '../types/cake';
import {
  CAKE_SHAPES,
  CAKE_SPONGES,
  CAKE_FILLINGS,
  CAKE_FROSTINGS,
} from '../data/cakeOptions';
import { Eye, Layers, Flame, Sparkles, Smile } from 'lucide-react';
import { sounds } from '../utils/audioEffects';

interface CakeVisualizerProps {
  cake: CustomCake;
  currentStep?: number;
  interactive?: boolean;
  onToggleCandles?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'mini';
  forceSliceView?: boolean;
}

export const CakeVisualizer: React.FC<CakeVisualizerProps> = ({
  cake,
  currentStep = cake.currentStep,
  interactive = true,
  onToggleCandles,
  size = 'lg',
  forceSliceView,
}) => {
  const [sliceView, setSliceView] = useState<boolean>(forceSliceView ?? false);
  const [pedestalColor, setPedestalColor] = useState<'pink' | 'mint' | 'yellow'>('pink');
  const [showFace, setShowFace] = useState<boolean>(true);

  const shape: CakeShapeOption = CAKE_SHAPES.find((s) => s.id === cake.shapeId) || CAKE_SHAPES[0];
  const sponge: CakeSpongeOption = CAKE_SPONGES.find((s) => s.id === cake.spongeId) || CAKE_SPONGES[0];
  const filling: CakeFillingOption = CAKE_FILLINGS.find((f) => f.id === cake.fillingId) || CAKE_FILLINGS[0];
  const frosting: CakeFrostingOption = CAKE_FROSTINGS.find((f) => f.id === cake.frostingId) || CAKE_FROSTINGS[0];

  const hasCandles = cake.toppingIds.includes('candles');
  const hasBerries = cake.toppingIds.includes('fresh_berries');
  const hasGold = cake.toppingIds.includes('gold_pearls');
  const hasFlowers = cake.toppingIds.includes('edible_flowers');
  const hasMacarons = cake.toppingIds.includes('macarons');
  const hasShavings = cake.toppingIds.includes('chocolate_shavings');

  const showShape = currentStep >= 1;
  const showSponge = currentStep >= 2;
  const showFilling = currentStep >= 3;
  const showFrosting = currentStep >= 4;
  const showToppings = currentStep >= 5;

  const isMini = size === 'mini';
  const isSm = size === 'sm';
  const viewBoxWidth = 500;
  const viewBoxHeight = 440;

  const centerX = 250;
  const baseY = 320;
  const cakeH = 140;

  // Colorful party pedestals
  const pedestalFills = {
    pink: { top: '#FFEBF1', rim: '#FFB8CE', base: '#FF8FAB', highlight: '#FFF5F8' },
    mint: { top: '#E6FAF5', rim: '#A8EEDF', base: '#6BD4BE', highlight: '#F4FCFA' },
    yellow: { top: '#FFF9E6', rim: '#FFE494', base: '#FFCF4D', highlight: '#FFFDF5' },
  };
  const activePedestal = pedestalFills[pedestalColor];
  const effectiveSliceView = forceSliceView !== undefined ? forceSliceView : sliceView;

  const handleToggleSlice = (mode: boolean) => {
    sounds.playPop();
    setSliceView(mode);
  };

  const handleCandleClick = () => {
    sounds.playCandle();
    if (onToggleCandles) {
      onToggleCandles();
    }
  };

  return (
    <div className="relative flex flex-col items-center select-none w-full" id={`cake-visualizer-${cake.id}`}>
      {/* Controls for full view & interactions */}
      {interactive && !isMini && !isSm && (
        <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-3 px-1">
          {/* Slice / Full View buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-[#FFF0F5] border-2 border-[#FFD0DE] rounded-2xl shadow-2xs">
            <button
              type="button"
              onClick={() => handleToggleSlice(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-xl transition-all active:scale-95 ${
                !effectiveSliceView
                  ? 'bg-[#FF477E] text-white shadow-xs'
                  : 'text-pink-700 hover:bg-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Pastel Completo 🎂</span>
            </button>
            <button
              type="button"
              onClick={() => handleToggleSlice(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-xl transition-all active:scale-95 ${
                effectiveSliceView
                  ? 'bg-[#FF477E] text-white shadow-xs'
                  : 'text-pink-700 hover:bg-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Ver Capas 🍰</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Cute Kawaii Face toggle */}
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                setShowFace(!showFace);
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-xl border-2 transition-all ${
                showFace
                  ? 'bg-pink-100 border-pink-300 text-pink-700'
                  : 'bg-white border-gray-200 text-gray-500'
              }`}
              title="Carita tierna en el pastel"
            >
              <Smile className="w-3.5 h-3.5 text-pink-500" />
              <span className="hidden sm:inline">Carita</span>
            </button>

            {/* Candle toggle */}
            {hasCandles && showToppings && (
              <button
                type="button"
                onClick={handleCandleClick}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-xl border-2 transition-all active:scale-95 ${
                  cake.candlesLit
                    ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${cake.candlesLit ? 'text-amber-500 fill-amber-400 animate-bounce' : 'text-gray-400'}`} />
                <span>{cake.candlesLit ? '¡Soplar! 💨' : 'Encender 🕯️'}</span>
              </button>
            )}

            {/* Plate color buttons */}
            <div className="flex items-center gap-1 p-1 bg-white border-2 border-pink-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setPedestalColor('pink');
                }}
                className={`w-5 h-5 rounded-lg border transition-transform ${pedestalColor === 'pink' ? 'scale-110 ring-2 ring-[#FF477E]' : ''}`}
                style={{ backgroundColor: '#FF8FAB' }}
                title="Plato Rosa"
              />
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setPedestalColor('mint');
                }}
                className={`w-5 h-5 rounded-lg border transition-transform ${pedestalColor === 'mint' ? 'scale-110 ring-2 ring-[#06D6A0]' : ''}`}
                style={{ backgroundColor: '#6BD4BE' }}
                title="Plato Menta"
              />
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setPedestalColor('yellow');
                }}
                className={`w-5 h-5 rounded-lg border transition-transform ${pedestalColor === 'yellow' ? 'scale-110 ring-2 ring-[#FFB703]' : ''}`}
                style={{ backgroundColor: '#FFCF4D' }}
                title="Plato Amarillo"
              />
            </div>
          </div>
        </div>
      )}

      {/* SVG Canvas */}
      <div
        key={`${cake.shapeId}-${cake.spongeId}-${cake.frostingId}-${currentStep}`}
        className={`w-full flex items-center justify-center transition-all animate-scale-up ${
          isMini ? 'max-w-[130px]' : isSm ? 'max-w-[240px]' : 'max-w-[460px] md:max-w-[500px]'
        }`}
      >
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-auto drop-shadow-md overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="cake-ground-shadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2E1C14" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#2E1C14" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#2E1C14" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="flame-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF3B0" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#FF9F1C" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#E71D36" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 1. SOFT AMBIENT GROUND SHADOW */}
          <ellipse cx={centerX} cy={baseY + 54} rx={205} ry={28} fill="url(#cake-ground-shadow)" />

          {/* 2. PARTY PEDESTAL PLATE */}
          <g id="pedestal-group">
            <path
              d={`M ${centerX - 35} ${baseY + 52} 
                 C ${centerX - 35} ${baseY + 40}, ${centerX - 16} ${baseY + 30}, ${centerX - 16} ${baseY + 14}
                 L ${centerX + 16} ${baseY + 14}
                 C ${centerX + 16} ${baseY + 30}, ${centerX + 35} ${baseY + 40}, ${centerX + 35} ${baseY + 52}
                 Z`}
              fill={activePedestal.base}
            />
            <ellipse cx={centerX} cy={baseY + 52} rx={65} ry={11} fill={activePedestal.rim} />
            <ellipse cx={centerX} cy={baseY + 50} rx={63} ry={9} fill={activePedestal.highlight} />

            <path
              d={`M ${centerX - 192} ${baseY + 2} 
                 A 192 33 0 0 0 ${centerX + 192} ${baseY + 2} 
                 L ${centerX + 192} ${baseY + 15} 
                 A 192 33 0 0 1 ${centerX - 192} ${baseY + 15} Z`}
              fill={activePedestal.rim}
            />
            <ellipse
              cx={centerX}
              cy={baseY + 2}
              rx={192}
              ry={33}
              fill={activePedestal.top}
              stroke={activePedestal.highlight}
              strokeWidth="2.5"
            />
            <ellipse
              cx={centerX}
              cy={baseY + 2}
              rx={176}
              ry={28}
              fill="none"
              stroke={activePedestal.rim}
              strokeWidth="1.5"
            />
          </g>

          {/* 3. DYNAMIC SHAPE CAKE RENDERING */}
          {showShape && (
            <g id="cake-geometry-container">
              {/* STEP 1: BLUEPRINT STENCIL (IF NOT YET BAKED) */}
              {!showSponge && (
                <g id="step1-shape-stencil">
                  {shape.id === 'round' && (
                    <g>
                      <ellipse cx={centerX} cy={baseY - 10} rx={140} ry={26} fill="#FFF3E0" stroke="#FF9800" strokeWidth="3" strokeDasharray="6 4" />
                      <path
                        d={`M ${centerX - 140} ${baseY - 10}
                           L ${centerX - 140} ${baseY - 10 - cakeH}
                           A 140 26 0 0 1 ${centerX + 140} ${baseY - 10 - cakeH}
                           L ${centerX + 140} ${baseY - 10}
                           A 140 26 0 0 1 ${centerX - 140} ${baseY - 10} Z`}
                        fill="#FFFDE7"
                        stroke="#FF9800"
                        strokeWidth="2.5"
                        strokeDasharray="6 4"
                      />
                      <ellipse cx={centerX} cy={baseY - 10 - cakeH} rx={140} ry={26} fill="#FFFFFF" stroke="#FF9800" strokeWidth="3" />
                      <text x={centerX} y={baseY - 65} textAnchor="middle" fill="#E65100" fontSize="18" fontWeight="800">
                        ⭕ Pastel Redondo
                      </text>
                      <text x={centerX} y={baseY - 40} textAnchor="middle" fill="#FB8C00" fontSize="13" fontWeight="700">
                        ¡Listo para hornear bizcocho! ✨
                      </text>
                    </g>
                  )}

                  {shape.id === 'heart' && (
                    <g>
                      {/* Left front wall */}
                      <path
                        d={`M 250,${baseY - 10}
                           C 200,${baseY - 14} 140,${baseY - 28} 125,${baseY - 52}
                           L 125,${baseY - 52 - cakeH}
                           C 140,${baseY - 28 - cakeH} 200,${baseY - 14 - cakeH} 250,${baseY - 10 - cakeH} Z`}
                        fill="#FFE4E8"
                        stroke="#FF477E"
                        strokeWidth="2.5"
                        strokeDasharray="6 4"
                      />
                      {/* Right front wall */}
                      <path
                        d={`M 250,${baseY - 10}
                           C 300,${baseY - 14} 360,${baseY - 28} 375,${baseY - 52}
                           L 375,${baseY - 52 - cakeH}
                           C 360,${baseY - 28 - cakeH} 300,${baseY - 14 - cakeH} 250,${baseY - 10 - cakeH} Z`}
                        fill="#FFF0F5"
                        stroke="#FF477E"
                        strokeWidth="2.5"
                        strokeDasharray="6 4"
                      />
                      {/* Top heart lid */}
                      <path
                        d={`M 250,${baseY - 10 - cakeH}
                           C 200,${baseY - 14 - cakeH} 140,${baseY - 28 - cakeH} 125,${baseY - 52 - cakeH}
                           C 115,${baseY - 78 - cakeH} 145,${baseY - 92 - cakeH} 180,${baseY - 92 - cakeH}
                           C 215,${baseY - 92 - cakeH} 238,${baseY - 74 - cakeH} 250,${baseY - 66 - cakeH}
                           C 262,${baseY - 74 - cakeH} 285,${baseY - 92 - cakeH} 320,${baseY - 92 - cakeH}
                           C 355,${baseY - 92 - cakeH} 385,${baseY - 78 - cakeH} 375,${baseY - 52 - cakeH}
                           C 360,${baseY - 28 - cakeH} 300,${baseY - 14 - cakeH} 250,${baseY - 10 - cakeH} Z`}
                        fill="#FFFFFF"
                        stroke="#FF477E"
                        strokeWidth="3.5"
                      />
                      <text x={centerX} y={baseY - 65} textAnchor="middle" fill="#D81B60" fontSize="18" fontWeight="800">
                        💖 ¡Pastel de Corazón!
                      </text>
                      <text x={centerX} y={baseY - 40} textAnchor="middle" fill="#FF477E" fontSize="13" fontWeight="700">
                        ¡Forma dulce y amorosa! ✨
                      </text>
                    </g>
                  )}

                  {shape.id === 'square' && (
                    <g>
                      <polygon
                        points={`120,${baseY - 40} 250,${baseY} 250,${baseY - cakeH} 120,${baseY - 40 - cakeH}`}
                        fill="#FFF8E1"
                        stroke="#FFA000"
                        strokeWidth="2.5"
                        strokeDasharray="6 4"
                      />
                      <polygon
                        points={`250,${baseY} 380,${baseY - 40} 380,${baseY - 40 - cakeH} 250,${baseY - cakeH}`}
                        fill="#FFF3E0"
                        stroke="#FFA000"
                        strokeWidth="2.5"
                        strokeDasharray="6 4"
                      />
                      <polygon
                        points={`250,${baseY - cakeH} 380,${baseY - 40 - cakeH} 250,${baseY - 80 - cakeH} 120,${baseY - 40 - cakeH}`}
                        fill="#FFFFFF"
                        stroke="#FF8F00"
                        strokeWidth="3.5"
                      />
                      <text x={centerX} y={baseY - 65} textAnchor="middle" fill="#E65100" fontSize="18" fontWeight="800">
                        🟦 ¡Pastel Cuadrado!
                      </text>
                      <text x={centerX} y={baseY - 40} textAnchor="middle" fill="#FFA000" fontSize="13" fontWeight="700">
                        ¡Bloque cúbico estilo regalo! 🎁
                      </text>
                    </g>
                  )}

                  {shape.id === 'hexagon' && (
                    <g>
                      <polygon points={`120,${baseY - 35} 185,${baseY} 185,${baseY - cakeH} 120,${baseY - 35 - cakeH}`} fill="#F3E5F5" stroke="#AB47BC" strokeWidth="2" strokeDasharray="6 4" />
                      <polygon points={`185,${baseY} 315,${baseY} 315,${baseY - cakeH} 185,${baseY - cakeH}`} fill="#EDE7F6" stroke="#AB47BC" strokeWidth="2" strokeDasharray="6 4" />
                      <polygon points={`315,${baseY} 380,${baseY - 35} 380,${baseY - 35 - cakeH} 315,${baseY - cakeH}`} fill="#E8EAF6" stroke="#AB47BC" strokeWidth="2" strokeDasharray="6 4" />
                      <polygon
                        points={`120,${baseY - 35 - cakeH} 185,${baseY - cakeH} 315,${baseY - cakeH} 380,${baseY - 35 - cakeH} 315,${baseY - 70 - cakeH} 185,${baseY - 70 - cakeH}`}
                        fill="#FFFFFF"
                        stroke="#8E24AA"
                        strokeWidth="3.5"
                      />
                      <text x={centerX} y={baseY - 65} textAnchor="middle" fill="#6A1B9A" fontSize="18" fontWeight="800">
                        ⬡ ¡Pastel Hexagonal!
                      </text>
                      <text x={centerX} y={baseY - 40} textAnchor="middle" fill="#AB47BC" fontSize="13" fontWeight="700">
                        ¡Prisma mágico de 6 caras! ✨
                      </text>
                    </g>
                  )}
                </g>
              )}

              {/* STEP 2+: SPONGE AND FILLING LAYERS ARE ALWAYS DISPLAYED IN FULL */}
              {showSponge && (
                <g id="real-cake-stack">
                  {/* =========================================================================
                      A. ROUND CAKE: 3 SPONGE TIERS + 2 FILLING TIERS
                      ========================================================================= */}
                  {shape.id === 'round' && (
                    <g id="round-layered-cake">
                      {/* Tier 1 (Bottom Sponge) */}
                      <path d={`M 110,${baseY - 10} L 110,${baseY - 46} A 140 26 0 0 1 390,${baseY - 46} L 390,${baseY - 10} A 140 26 0 0 1 110,${baseY - 10} Z`} fill={sponge.crumbColor} stroke="#222" strokeWidth="2" />
                      <ellipse cx={centerX} cy={baseY - 46} rx={140} ry={26} fill={sponge.color} />

                      {/* Filling 1 */}
                      {showFilling && (
                        <>
                          <path d={`M 112,${baseY - 46} L 112,${baseY - 60} A 138 25 0 0 1 388,${baseY - 60} L 388,${baseY - 46} A 138 25 0 0 1 112,${baseY - 46} Z`} fill={filling.accentColor} />
                          <ellipse cx={centerX} cy={baseY - 60} rx={138} ry={25} fill={filling.color} />
                        </>
                      )}

                      {/* Tier 2 (Middle Sponge) */}
                      <path d={`M 110,${baseY - 60} L 110,${baseY - 96} A 140 26 0 0 1 390,${baseY - 96} L 390,${baseY - 60} A 140 26 0 0 1 110,${baseY - 60} Z`} fill={sponge.crumbColor} stroke="#222" strokeWidth="2" />
                      <ellipse cx={centerX} cy={baseY - 96} rx={140} ry={26} fill={sponge.color} />

                      {/* Filling 2 */}
                      {showFilling && (
                        <>
                          <path d={`M 112,${baseY - 96} L 112,${baseY - 110} A 138 25 0 0 1 388,${baseY - 110} L 388,${baseY - 96} A 138 25 0 0 1 112,${baseY - 96} Z`} fill={filling.accentColor} />
                          <ellipse cx={centerX} cy={baseY - 110} rx={138} ry={25} fill={filling.color} />
                        </>
                      )}

                      {/* Tier 3 (Top Sponge) */}
                      <path d={`M 110,${baseY - 110} L 110,${baseY - 146} A 140 26 0 0 1 390,${baseY - 146} L 390,${baseY - 110} A 140 26 0 0 1 110,${baseY - 110} Z`} fill={sponge.crumbColor} stroke="#222" strokeWidth="2" />
                      <ellipse cx={centerX} cy={baseY - 146} rx={140} ry={26} fill={sponge.color} stroke="#222" strokeWidth="2" />

                      {/* FROSTING TOP DETAIL WITH OVAL/SCALLOPED DRIPS (Only covers top & drips down!) */}
                      {showFrosting && (
                        <g id="round-frosting-top-drips">
                          {/* Top frosted surface */}
                          <ellipse cx={centerX} cy={baseY - 146} rx={140} ry={26} fill={frosting.color} stroke={frosting.accentColor} strokeWidth="3" />
                          {/* Wavy rounded oval drip scallops falling gently over top sponge tier */}
                          <path
                            d={`M 110,${baseY - 146}
                               A 140 26 0 0 0 390,${baseY - 146}
                               C 375,${baseY - 126} 360,${baseY - 122} 350,${baseY - 140}
                               C 340,${baseY - 120} 325,${baseY - 118} 315,${baseY - 142}
                               C 300,${baseY - 115} 280,${baseY - 112} 270,${baseY - 140}
                               C 255,${baseY - 116} 240,${baseY - 114} 230,${baseY - 142}
                               C 215,${baseY - 122} 195,${baseY - 118} 185,${baseY - 140}
                               C 170,${baseY - 120} 150,${baseY - 118} 140,${baseY - 142}
                               C 125,${baseY - 128} 115,${baseY - 136} 110,${baseY - 146} Z`}
                            fill={frosting.color}
                            stroke={frosting.accentColor}
                            strokeWidth="2"
                          />
                          {/* Cute piping border dots around top */}
                          {[-120, -90, -60, -30, 0, 30, 60, 90, 120].map((dx, i) => (
                            <circle key={`r-drip-${i}`} cx={centerX + dx} cy={baseY - 146 + Math.sin((i / 8) * Math.PI) * 5} r={5.5} fill={frosting.accentColor} stroke="#FFF" strokeWidth="1.2" />
                          ))}
                        </g>
                      )}
                    </g>
                  )}

                  {/* =========================================================================
                      B. HEART CAKE: FLAWLESS CURVED SPONGE + FILLING THAT WRAPS 100% NATURALLY
                      ========================================================================= */}
                  {shape.id === 'heart' && (
                    <g id="heart-layered-cake">
                      {/* Helper to draw curved heart wall between yBottom and yTop */}
                      {(() => {
                        const drawHeartWall = (yB: number, yT: number, fillLeft: string, fillRight: string) => (
                          <g>
                            {/* Left curved heart front wall */}
                            <path
                              d={`M 250,${yB}
                                 C 200,${yB - 4} 140,${yB - 18} 125,${yB - 42}
                                 L 125,${yT - 42}
                                 C 140,${yT - 18} 200,${yT - 4} 250,${yT} Z`}
                              fill={fillLeft}
                              stroke="#222"
                              strokeWidth="1.8"
                            />
                            {/* Right curved heart front wall */}
                            <path
                              d={`M 250,${yB}
                                 C 300,${yB - 4} 360,${yB - 18} 375,${yB - 42}
                                 L 375,${yT - 42}
                                 C 360,${yT - 18} 300,${yT - 4} 250,${yT} Z`}
                              fill={fillRight}
                              stroke="#222"
                              strokeWidth="1.8"
                            />
                          </g>
                        );

                        return (
                          <>
                            {/* Sponge Tier 1 (Bottom Heart: 310 to 274) */}
                            {drawHeartWall(baseY - 10, baseY - 46, sponge.crumbColor, sponge.color)}

                            {/* Filling Tier 1 (Smoothly curved filling band: 274 to 260) */}
                            {showFilling && drawHeartWall(baseY - 46, baseY - 60, filling.accentColor, filling.color)}

                            {/* Sponge Tier 2 (Middle Heart: 260 to 224) */}
                            {drawHeartWall(baseY - 60, baseY - 96, sponge.crumbColor, sponge.color)}

                            {/* Filling Tier 2 (Smoothly curved filling band: 224 to 210) */}
                            {showFilling && drawHeartWall(baseY - 96, baseY - 110, filling.accentColor, filling.color)}

                            {/* Sponge Tier 3 (Top Heart: 210 to 174) */}
                            {drawHeartWall(baseY - 110, baseY - 146, sponge.crumbColor, sponge.color)}

                            {/* Top Heart Plate (Sponge surface: perfectly flush with Tier 3 walls) */}
                            <path
                              d={`M 250,${baseY - 146}
                                 C 200,${baseY - 146 - 4} 140,${baseY - 146 - 18} 125,${baseY - 146 - 42}
                                 C 115,${baseY - 146 - 68} 145,${baseY - 146 - 82} 180,${baseY - 146 - 82}
                                 C 215,${baseY - 146 - 82} 238,${baseY - 146 - 64} 250,${baseY - 146 - 56}
                                 C 262,${baseY - 146 - 64} 285,${baseY - 146 - 82} 320,${baseY - 146 - 82}
                                 C 355,${baseY - 146 - 82} 385,${baseY - 146 - 68} 375,${baseY - 146 - 42}
                                 C 360,${baseY - 146 - 18} 300,${baseY - 146 - 4} 250,${baseY - 146} Z`}
                              fill={sponge.color}
                              stroke="#222"
                              strokeWidth="2.5"
                            />

                            {/* FROSTING TOP DETAIL WITH OVAL/ROUNDED DRIPS (Only covers top & drips down!) */}
                            {showFrosting && (
                              <g id="heart-frosting-top-drips">
                                {/* Top frosted heart surface (flush with top lid) */}
                                <path
                                  d={`M 250,${baseY - 146}
                                     C 200,${baseY - 146 - 4} 140,${baseY - 146 - 18} 125,${baseY - 146 - 42}
                                     C 115,${baseY - 146 - 68} 145,${baseY - 146 - 82} 180,${baseY - 146 - 82}
                                     C 215,${baseY - 146 - 82} 238,${baseY - 146 - 64} 250,${baseY - 146 - 56}
                                     C 262,${baseY - 146 - 64} 285,${baseY - 146 - 82} 320,${baseY - 146 - 82}
                                     C 355,${baseY - 146 - 82} 385,${baseY - 146 - 68} 375,${baseY - 146 - 42}
                                     C 360,${baseY - 146 - 18} 300,${baseY - 146 - 4} 250,${baseY - 146} Z`}
                                  fill={frosting.color}
                                  stroke={frosting.accentColor}
                                  strokeWidth="3"
                                />
                                {/* Scalloped rounded oval drips dripping gently over front rim */}
                                <path
                                  d={`M 125,${baseY - 146 - 42}
                                     C 135,${baseY - 146 - 22} 150,${baseY - 146 - 24} 160,${baseY - 146 - 36}
                                     C 175,${baseY - 146 - 14} 195,${baseY - 146 - 16} 205,${baseY - 146 - 26}
                                     C 220,${baseY - 146 - 2} 240,${baseY - 146 + 4} 250,${baseY - 146 + 10}
                                     C 260,${baseY - 146 + 4} 280,${baseY - 146 - 2} 295,${baseY - 146 - 26}
                                     C 305,${baseY - 146 - 16} 325,${baseY - 146 - 14} 340,${baseY - 146 - 36}
                                     C 350,${baseY - 146 - 24} 365,${baseY - 146 - 22} 375,${baseY - 146 - 42}
                                     C 360,${baseY - 146 - 18} 300,${baseY - 146 - 4} 250,${baseY - 146}
                                     C 200,${baseY - 146 - 4} 140,${baseY - 146 - 18} 125,${baseY - 146 - 42} Z`}
                                  fill={frosting.color}
                                  stroke={frosting.accentColor}
                                  strokeWidth="2"
                                />
                                {/* Piping pearls along heart rim */}
                                {[
                                  { x: 250, y: baseY - 146 },
                                  { x: 200, y: baseY - 146 - 10 },
                                  { x: 155, y: baseY - 146 - 25 },
                                  { x: 125, y: baseY - 146 - 42 },
                                  { x: 300, y: baseY - 146 - 10 },
                                  { x: 345, y: baseY - 146 - 25 },
                                  { x: 375, y: baseY - 146 - 42 },
                                  { x: 180, y: baseY - 146 - 82 },
                                  { x: 250, y: baseY - 146 - 56 },
                                  { x: 320, y: baseY - 146 - 82 },
                                ].map((pearl, i) => (
                                  <circle
                                    key={`h-pearl-${i}`}
                                    cx={pearl.x}
                                    cy={pearl.y}
                                    r={5}
                                    fill={frosting.accentColor}
                                    stroke="#FFF"
                                    strokeWidth="1.2"
                                  />
                                ))}
                              </g>
                            )}
                          </>
                        );
                      })()}
                    </g>
                  )}

                  {/* =========================================================================
                      C. SQUARE CAKE: ISOMETRIC SPONGE TIERS + FILLING BANDS + TOP FROSTING DRIP
                      ========================================================================= */}
                  {shape.id === 'square' && (
                    <g id="square-layered-cake">
                      {/* Left Wall: 3 Sponges + 2 Fillings */}
                      {/* Sponge Tier 1 */}
                      <polygon points={`120,${baseY - 40} 250,${baseY} 250,${baseY - 36} 120,${baseY - 76}`} fill={sponge.crumbColor} stroke="#222" strokeWidth="1.8" />
                      {/* Filling 1 */}
                      {showFilling && <polygon points={`120,${baseY - 76} 250,${baseY - 36} 250,${baseY - 50} 120,${baseY - 90}`} fill={filling.accentColor} />}
                      {/* Sponge Tier 2 */}
                      <polygon points={`120,${baseY - 90} 250,${baseY - 50} 250,${baseY - 86} 120,${baseY - 126}`} fill={sponge.crumbColor} stroke="#222" strokeWidth="1.8" />
                      {/* Filling 2 */}
                      {showFilling && <polygon points={`120,${baseY - 126} 250,${baseY - 86} 250,${baseY - 100} 120,${baseY - 140}`} fill={filling.accentColor} />}
                      {/* Sponge Tier 3 */}
                      <polygon points={`120,${baseY - 140} 250,${baseY - 100} 250,${baseY - 140} 120,${baseY - 180}`} fill={sponge.crumbColor} stroke="#222" strokeWidth="1.8" />

                      {/* Right Wall: 3 Sponges + 2 Fillings */}
                      {/* Sponge Tier 1 */}
                      <polygon points={`250,${baseY} 380,${baseY - 40} 380,${baseY - 76} 250,${baseY - 36}`} fill={sponge.color} stroke="#222" strokeWidth="1.8" />
                      {/* Filling 1 */}
                      {showFilling && <polygon points={`250,${baseY - 36} 380,${baseY - 76} 380,${baseY - 90} 250,${baseY - 50}`} fill={filling.color} />}
                      {/* Sponge Tier 2 */}
                      <polygon points={`250,${baseY - 50} 380,${baseY - 90} 380,${baseY - 126} 250,${baseY - 86}`} fill={sponge.color} stroke="#222" strokeWidth="1.8" />
                      {/* Filling 2 */}
                      {showFilling && <polygon points={`250,${baseY - 86} 380,${baseY - 126} 380,${baseY - 140} 250,${baseY - 100}`} fill={filling.color} />}
                      {/* Sponge Tier 3 */}
                      <polygon points={`250,${baseY - 100} 380,${baseY - 140} 380,${baseY - 180} 250,${baseY - 140}`} fill={sponge.color} stroke="#222" strokeWidth="1.8" />

                      {/* Top Isometric Diamond Sponge */}
                      <polygon
                        points={`250,${baseY - 140} 380,${baseY - 180} 250,${baseY - 220} 120,${baseY - 180}`}
                        fill={sponge.color}
                        stroke="#222"
                        strokeWidth="2.5"
                      />

                      {/* FROSTING TOP DETAIL WITH OVAL/SCALLOPED DRIPS (Only covers top & drips down!) */}
                      {showFrosting && (
                        <g id="square-frosting-top-drips">
                          {/* Top diamond glazed */}
                          <polygon
                            points={`250,${baseY - 140} 380,${baseY - 180} 250,${baseY - 220} 120,${baseY - 180}`}
                            fill={frosting.color}
                            stroke={frosting.accentColor}
                            strokeWidth="3"
                          />
                          {/* Drips on left wall */}
                          <path
                            d={`M 120,${baseY - 180}
                               L 250,${baseY - 140}
                               C 235,${baseY - 125} 220,${baseY - 128} 210,${baseY - 148}
                               C 195,${baseY - 130} 180,${baseY - 132} 170,${baseY - 156}
                               C 155,${baseY - 138} 140,${baseY - 140} 130,${baseY - 168}
                               L 120,${baseY - 180} Z`}
                            fill={frosting.color}
                            stroke={frosting.accentColor}
                            strokeWidth="1.8"
                          />
                          {/* Drips on right wall */}
                          <path
                            d={`M 250,${baseY - 140}
                               L 380,${baseY - 180}
                               C 370,${baseY - 168} 355,${baseY - 140} 340,${baseY - 156}
                               C 330,${baseY - 132} 315,${baseY - 130} 300,${baseY - 148}
                               C 290,${baseY - 128} 275,${baseY - 125} 250,${baseY - 140} Z`}
                            fill={frosting.accentColor}
                            stroke={frosting.accentColor}
                            strokeWidth="1.8"
                          />
                          {/* Corner piping pearls */}
                          <circle cx="120" cy={baseY - 180} r="6" fill={frosting.accentColor} stroke="#FFF" strokeWidth="1.2" />
                          <circle cx="250" cy={baseY - 140} r="6" fill={frosting.accentColor} stroke="#FFF" strokeWidth="1.2" />
                          <circle cx="380" cy={baseY - 180} r="6" fill={frosting.accentColor} stroke="#FFF" strokeWidth="1.2" />
                          <circle cx="250" cy={baseY - 220} r="6" fill={frosting.accentColor} stroke="#FFF" strokeWidth="1.2" />
                        </g>
                      )}
                    </g>
                  )}

                  {/* =========================================================================
                      D. HEXAGON CAKE: FACETED SPONGE + FILLINGS + TOP FROSTING DRIP
                      ========================================================================= */}
                  {shape.id === 'hexagon' && (
                    <g id="hexagon-layered-cake">
                      {/* Left Facet Layers */}
                      <polygon points={`120,${baseY - 35} 185,${baseY} 185,${baseY - 36} 120,${baseY - 71}`} fill={sponge.crumbColor} stroke="#222" strokeWidth="1.5" />
                      {showFilling && <polygon points={`120,${baseY - 71} 185,${baseY - 36} 185,${baseY - 50} 120,${baseY - 85}`} fill={filling.accentColor} />}
                      <polygon points={`120,${baseY - 85} 185,${baseY - 50} 185,${baseY - 86} 120,${baseY - 121}`} fill={sponge.crumbColor} stroke="#222" strokeWidth="1.5" />
                      {showFilling && <polygon points={`120,${baseY - 121} 185,${baseY - 86} 185,${baseY - 100} 120,${baseY - 135}`} fill={filling.accentColor} />}
                      <polygon points={`120,${baseY - 135} 185,${baseY - 100} 185,${baseY - 140} 120,${baseY - 175}`} fill={sponge.crumbColor} stroke="#222" strokeWidth="1.5" />

                      {/* Center Front Facet Layers */}
                      <polygon points={`185,${baseY} 315,${baseY} 315,${baseY - 36} 185,${baseY - 36}`} fill={sponge.color} stroke="#222" strokeWidth="1.5" />
                      {showFilling && <polygon points={`185,${baseY - 36} 315,${baseY - 36} 315,${baseY - 50} 185,${baseY - 50}`} fill={filling.color} />}
                      <polygon points={`185,${baseY - 50} 315,${baseY - 50} 315,${baseY - 86} 185,${baseY - 86}`} fill={sponge.color} stroke="#222" strokeWidth="1.5" />
                      {showFilling && <polygon points={`185,${baseY - 86} 315,${baseY - 86} 315,${baseY - 100} 185,${baseY - 100}`} fill={filling.color} />}
                      <polygon points={`185,${baseY - 100} 315,${baseY - 100} 315,${baseY - 140} 185,${baseY - 140}`} fill={sponge.color} stroke="#222" strokeWidth="1.5" />

                      {/* Right Facet Layers */}
                      <polygon points={`315,${baseY} 380,${baseY - 35} 380,${baseY - 71} 315,${baseY - 36}`} fill={sponge.crumbColor} stroke="#222" strokeWidth="1.5" />
                      {showFilling && <polygon points={`315,${baseY - 36} 380,${baseY - 71} 380,${baseY - 85} 315,${baseY - 50}`} fill={filling.accentColor} />}
                      <polygon points={`315,${baseY - 50} 380,${baseY - 85} 380,${baseY - 121} 315,${baseY - 86}`} fill={sponge.crumbColor} stroke="#222" strokeWidth="1.5" />
                      {showFilling && <polygon points={`315,${baseY - 86} 380,${baseY - 121} 380,${baseY - 135} 315,${baseY - 100}`} fill={filling.accentColor} />}
                      <polygon points={`315,${baseY - 100} 380,${baseY - 135} 380,${baseY - 175} 315,${baseY - 140}`} fill={sponge.crumbColor} stroke="#222" strokeWidth="1.5" />

                      {/* Top Hexagon Cap */}
                      <polygon
                        points={`120,${baseY - 175} 185,${baseY - 140} 315,${baseY - 140} 380,${baseY - 175} 315,${baseY - 210} 185,${baseY - 210}`}
                        fill={sponge.color}
                        stroke="#222"
                        strokeWidth="2.5"
                      />

                      {/* FROSTING TOP DETAIL WITH OVAL/SCALLOPED DRIPS (Only covers top & drips down!) */}
                      {showFrosting && (
                        <g id="hexagon-frosting-top-drips">
                          <polygon
                            points={`120,${baseY - 175} 185,${baseY - 140} 315,${baseY - 140} 380,${baseY - 175} 315,${baseY - 210} 185,${baseY - 210}`}
                            fill={frosting.color}
                            stroke={frosting.accentColor}
                            strokeWidth="3"
                          />
                          {/* Scalloped oval drips over front facets */}
                          <path
                            d={`M 120,${baseY - 175}
                               L 185,${baseY - 140}
                               L 315,${baseY - 140}
                               L 380,${baseY - 175}
                               C 365,${baseY - 150} 350,${baseY - 145} 335,${baseY - 155}
                               C 320,${baseY - 125} 295,${baseY - 122} 280,${baseY - 142}
                               C 265,${baseY - 120} 240,${baseY - 120} 225,${baseY - 142}
                               C 210,${baseY - 125} 190,${baseY - 130} 180,${baseY - 145}
                               C 165,${baseY - 145} 140,${baseY - 150} 120,${baseY - 175} Z`}
                            fill={frosting.color}
                            stroke={frosting.accentColor}
                            strokeWidth="1.8"
                          />
                        </g>
                      )}
                    </g>
                  )}

                  {/* KAWAII SWEET SMILING FACE (ON THE CAKE BODY) */}
                  {showFace && (
                    <g id="kawaii-face" className="animate-pulse">
                      <circle cx={centerX - 35} cy={baseY - 72} r="5" fill="#2B1810" />
                      <circle cx={centerX - 37} cy={baseY - 74} r="1.8" fill="#FFF" />
                      <circle cx={centerX + 35} cy={baseY - 72} r="5" fill="#2B1810" />
                      <circle cx={centerX + 33} cy={baseY - 74} r="1.8" fill="#FFF" />
                      <ellipse cx={centerX - 48} cy={baseY - 65} rx="7" ry="4" fill="#FF8FAB" opacity="0.8" />
                      <ellipse cx={centerX + 48} cy={baseY - 65} rx="7" ry="4" fill="#FF8FAB" opacity="0.8" />
                      <path
                        d={`M ${centerX - 14} ${baseY - 63} Q ${centerX} ${baseY - 52} ${centerX + 14} ${baseY - 63}`}
                        fill="none"
                        stroke="#2B1810"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </g>
                  )}
                </g>
              )}

              {/* 4. TOPPINGS & ADORNOS ANIMADOS (DISTRIBUIDOS POR TODO EL PASTEL) */}
              {showToppings && (() => {
                const topCenterY =
                  shape.id === 'round'
                    ? baseY - 146
                    : shape.id === 'square'
                    ? baseY - 180
                    : shape.id === 'hexagon'
                    ? baseY - 175
                    : baseY - 146 - 40;

                return (
                  <g id="toppings-crown">
                    {/* Birthday Candles (Placed with depth in center-middle of cake) */}
                    {hasCandles && (
                      <g id="topping-candles" className="cursor-pointer" onClick={handleCandleClick}>
                        {[-42, 0, 42].map((candleX, i) => {
                          const candleBaseY = topCenterY - 8;
                          const candleTopY = candleBaseY - 44;
                          return (
                            <g key={`candle-${i}`}>
                              <rect x={centerX + candleX - 4} y={candleTopY} width="8" height={candleBaseY - candleTopY} rx="2.5" fill="#FFD166" stroke="#F4A261" strokeWidth="1.5" />
                              <line x1={centerX + candleX - 3} y1={candleTopY + 8} x2={centerX + candleX + 3} y2={candleTopY + 14} stroke="#FFF" strokeWidth="2" />
                              <line x1={centerX + candleX} y1={candleTopY} x2={centerX + candleX} y2={candleTopY - 7} stroke="#443" strokeWidth="2" />
                              {cake.candlesLit && (
                                <g className="animate-bounce">
                                  <circle cx={centerX + candleX} cy={candleTopY - 16} r="18" fill="url(#flame-glow)" />
                                  <path
                                    d={`M ${centerX + candleX} ${candleTopY - 7}
                                       C ${centerX + candleX - 5} ${candleTopY - 14}, ${centerX + candleX - 4} ${candleTopY - 22}, ${centerX + candleX} ${candleTopY - 27}
                                       C ${centerX + candleX + 4} ${candleTopY - 22}, ${centerX + candleX + 5} ${candleTopY - 14}, ${centerX + candleX} ${candleTopY - 7} Z`}
                                    fill="#FFB703"
                                    stroke="#FF70A6"
                                    strokeWidth="0.8"
                                  />
                                  <ellipse cx={centerX + candleX} cy={candleTopY - 13} rx={2.5} ry="5" fill="#FFF" />
                                </g>
                              )}
                            </g>
                          );
                        })}
                      </g>
                    )}

                    {/* Fresh Berries (Distributed across front, middle, back, and sides) */}
                    {hasBerries && (
                      <g id="topping-berries">
                        {/* Big strawberry at back-left */}
                        <g transform={`translate(${centerX - 42}, ${topCenterY - 24})`}>
                          <path d="M 12 0 C 24 0, 24 16, 12 26 C 0 16, 0 0, 12 0 Z" fill="#E63946" stroke="#C1121F" strokeWidth="1.5" />
                          <circle cx="8" cy="10" r="1.2" fill="#FFE3E3" />
                          <circle cx="16" cy="10" r="1.2" fill="#FFE3E3" />
                          <circle cx="12" cy="16" r="1.2" fill="#FFE3E3" />
                          <path d="M 8 -2 C 12 3, 14 0, 18 -2 C 14 2, 13 4, 12 6 C 11 4, 10 2, 8 -2 Z" fill="#2A9D8F" />
                        </g>
                        {/* Second strawberry at back-right */}
                        <g transform={`translate(${centerX + 26}, ${topCenterY - 20})`}>
                          <path d="M 10 0 C 20 0, 20 14, 10 22 C 0 14, 0 0, 10 0 Z" fill="#E63946" stroke="#C1121F" strokeWidth="1.3" />
                          <circle cx="7" cy="8" r="1" fill="#FFE3E3" />
                          <circle cx="13" cy="8" r="1" fill="#FFE3E3" />
                          <path d="M 7 -2 C 10 2, 12 0, 15 -2 C 12 2, 11 3, 10 5 C 9 3, 8 2, 7 -2 Z" fill="#2A9D8F" />
                        </g>
                        {/* Raspberries & Blueberries scattered harmoniously across the cake */}
                        <circle cx={centerX - 72} cy={topCenterY - 4} r="9.5" fill="#C1121F" stroke="#8B0000" strokeWidth="1.2" />
                        <circle cx={centerX - 56} cy={topCenterY + 10} r="8.5" fill="#E63946" />
                        <circle cx={centerX - 20} cy={topCenterY + 12} r="8" fill="#3D5A80" stroke="#1D3557" strokeWidth="1.2" />
                        <circle cx={centerX + 12} cy={topCenterY + 10} r="9" fill="#C1121F" stroke="#8B0000" strokeWidth="1.2" />
                        <circle cx={centerX + 58} cy={topCenterY + 8} r="8.5" fill="#E63946" />
                        <circle cx={centerX + 75} cy={topCenterY - 6} r="9.5" fill="#C1121F" />
                        <circle cx={centerX - 12} cy={topCenterY - 14} r="7" fill="#3D5A80" stroke="#1D3557" strokeWidth="1.2" />
                        <circle cx={centerX + 62} cy={topCenterY - 14} r="7.5" fill="#3D5A80" stroke="#1D3557" strokeWidth="1.2" />
                      </g>
                    )}

                    {/* Sweet Flowers (Distributed across left, right, center, and front) */}
                    {hasFlowers && (
                      <g id="topping-flowers">
                        {/* Left flower bouquet */}
                        <g transform={`translate(${centerX - 82}, ${topCenterY - 14})`}>
                          <ellipse cx="6" cy="2" rx="7" ry="8" fill="#9B5DE5" stroke="#7209B7" strokeWidth="1" />
                          <ellipse cx="14" cy="2" rx="7" ry="8" fill="#B388EB" />
                          <ellipse cx="4" cy="11" rx="7" ry="7" fill="#8338EC" />
                          <ellipse cx="16" cy="11" rx="7" ry="7" fill="#8338EC" />
                          <circle cx="10" cy="7" r="3.5" fill="#FFBE0B" stroke="#FB8500" strokeWidth="1" />
                        </g>
                        {/* Center-back flower */}
                        <g transform={`translate(${centerX - 10}, ${topCenterY - 24})`}>
                          <ellipse cx="6" cy="2" rx="5" ry="6" fill="#FF70A6" stroke="#D81B60" strokeWidth="1" />
                          <ellipse cx="12" cy="2" rx="5" ry="6" fill="#FFAFCC" />
                          <ellipse cx="4" cy="9" rx="5" ry="5" fill="#FF70A6" />
                          <ellipse cx="14" cy="9" rx="5" ry="5" fill="#FF70A6" />
                          <circle cx="9" cy="5" r="2.8" fill="#FFD166" />
                        </g>
                        {/* Right flower */}
                        <circle cx={centerX + 78} cy={topCenterY - 4} r="8.5" fill="#FF70A6" stroke="#E63946" strokeWidth="1.5" />
                        <circle cx={centerX + 78} cy={topCenterY - 4} r="3" fill="#FFD166" />
                        {/* Front-left accent flower */}
                        <circle cx={centerX - 35} cy={topCenterY + 12} r="7" fill="#B388EB" stroke="#7209B7" strokeWidth="1.2" />
                        <circle cx={centerX - 35} cy={topCenterY + 12} r="2.5" fill="#FFBE0B" />
                        {/* Front-right accent flower */}
                        <circle cx={centerX + 42} cy={topCenterY + 10} r="7.5" fill="#FF70A6" stroke="#D81B60" strokeWidth="1.2" />
                        <circle cx={centerX + 42} cy={topCenterY + 10} r="2.5" fill="#FFD166" />
                      </g>
                    )}

                    {/* Sweet Macarons (Distributed across left, right, and front-center) */}
                    {hasMacarons && (
                      <g id="topping-macarons">
                        {/* Right macaron */}
                        <g transform={`translate(${centerX + 52}, ${topCenterY - 14})`}>
                          <ellipse cx="12" cy="6" rx="14" ry="7" fill="#E0AAFF" stroke="#9D4EDD" strokeWidth="1.5" />
                          <rect x="0" y="5" width="24" height="4" fill="#C77DFF" rx="2" />
                          <ellipse cx="12" cy="9" rx="14" ry="7" fill="#C77DFF" />
                        </g>
                        {/* Left macaron */}
                        <g transform={`translate(${centerX - 84}, ${topCenterY - 8})`}>
                          <ellipse cx="10" cy="6" rx="13" ry="6.5" fill="#D8F3DC" stroke="#74C69D" strokeWidth="1.5" />
                          <rect x="0" y="5" width="20" height="4" fill="#95D5B2" rx="2" />
                          <ellipse cx="10" cy="9" rx="13" ry="6.5" fill="#95D5B2" />
                        </g>
                        {/* Front-center macaron */}
                        <g transform={`translate(${centerX - 14}, ${topCenterY + 6})`}>
                          <ellipse cx="11" cy="5" rx="13" ry="6" fill="#FFC6FF" stroke="#FF70A6" strokeWidth="1.5" />
                          <rect x="0" y="4" width="22" height="3.5" fill="#FF99C8" rx="2" />
                          <ellipse cx="11" cy="8" rx="13" ry="6" fill="#FF99C8" />
                        </g>
                      </g>
                    )}

                    {/* Golden Sparkles (Distributed across the whole cake surface) */}
                    {hasGold && (
                      <g id="topping-gold">
                        {[
                          { x: -75, y: -14, r: 4 },
                          { x: -55, y: 8, r: 3.5 },
                          { x: -35, y: -20, r: 4.2 },
                          { x: -16, y: 12, r: 3.2 },
                          { x: 5, y: -16, r: 4.5 },
                          { x: 25, y: 10, r: 3.5 },
                          { x: 45, y: -18, r: 4 },
                          { x: 65, y: 4, r: 3.8 },
                          { x: 80, y: -10, r: 3.2 },
                          { x: 0, y: -4, r: 4.5 },
                        ].map((pearl, i) => (
                          <g key={`gold-${i}`}>
                            <circle cx={centerX + pearl.x} cy={topCenterY + pearl.y} r={pearl.r} fill="#FFD166" stroke="#F4A261" strokeWidth="1" />
                            <circle cx={centerX + pearl.x - 1} cy={topCenterY + pearl.y - 1} r={pearl.r * 0.4} fill="#FFF" />
                          </g>
                        ))}
                      </g>
                    )}

                    {/* Chocolate Curls (Scattered across the whole cake top) */}
                    {hasShavings && (
                      <g id="topping-shavings">
                        {[
                          { x: -72, y: -12 },
                          { x: -45, y: 8 },
                          { x: -20, y: -18 },
                          { x: 10, y: 10 },
                          { x: 40, y: -14 },
                          { x: 68, y: 6 },
                          { x: -8, y: -6 },
                        ].map((pos, i) => (
                          <path
                            key={`curl-${i}`}
                            d={`M ${centerX + pos.x} ${topCenterY + pos.y}
                               Q ${centerX + pos.x + 10} ${topCenterY + pos.y - 9}, ${centerX + pos.x + 18} ${topCenterY + pos.y - 2}`}
                            fill="none"
                            stroke={i % 2 === 0 ? '#4A2A1A' : '#E09F67'}
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                        ))}
                      </g>
                    )}

                    {/* CUSTOM MESSAGE SWEET BANNER */}
                    {cake.customMessage && cake.customMessage.trim().length > 0 && (
                      <g id="custom-message-plaque">
                        <g transform={`translate(${centerX - 95}, ${baseY - 75})`}>
                          <rect x="0" y="0" width="190" height="36" rx="12" fill="#FFF9E6" stroke="#FFB703" strokeWidth="2.5" filter="drop-shadow(0px 3px 6px rgba(0,0,0,0.15))" />
                          <text x="95" y="24" textAnchor="middle" fill="#8C2F39" fontFamily="Caveat, cursive" fontSize="20" fontWeight="700">
                            {cake.customMessage.length > 25 ? cake.customMessage.substring(0, 23) + '…' : cake.customMessage}
                          </text>
                        </g>
                      </g>
                    )}
                  </g>
                );
              })()}
            </g>
          )}
        </svg>
      </div>

      {/* Layer legend */}
      {showSponge && !isMini && (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-gray-700 bg-white/95 backdrop-blur-xs px-4 py-1.5 rounded-full border-2 border-pink-200 shadow-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block" style={{ backgroundColor: sponge.color }} />
            <span>Bizcocho: <strong>{sponge.name}</strong></span>
          </span>
          {showFilling && (
            <>
              <span className="text-pink-300">·</span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block" style={{ backgroundColor: filling.color }} />
                <span>Relleno: <strong>{filling.name}</strong></span>
              </span>
            </>
          )}
          {showFrosting && (
            <>
              <span className="text-pink-300">·</span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block" style={{ backgroundColor: frosting.color }} />
                <span>Glaseado Arriba: <strong>{frosting.name}</strong></span>
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
