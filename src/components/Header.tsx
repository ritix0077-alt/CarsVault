import React, { useState } from 'react';
import { BrandId } from '../types/car';
import { Volume2, GitCompare, Menu, X } from 'lucide-react';

interface HeaderProps {
  activeBrand: BrandId;
  onSelectBrand: (brandId: BrandId) => void;
  onOpenSoundStudio: () => void;
  onOpenComparison: () => void;
  comparisonCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeBrand,
  onSelectBrand,
  onOpenSoundStudio,
  onOpenComparison,
  comparisonCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: BrandId; label: string }[] = [
    { id: 'all', label: 'All Marques' },
    { id: 'honda', label: 'Honda' },
    { id: 'porsche', label: 'Porsche' },
    { id: 'ferrari', label: 'Ferrari' },
    { id: 'aston-martin', label: 'Aston Martin' },
    { id: 'lamborghini', label: 'Lamborghini' },
  ];

  const handleNavClick = (id: BrandId) => {
    onSelectBrand(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0C0A08]/90 backdrop-blur-md border-b border-[#D4AF37]/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element brand wordmark */}
        <button
          onClick={() => handleNavClick('all')}
          className="text-left group cursor-pointer focus:outline-none"
          aria-label="Aurelia Automotive Anthology Home"
        >
          <span className="font-serif-luxury text-xl md:text-2xl font-bold tracking-[0.22em] text-[#FAF7F2] group-hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0">
            AURELIA
          </span>
        </button>

        {/* Zone 2: 4–6 concise single-line nav links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs tracking-[0.14em] uppercase font-medium">
          {navLinks.map((link) => {
            const isActive = activeBrand === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`transition-colors whitespace-nowrap shrink-0 relative py-1 focus:outline-none cursor-pointer ${
                  isActive
                    ? 'text-[#D4AF37] font-semibold'
                    : 'text-[#A89F91] hover:text-[#FAF7F2]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Actions Group */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSoundStudio}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs tracking-wider uppercase font-semibold text-[#D4AF37] border border-[#D4AF37]/30 rounded-sm hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Open Exhaust Acoustic Studio"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Sound Studio</span>
          </button>

          <button
            onClick={onOpenComparison}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs tracking-wider uppercase font-semibold text-[#0C0A08] bg-gold-gradient rounded-sm hover:brightness-110 shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>
              Duel {comparisonCount > 0 ? `(${comparisonCount})` : ''}
            </span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#A89F91] hover:text-[#FAF7F2] focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#120F0D] border-b border-[#D4AF37]/25 px-6 py-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-3 py-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left text-sm tracking-wider uppercase py-2 px-3 rounded transition-colors ${
                  activeBrand === link.id
                    ? 'text-[#D4AF37] bg-[#D4AF37]/10 font-semibold'
                    : 'text-[#C8BFB2] hover:text-[#FAF7F2] hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 border-t border-[#D4AF37]/15 flex items-center justify-between">
              <button
                onClick={() => {
                  onOpenSoundStudio();
                  setMobileMenuOpen(false);
                }}
                className="inline-flex items-center gap-2 text-xs text-[#D4AF37] py-2"
              >
                <Volume2 className="w-4 h-4" />
                Exhaust Acoustics Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
