import React, { useState } from 'react';
import { Car } from '../types/car';
import { calculatePowerToWeight, formatPrice } from '../utils/carLogic';
import { Volume2, GitCompare, ArrowUpRight, Gauge, Zap, Weight, Disc } from 'lucide-react';

interface CarCardProps {
  car: Car;
  onInspect: (car: Car) => void;
  onPlaySound: (car: Car) => void;
  onToggleCompare: (car: Car) => void;
  isCompared: boolean;
}

export const CarCard: React.FC<CarCardProps> = ({
  car,
  onInspect,
  onPlaySound,
  onToggleCompare,
  isCompared,
}) => {
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const powerToWeight = calculatePowerToWeight(car.specs.horsepower, car.specs.curbWeightLbs);

  return (
    <article className="group bg-[#14110E] border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 rounded-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_12px_30px_-10px_rgba(212,175,55,0.18)]">
      {/* 16:9 Curated Photography Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0C0A08]">
        <img
          src={car.heroImage}
          alt={car.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Measured gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#14110E] via-transparent to-black/20 pointer-events-none" />

        {/* Brand & Year unboxed kicker over image */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[11px] font-medium text-[#FAF7F2] bg-[#0C0A08]/75 backdrop-blur-md px-2.5 py-1 border border-[#D4AF37]/20 rounded-sm">
          <span className="text-[#D4AF37] font-semibold">{car.brandName}</span>
          <span aria-hidden="true" className="text-[#A89F91]">·</span>
          <span className="text-[#A89F91]">{car.modelYear}</span>
        </div>

        {/* MSRP / Badge on Top Right */}
        <div className="absolute top-3 right-3 text-[11px] font-mono-tech text-[#D4AF37] bg-[#0C0A08]/75 backdrop-blur-md px-2.5 py-1 border border-[#D4AF37]/20 rounded-sm">
          {formatPrice(car.specs.msrpUsd)}
        </div>

        {/* Sound audition button overlay */}
        <button
          onClick={() => onPlaySound(car)}
          className="absolute bottom-3 right-3 p-2 bg-[#0C0A08]/85 text-[#D4AF37] hover:text-[#FAF7F2] hover:bg-[#D4AF37] hover:text-[#0C0A08] border border-[#D4AF37]/30 rounded-sm backdrop-blur-md transition-all cursor-pointer"
          title={`Listen to ${car.name} exhaust notes`}
          aria-label={`Audition sound for ${car.name}`}
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata Line (Strictly No Pills) */}
          <div className="flex items-center gap-2 text-xs text-[#A89F91] mb-1.5">
            <span>{car.specs.drivetrain}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{car.specs.transmission.split(' ')[0]}</span>
            <span aria-hidden="true">·</span>
            <span>{car.specs.redlineRpm.toLocaleString()} RPM</span>
          </div>

          {/* Simple, crisp car name as requested */}
          <h3 className="font-serif-luxury text-xl font-bold text-[#FAF7F2] group-hover:text-[#D4AF37] transition-colors mb-1">
            {car.name}
          </h3>

          <p className="font-editorial italic text-xs text-[#C8BFB2] line-clamp-1 mb-4">
            {car.tagline}
          </p>

          {/* Engineering Key Spec Grid */}
          <div className="grid grid-cols-4 gap-2 py-3 px-3 bg-[#0C0A08] border border-[#D4AF37]/15 rounded-sm mb-4">
            <div className="text-center">
              <div className="text-[10px] text-[#A89F91] uppercase tracking-wider mb-0.5">BHP</div>
              <div className="font-mono-tech font-bold text-sm text-[#D4AF37]">
                {car.specs.horsepower}
              </div>
            </div>

            <div className="text-center border-l border-white/5">
              <div className="text-[10px] text-[#A89F91] uppercase tracking-wider mb-0.5">0-60</div>
              <div className="font-mono-tech font-bold text-sm text-[#FAF7F2]">
                {car.specs.zeroToSixty}s
              </div>
            </div>

            <div className="text-center border-l border-white/5">
              <div className="text-[10px] text-[#A89F91] uppercase tracking-wider mb-0.5">TOP</div>
              <div className="font-mono-tech font-bold text-sm text-[#FAF7F2]">
                {car.specs.topSpeed} <span className="text-[9px] text-[#A89F91]">mph</span>
              </div>
            </div>

            <div className="text-center border-l border-white/5">
              <div className="text-[10px] text-[#A89F91] uppercase tracking-wider mb-0.5">PWR/WT</div>
              <div className="font-mono-tech font-bold text-sm text-[#DFBE6C]">
                {powerToWeight}
              </div>
            </div>
          </div>

          {/* Engine description snippet */}
          <p className="text-xs text-[#A89F91] line-clamp-2 leading-relaxed mb-4">
            {car.overview}
          </p>
        </div>

        {/* Card Footer: Color Swatches & Action Buttons */}
        <div className="pt-3 border-t border-[#D4AF37]/15 flex items-center justify-between gap-3">
          {/* Finish swatches preview */}
          <div className="flex items-center gap-1.5" title={`Available finishes: ${car.colorOptions.length}`}>
            {car.colorOptions.slice(0, 4).map((col, idx) => (
              <button
                key={col.name}
                onClick={() => setActiveColorIndex(idx)}
                className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                  activeColorIndex === idx
                    ? 'border-[#D4AF37] scale-110 ring-1 ring-[#D4AF37]'
                    : 'border-white/20 hover:scale-105'
                }`}
                style={{ backgroundColor: col.hex }}
                aria-label={`Select finish ${col.name}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Compare toggle */}
            <button
              onClick={() => onToggleCompare(car)}
              className={`p-2 text-xs rounded-sm border transition-colors cursor-pointer ${
                isCompared
                  ? 'bg-[#D4AF37] text-[#0C0A08] border-[#D4AF37]'
                  : 'bg-white/5 text-[#A89F91] hover:text-[#FAF7F2] border-white/10 hover:border-[#D4AF37]/40'
              }`}
              title={isCompared ? 'Remove from comparison' : 'Add to comparison'}
              aria-label={isCompared ? `Remove ${car.name} from comparison` : `Add ${car.name} to comparison`}
            >
              <GitCompare className="w-3.5 h-3.5" />
            </button>

            {/* Inspect specs modal trigger */}
            <button
              onClick={() => onInspect(car)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase text-[#0C0A08] bg-gold-gradient rounded-sm hover:brightness-110 transition-all cursor-pointer"
            >
              <span>Specs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
