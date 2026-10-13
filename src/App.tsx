/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { CustomCake } from './types/cake';
import { INITIAL_CAKES } from './data/cakeOptions';
import { Header } from './components/Header';
import { AtelierHero } from './components/AtelierHero';
import { CakeCarousel } from './components/CakeCarousel';
import { CakeBuilder } from './components/CakeBuilder';
import { IngredientsCatalog } from './components/IngredientsCatalog';
import { Footer } from './components/Footer';
import { exportCakeToPDF } from './utils/pdfExport';
import { Sparkles, X } from 'lucide-react';
import { sounds } from './utils/audioEffects';

const LOCAL_STORAGE_KEY =
  import.meta.env.VITE_STORAGE_KEY || 'pastelchef_game_cakes_v2';

export default function App() {
  const [cakes, setCakes] = useState<CustomCake[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // storage fallback
    }
    return INITIAL_CAKES;
  });

  const [selectedCakeId, setSelectedCakeId] = useState<string>(() => {
    return cakes[0]?.id || 'cake-sofia-birthday';
  });

  const [activeView, setActiveView] = useState<'builder' | 'gallery'>('builder');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cakes));
    } catch {
      // storage error
    }
  }, [cakes]);

  const currentCake = cakes.find((c) => c.id === selectedCakeId) || cakes[0] || INITIAL_CAKES[0];

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleCreateNewCake = () => {
    sounds.playSparkle();
    const newId = `cake-${Date.now()}`;
    const newNumber = cakes.length + 1;
    const newCake: CustomCake = {
      id: newId,
      name: `Pastel Mágico #${newNumber}`,
      currentStep: 1,
      shapeId: 'round',
      spongeId: 'vanilla',
      fillingId: 'berry_compote',
      frostingId: 'silk_buttercream',
      toppingIds: [],
      customMessage: '',
      candlesLit: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCakes((prev) => [newCake, ...prev]);
    setSelectedCakeId(newId);
    setActiveView('builder');
    showToast(`¡Nuevo pastel listo: "${newCake.name}"! 🎂`);
  };

  const handleDuplicateCake = (sourceCake: CustomCake) => {
    sounds.playPop();
    const newId = `cake-${Date.now()}`;
    const duplicatedCake: CustomCake = {
      ...sourceCake,
      id: newId,
      name: `${sourceCake.name} (Copia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCakes((prev) => [duplicatedCake, ...prev]);
    setSelectedCakeId(newId);
    showToast(`¡Copia creada con éxito! ✨`);
  };

  const handleDeleteCake = (cakeId: string) => {
    if (cakes.length <= 1) {
      showToast('¡No puedes borrar tu único pastel!');
      return;
    }

    const remaining = cakes.filter((c) => c.id !== cakeId);
    setCakes(remaining);
    if (selectedCakeId === cakeId) {
      setSelectedCakeId(remaining[0].id);
    }
    showToast('Pastel eliminado de tu cocina.');
  };

  const handleRenameCake = (cakeId: string, newName: string) => {
    setCakes((prev) =>
      prev.map((c) =>
        c.id === cakeId
          ? { ...c, name: newName, updatedAt: new Date().toISOString() }
          : c
      )
    );
    showToast(`Nombre cambiado a: "${newName}" 🏷️`);
  };

  const handleUpdateCake = (updatedCake: CustomCake) => {
    setCakes((prev) =>
      prev.map((c) => (c.id === updatedCake.id ? updatedCake : c))
    );
  };

  const handleSelectCake = (cakeId: string) => {
    setSelectedCakeId(cakeId);
  };

  const handleEditCake = (cakeId: string) => {
    setSelectedCakeId(cakeId);
    setActiveView('builder');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleExportPDF = async (cake: CustomCake) => {
    try {
      showToast('¡Preparando tu diploma de chef en PDF! 📄');
      await exportCakeToPDF(cake, `cake-visualizer-${cake.id}`);
      showToast(`¡Diploma de "${cake.name}" descargado! 🎉`);
    } catch {
      showToast('Hubo un pequeño problema al descargar el diploma. Reintenta.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9FB] text-gray-800 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 bg-[#FF477E] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-black animate-bounce-short">
          <Sparkles className="w-4 h-4 text-yellow-300 shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-pink-200 hover:text-white ml-1.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Cheerful Navigation Header */}
      <Header
        onNewCake={handleCreateNewCake}
        activeView={activeView}
        onToggleView={(view) => setActiveView(view)}
        totalCakes={cakes.length}
      />

      {/* Hero with playful cake kitchen banner */}
      <AtelierHero
        onStartCreating={() => {
          setActiveView('builder');
          window.scrollTo({ top: 360, behavior: 'smooth' });
        }}
        totalCakes={cakes.length}
      />

      {/* Multi-cake Carousel */}
      <CakeCarousel
        cakes={cakes}
        selectedCakeId={selectedCakeId}
        onSelectCake={handleSelectCake}
        onEditCake={handleEditCake}
        onCreateNewCake={handleCreateNewCake}
        onDuplicateCake={handleDuplicateCake}
        onDeleteCake={handleDeleteCake}
        onRenameCake={handleRenameCake}
        onExportPDF={handleExportPDF}
      />

      {/* Main Step-by-Step Creation Workspace */}
      <main className="flex-1 w-full bg-[#FFF9FB]">
        {currentCake && (
          <CakeBuilder
            cake={currentCake}
            onUpdateCake={handleUpdateCake}
            onExportPDF={handleExportPDF}
            onBackToGallery={() => {
              window.scrollTo({ top: 180, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Ingredients Pantry */}
      <IngredientsCatalog />

      {/* Playful Footer */}
      <Footer />
    </div>
  );
}
