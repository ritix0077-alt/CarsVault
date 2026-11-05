import React from 'react';
import { BRANDS } from '../data/cars';
import { BrandId } from '../types/car';
import { ArrowRight, Sparkles, Gauge, Compass } from 'lucide-react';

interface HeroGrandProps {
  onSelectBrand: (brandId: BrandId) => void;
  onExploreCollection: () => void;
}

export const HeroGrand: React.FC<HeroGrandProps> = ({
  onSelectBrand,
  onExploreCollection,
}) => {
  return (
    <section className="relative w-full overflow-hidden bg-[#0C0A08] border-b border-[#D4AF37]/20">
      {/* Background Hero Media with measured luxury scrim */}
      <div className="relative w-full h-[520px] md:h-[620px] lg:h-[700px] overflow-hidden">
        <img
          src="/src/assets/images/hero_hypercar_grand_1793904085783.jpg"
          alt="Aurelia Hypercar Anthology Exhibition Hall"
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Measured scrim for pristine 4.5:1 text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A08] via-[#0C0A08]/70 to-[#0C0A08]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C0A08]/90 via-[#0C0A08]/40 to-transparent" />

        {/* Content Overlay */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-6 flex flex-col justify-end pb-16 md:pb-24">
          <div className="max-w-3xl">
            {/* Clean unboxed kicker */}
            <div className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[#D4AF37] font-semibold mb-4">
              <span>The Grand Anthology</span>
              <span aria-hidden="true">·</span>
              <span>Volume MMXXVI</span>
              <span aria-hidden="true">·</span>
              <span>Pure Automotive Art</span>
            </div>

            {/* Headline with clamp sizing and text-wrap balance */}
            <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FAF7F2] leading-[1.08] mb-6 [text-wrap:balance]">
              Engineering Perfection. <br />
              <span className="text-gold-gradient">The World’s Greatest Marques.</span>
            </h1>

            {/* Value Proposition */}
            <p className="text-base sm:text-lg text-[#C8BFB2] font-normal leading-relaxed max-w-2xl mb-8">
              A curated archive of history’s most revered sports and hypercar icons. From Ayrton Senna’s high-revving Honda VTEC skunkworks to Weissach’s 9,000 RPM track monsters and Maranello’s atmospheric V12 symphonies.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreCollection}
                className="inline-flex items-center gap-3 px-6 py-3.5 text-xs tracking-[0.16em] uppercase font-semibold text-[#0C0A08] bg-gold-gradient rounded-sm hover:brightness-110 transition-all shadow-md cursor-pointer"
              >
                <span>Explore Full Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectBrand('honda')}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-xs tracking-[0.16em] uppercase font-medium text-[#FAF7F2] border border-[#FAF7F2]/20 hover:border-[#D4AF37] hover:text-[#D4AF37] bg-white/5 backdrop-blur-sm rounded-sm transition-colors cursor-pointer"
              >
                <span>Enter Honda Skunkworks</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee Brand Selector Strip */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between border-b border-[#D4AF37]/15 pb-4 mb-6">
          <div className="text-xs uppercase tracking-[0.2em] text-[#A89F91] font-medium">
            Select a Dedicated Manufacturer Archive
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Strict Marque Segregation Guaranteed</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          {BRANDS.map((brand) => (
            <button
              key={brand.id}
              onClick={() => onSelectBrand(brand.id)}
              className="group text-left p-4 sm:p-5 bg-[#14110E] hover:bg-[#1C1713] border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 rounded-sm transition-all duration-300 relative overflow-hidden cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] tracking-[0.18em] uppercase text-[#A89F91]">
                  Est. {brand.foundingYear}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#FAF7F2] group-hover:text-[#D4AF37] transition-colors mb-1">
                {brand.name}
              </h3>
              <p className="text-xs text-[#A89F91] line-clamp-2 mb-3">
                {brand.motto}
              </p>
              <div className="pt-2 border-t border-[#D4AF37]/10 flex items-center justify-between text-[11px] text-[#C8BFB2]">
                <span className="truncate">{brand.headquarters.split(',')[0]}</span>
                <span className="text-[#D4AF37] font-mono-tech">Archive →</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
