import React, { useState } from 'react';
import {
  CAKE_SHAPES,
  CAKE_SPONGES,
  CAKE_FILLINGS,
  CAKE_FROSTINGS,
  CAKE_TOPPINGS,
} from '../data/cakeOptions';
import { sounds } from '../utils/audioEffects';

export const IngredientsCatalog: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'shapes' | 'sponges' | 'fillings' | 'frostings' | 'toppings'>('sponges');

  const handleTabClick = (tab: 'shapes' | 'sponges' | 'fillings' | 'frostings' | 'toppings') => {
    sounds.playPop();
    setActiveTab(tab);
  };

  return (
    <section id="catalogo-insumos" className="w-full bg-[#FFF9FB] border-t border-pink-100 py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-extrabold text-[#FF477E]">
                🍭 Despensa Mágica
              </span>
              <span className="text-xs text-pink-300">·</span>
              <span className="text-xs font-bold text-gray-500">
                Todos los ingredientes para tus pasteles
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black font-display text-gray-800 flex items-center gap-2">
              <span>Ingredientes & Sabores Ricos</span>
              <span>🧁</span>
            </h2>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white border border-pink-200 rounded-2xl overflow-x-auto no-scrollbar shadow-2xs">
            <button
              type="button"
              onClick={() => handleTabClick('shapes')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 active:scale-95 ${
                activeTab === 'shapes' ? 'bg-[#FF477E] text-white shadow-2xs' : 'text-gray-600 hover:text-pink-600'
              }`}
            >
              ⭕ Formas ({CAKE_SHAPES.length})
            </button>
            <button
              type="button"
              onClick={() => handleTabClick('sponges')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 active:scale-95 ${
                activeTab === 'sponges' ? 'bg-[#FF477E] text-white shadow-2xs' : 'text-gray-600 hover:text-pink-600'
              }`}
            >
              🍪 Bizcochos ({CAKE_SPONGES.length})
            </button>
            <button
              type="button"
              onClick={() => handleTabClick('fillings')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 active:scale-95 ${
                activeTab === 'fillings' ? 'bg-[#FF477E] text-white shadow-2xs' : 'text-gray-600 hover:text-pink-600'
              }`}
            >
              🍓 Rellenos ({CAKE_FILLINGS.length})
            </button>
            <button
              type="button"
              onClick={() => handleTabClick('frostings')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 active:scale-95 ${
                activeTab === 'frostings' ? 'bg-[#FF477E] text-white shadow-2xs' : 'text-gray-600 hover:text-pink-600'
              }`}
            >
              🍦 Glaseados ({CAKE_FROSTINGS.length})
            </button>
            <button
              type="button"
              onClick={() => handleTabClick('toppings')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 active:scale-95 ${
                activeTab === 'toppings' ? 'bg-[#FF477E] text-white shadow-2xs' : 'text-gray-600 hover:text-pink-600'
              }`}
            >
              ✨ Dulces ({CAKE_TOPPINGS.length})
            </button>
          </div>
        </div>

        {/* Catalog Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeTab === 'shapes' &&
            CAKE_SHAPES.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-3xl border-2 border-pink-100 shadow-2xs flex flex-col justify-between hover:border-pink-300 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-[11px] font-bold text-[#FF477E] bg-pink-50 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-gray-800 mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-600 mb-2 font-medium">{item.subtitle}</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}

          {activeTab === 'sponges' &&
            CAKE_SPONGES.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-3xl border-2 border-pink-100 shadow-2xs flex flex-col justify-between hover:border-pink-300 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{item.emoji}</span>
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 inline-block shadow-2xs"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                  <h3 className="font-extrabold text-base text-gray-800 mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-600 mb-2 font-medium">{item.subtitle}</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed mb-3">{item.description}</p>
                  <div className="p-2 bg-amber-50/70 rounded-2xl text-[11px] text-amber-900 font-bold">
                    ✨ {item.flavorVibe}
                  </div>
                </div>
              </div>
            ))}

          {activeTab === 'fillings' &&
            CAKE_FILLINGS.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-3xl border-2 border-pink-100 shadow-2xs flex flex-col justify-between hover:border-pink-300 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{item.emoji}</span>
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 inline-block shadow-2xs"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                  <h3 className="font-extrabold text-base text-gray-800 mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-600 mb-2 font-medium">{item.subtitle}</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}

          {activeTab === 'frostings' &&
            CAKE_FROSTINGS.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-3xl border-2 border-pink-100 shadow-2xs flex flex-col justify-between hover:border-pink-300 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{item.emoji}</span>
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 inline-block shadow-2xs"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                  <h3 className="font-extrabold text-base text-gray-800 mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-600 mb-2 font-medium">{item.subtitle}</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}

          {activeTab === 'toppings' &&
            CAKE_TOPPINGS.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-3xl border-2 border-pink-100 shadow-2xs flex flex-col justify-between hover:border-pink-300 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-[11px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">
                      {item.categoryName}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-gray-800 mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-600 mb-2 font-medium">{item.subtitle}</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};
