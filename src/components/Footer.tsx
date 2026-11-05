import React from 'react';
import { BrandId } from '../types/car';

interface FooterProps {
  onSelectBrand: (brandId: BrandId) => void;
  onOpenSoundStudio: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectBrand,
  onOpenSoundStudio,
}) => {
  return (
    <footer className="w-full bg-[#080605] border-t border-[#D4AF37]/20 pt-16 pb-12 text-[#A89F91]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/5">
          {/* Col 1: Wordmark & Statement */}
          <div className="space-y-4">
            <span className="font-serif-luxury text-2xl font-bold tracking-[0.22em] text-[#FAF7F2] block">
              AURELIA
            </span>
            <p className="text-xs leading-relaxed text-[#8E8578]">
              The definitive private digital archive dedicated to the preservation, engineering analysis, and acoustic harmonics of history's most extraordinary automobiles.
            </p>
            <div className="text-[11px] text-[#D4AF37] tracking-wider uppercase font-medium">
              Curated in London, Tokyo & Maranello
            </div>
          </div>

          {/* Col 2: Manufacturer Archives */}
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#FAF7F2] font-semibold mb-4">
              Marque Monograms
            </div>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onSelectBrand('honda')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Honda · VTEC & Type R Heritage
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectBrand('porsche')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Porsche · Weissach Motorsport
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectBrand('ferrari')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Ferrari · Maranello V12 Icons
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectBrand('aston-martin')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Aston Martin · British Grandeur
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectBrand('lamborghini')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Lamborghini · Sant’Agata Bulls
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Technical Features */}
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#FAF7F2] font-semibold mb-4">
              Exhibition Features
            </div>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={onOpenSoundStudio}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Acoustic Exhaust Studio (Web Audio)
                </button>
              </li>
              <li>
                <span className="text-[#8E8578]">
                  Side-by-Side Spec Comparison Lounge
                </span>
              </li>
              <li>
                <span className="text-[#8E8578]">
                  Verified Dyno & Downforce Curves
                </span>
              </li>
              <li>
                <span className="text-[#8E8578]">
                  Formula 1 & Le Mans Racing Pedigrees
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Curation Standards */}
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#FAF7F2] font-semibold mb-4">
              Curation Standard
            </div>
            <p className="text-xs leading-relaxed text-[#8E8578] mb-3">
              Every specification is sourced directly from OEM technical press packets and homologation documents. Zero AI placeholder imagery or synthetic specs.
            </p>
            <div className="text-[11px] font-mono-tech text-[#C8BFB2]">
              Strict Marque Isolation Protocol
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8E8578]">
          <div>
            © {new Date().getFullYear()} AURELIA Automotive Anthology. All trademarks and brand names belong to their respective manufacturers.
          </div>
          <div className="flex items-center gap-6">
            <span>Privately Archived</span>
            <span>·</span>
            <span>High-Fidelity Curated Audio</span>
            <span>·</span>
            <span className="text-[#D4AF37]">MMXXVI Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
