import React from 'react';
import { BrandInfo, Car } from '../types/car';
import { ArrowLeft, Award, Cpu, ShieldCheck, MapPin } from 'lucide-react';

interface BrandHeroProps {
  brand: BrandInfo;
  brandCars: Car[];
  onBackToAll: () => void;
}

export const BrandHero: React.FC<BrandHeroProps> = ({
  brand,
  brandCars,
  onBackToAll,
}) => {
  const totalHp = brandCars.reduce((sum, c) => sum + c.specs.horsepower, 0);
  const avgZeroSixty = (
    brandCars.reduce((sum, c) => sum + c.specs.zeroToSixty, 0) / (brandCars.length || 1)
  ).toFixed(1);

  return (
    <div className="relative w-full overflow-hidden bg-[#0C0A08] border-b border-[#D4AF37]/25">
      {/* Brand Hero Media Banner */}
      <div className="relative w-full h-[400px] md:h-[480px] lg:h-[540px] overflow-hidden">
        <img
          src={brand.heroImage}
          alt={`${brand.name} Heritage Archive`}
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Measured scrim for 4.5:1 text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A08] via-[#0C0A08]/75 to-[#0C0A08]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C0A08]/90 via-[#0C0A08]/40 to-transparent" />

        {/* Content Overlay */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-6 flex flex-col justify-between py-8 md:py-12">
          {/* Back Button */}
          <div>
            <button
              onClick={onBackToAll}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#C8BFB2] hover:text-[#D4AF37] px-3 py-1.5 bg-[#0C0A08]/70 border border-[#D4AF37]/25 rounded-sm backdrop-blur-sm transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Marques</span>
            </button>
          </div>

          <div className="max-w-3xl">
            {/* Unboxed metadata kicker */}
            <div className="flex items-center gap-2 text-xs tracking-[0.22em] uppercase text-[#D4AF37] font-semibold mb-3">
              <span>Manufacturer Monograph</span>
              <span aria-hidden="true">·</span>
              <span>Founded {brand.foundingYear}</span>
              <span aria-hidden="true">·</span>
              <span>{brandCars.length} Purebred Models</span>
            </div>

            <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FAF7F2] mb-3 [text-wrap:balance]">
              {brand.name}
            </h1>

            <p className="font-editorial italic text-lg sm:text-xl text-[#DFBE6C] mb-4">
              “{brand.motto}”
            </p>

            <p className="text-sm sm:text-base text-[#C8BFB2] font-normal leading-relaxed max-w-2xl">
              {brand.heritageText}
            </p>
          </div>
        </div>
      </div>

      {/* Brand Quick Telemetry Strip */}
      <div className="max-w-7xl mx-auto px-6 py-6 border-t border-[#D4AF37]/15 bg-[#120F0D]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div>
            <div className="flex items-center gap-1.5 text-[#A89F91] uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Headquarters</span>
            </div>
            <div className="font-medium text-[#FAF7F2] text-sm truncate">
              {brand.headquarters}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-[#A89F91] uppercase tracking-wider mb-1">
              <Cpu className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Hallmark Technology</span>
            </div>
            <div className="font-medium text-[#FAF7F2] text-sm truncate">
              {brand.hallmarkTech}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-[#A89F91] uppercase tracking-wider mb-1">
              <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Archive Horsepower</span>
            </div>
            <div className="font-mono-tech text-base font-bold text-[#D4AF37]">
              {totalHp.toLocaleString()} BHP
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-[#A89F91] uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Avg 0-60 Time</span>
            </div>
            <div className="font-mono-tech text-base font-bold text-[#FAF7F2]">
              {avgZeroSixty}s
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
