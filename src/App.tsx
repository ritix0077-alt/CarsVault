import React, { useState, useMemo, useRef } from 'react';
import { CARS, BRANDS } from './data/cars';
import { BrandId, Car } from './types/car';
import { filterCars, sortCars, SortKey } from './utils/carLogic';
import { Header } from './components/Header';
import { HeroGrand } from './components/HeroGrand';
import { BrandHero } from './components/BrandHero';
import { FilterBar } from './components/FilterBar';
import { CarCard } from './components/CarCard';
import { CarDetailModal } from './components/CarDetailModal';
import { SoundStudioModal } from './components/SoundStudioModal';
import { ComparisonDrawer } from './components/ComparisonDrawer';
import { Footer } from './components/Footer';
import { audioSynth } from './utils/audioSynth';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function App() {
  const [activeBrand, setActiveBrand] = useState<BrandId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [drivetrain, setDrivetrain] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('hp-desc');

  // Modals & Drawers
  const [inspectedCar, setInspectedCar] = useState<Car | null>(null);
  const [isSoundStudioOpen, setIsSoundStudioOpen] = useState<boolean>(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);
  const [comparedCars, setComparedCars] = useState<Car[]>([]);

  const collectionRef = useRef<HTMLDivElement>(null);

  // Filter and sort cars
  const filteredAndSortedCars = useMemo(() => {
    const filtered = filterCars(CARS, {
      brandId: activeBrand,
      searchQuery,
      drivetrain,
    });
    return sortCars(filtered, sortKey);
  }, [activeBrand, searchQuery, drivetrain, sortKey]);

  // Selected brand object
  const currentBrandInfo = useMemo(() => {
    if (activeBrand === 'all') return null;
    return BRANDS.find((b) => b.id === activeBrand) || null;
  }, [activeBrand]);

  const brandCars = useMemo(() => {
    if (activeBrand === 'all') return [];
    return CARS.filter((c) => c.brandId === activeBrand);
  }, [activeBrand]);

  const handleSelectBrand = (brandId: BrandId) => {
    setActiveBrand(brandId);
    setSearchQuery('');
    setDrivetrain('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreCollection = () => {
    if (collectionRef.current) {
      collectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleCompare = (car: Car) => {
    setComparedCars((prev) => {
      const exists = prev.some((c) => c.id === car.id);
      if (exists) {
        return prev.filter((c) => c.id !== car.id);
      }
      if (prev.length >= 3) {
        // limit to 3 contenders
        return [prev[1], prev[2], car];
      }
      return [...prev, car];
    });
  };

  const handlePlaySound = (car: Car) => {
    setInspectedCar(car);
  };

  const handleResetFilters = () => {
    setActiveBrand('all');
    setSearchQuery('');
    setDrivetrain('all');
    setSortKey('hp-desc');
  };

  return (
    <div className="min-h-screen bg-[#0C0A08] text-[#FAF7F2] flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-[#FFF5DC]">
      {/* 3-Zone Top Bar Navigation */}
      <Header
        activeBrand={activeBrand}
        onSelectBrand={handleSelectBrand}
        onOpenSoundStudio={() => setIsSoundStudioOpen(true)}
        onOpenComparison={() => setIsComparisonOpen(true)}
        comparisonCount={comparedCars.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Dynamic Hero: Grand Showcase vs Dedicated Brand Monograph */}
        {activeBrand === 'all' ? (
          <HeroGrand
            onSelectBrand={handleSelectBrand}
            onExploreCollection={handleExploreCollection}
          />
        ) : currentBrandInfo ? (
          <BrandHero
            brand={currentBrandInfo}
            brandCars={brandCars}
            onBackToAll={() => handleSelectBrand('all')}
          />
        ) : null}

        {/* Global Filter Bar */}
        <div ref={collectionRef}>
          <FilterBar
            activeBrand={activeBrand}
            onSelectBrand={handleSelectBrand}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            drivetrain={drivetrain}
            onDrivetrainChange={setDrivetrain}
            sortKey={sortKey}
            onSortChange={setSortKey}
            totalResults={filteredAndSortedCars.length}
            onReset={handleResetFilters}
          />
        </div>

        {/* Gallery / Car Grid Container */}
        <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          {/* Section Kicker & Title */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#D4AF37]/15">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-[#D4AF37] font-semibold mb-1">
                {activeBrand === 'all'
                  ? 'Complete Grand Anthology'
                  : `${currentBrandInfo?.name} Specific Vault`}
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#FAF7F2]">
                {activeBrand === 'all'
                  ? 'Curated Engineering Hall of Fame'
                  : `Authenticated ${currentBrandInfo?.name} Production Icons`}
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#A89F91]">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Strict Model Integrity Verified</span>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredAndSortedCars.length === 0 ? (
            <div className="text-center py-20 border border-[#D4AF37]/20 rounded-sm bg-[#14110E] p-8">
              <Zap className="w-10 h-10 text-[#D4AF37]/40 mx-auto mb-3" />
              <h3 className="font-serif-luxury text-xl font-bold text-[#FAF7F2] mb-2">
                No Machines Match Specified Parameters
              </h3>
              <p className="text-xs text-[#A89F91] max-w-md mx-auto mb-6">
                Try loosening your search term or reset filters to view all curated vehicles.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 text-xs font-semibold tracking-wider uppercase text-[#0C0A08] bg-gold-gradient rounded-sm cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredAndSortedCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  onInspect={(c) => setInspectedCar(c)}
                  onPlaySound={handlePlaySound}
                  onToggleCompare={handleToggleCompare}
                  isCompared={comparedCars.some((c) => c.id === car.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Brand Spotlight Feature Strip (when on 'all' view) */}
        {activeBrand === 'all' && (
          <section className="w-full bg-[#120F0D] border-t border-[#D4AF37]/20 py-16">
            <div className="max-w-7xl mx-auto px-6">
              <div className="max-w-2xl mb-10">
                <span className="text-xs uppercase tracking-[0.22em] text-[#D4AF37] font-semibold block mb-2">
                  Special Focus
                </span>
                <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#FAF7F2] mb-3">
                  The Honda Engineering Philosophy
                </h2>
                <p className="text-sm text-[#C8BFB2] leading-relaxed">
                  Unlike traditional exotics that prioritized sheer displacement, Honda proved that lightweight chassis rigidity, Formula 1 valve train telemetry, and high-cam VTEC harmonics could conquer the Nürburgring and Suzuka.
                </p>
              </div>

              {/* Honda Spotlight Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-[#0C0A08] border border-[#D4AF37]/25 rounded-sm">
                  <div className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-mono-tech mb-2">
                    01 · VTEC Cam Crossover
                  </div>
                  <h3 className="font-serif-luxury text-lg font-bold text-[#FAF7F2] mb-2">
                    Dual Profile Hydraulics
                  </h3>
                  <p className="text-xs text-[#A89F91] leading-relaxed">
                    Hydraulic locking pins engage wild cam lobes at 5,800+ RPM, transforming docile city drivability into race-track breathing.
                  </p>
                </div>

                <div className="p-6 bg-[#0C0A08] border border-[#D4AF37]/25 rounded-sm">
                  <div className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-mono-tech mb-2">
                    02 · Hand-Ported Heads
                  </div>
                  <h3 className="font-serif-luxury text-lg font-bold text-[#FAF7F2] mb-2">
                    Artisan Flow Benches
                  </h3>
                  <p className="text-xs text-[#A89F91] leading-relaxed">
                    Every Integra Type R intake and exhaust port was hand-smoothed by master Honda engine builders in Suzuka, Japan.
                  </p>
                </div>

                <div className="p-6 bg-[#0C0A08] border border-[#D4AF37]/25 rounded-sm">
                  <div className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-mono-tech mb-2">
                    03 · Ayrton Senna's Rigidity
                  </div>
                  <h3 className="font-serif-luxury text-lg font-bold text-[#FAF7F2] mb-2">
                    50% Stiffer Monocoque
                  </h3>
                  <p className="text-xs text-[#A89F91] leading-relaxed">
                    Senna's legendary Suzuka test drive led Honda engineers to double the NSX chassis stiffness, pioneering the world's first all-aluminum supercar monocoque.
                  </p>
                </div>
              </div>

              <div className="mt-8 text-center sm:text-left">
                <button
                  onClick={() => handleSelectBrand('honda')}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-semibold text-[#D4AF37] hover:text-[#FAF7F2] transition-colors cursor-pointer"
                >
                  <span>Explore All Honda Models & Specs</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Modals & Overlays */}
      <CarDetailModal
        car={inspectedCar}
        onClose={() => setInspectedCar(null)}
        onToggleCompare={handleToggleCompare}
        isCompared={inspectedCar ? comparedCars.some((c) => c.id === inspectedCar.id) : false}
      />

      <SoundStudioModal
        isOpen={isSoundStudioOpen}
        onClose={() => setIsSoundStudioOpen(false)}
      />

      <ComparisonDrawer
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        comparedCars={comparedCars}
        onRemoveCar={(id) => setComparedCars((prev) => prev.filter((c) => c.id !== id))}
        onClearAll={() => setComparedCars([])}
        onAddCar={(car) => handleToggleCompare(car)}
      />

      {/* Luxury Quiet Footer */}
      <Footer
        onSelectBrand={handleSelectBrand}
        onOpenSoundStudio={() => setIsSoundStudioOpen(true)}
      />
    </div>
  );
}
