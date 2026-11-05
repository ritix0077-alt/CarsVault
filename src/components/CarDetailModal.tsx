import React, { useState, useEffect } from 'react';
import { Car } from '../types/car';
import { calculatePowerToWeight, formatPrice } from '../utils/carLogic';
import { audioSynth } from '../utils/audioSynth';
import { X, Volume2, VolumeX, GitCompare, Gauge, Zap, Shield, Sparkles } from 'lucide-react';

interface CarDetailModalProps {
  car: Car | null;
  onClose: () => void;
  onToggleCompare: (car: Car) => void;
  isCompared: boolean;
}

export const CarDetailModal: React.FC<CarDetailModalProps> = ({
  car,
  onClose,
  onToggleCompare,
  isCompared,
}) => {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [isEngineRunning, setIsEngineRunning] = useState(false);
  const [currentRpm, setCurrentRpm] = useState(1000);
  const [throttle, setThrottle] = useState(0);

  useEffect(() => {
    // Reset state on car change
    setSelectedColorIdx(0);
    setIsEngineRunning(false);
    setCurrentRpm(1000);
    setThrottle(0);

    return () => {
      audioSynth.stop();
    };
  }, [car]);

  if (!car) return null;

  const powerToWeight = calculatePowerToWeight(car.specs.horsepower, car.specs.curbWeightLbs);
  const selectedColor = car.colorOptions[selectedColorIdx] || car.colorOptions[0];

  const handleToggleSound = () => {
    if (isEngineRunning) {
      audioSynth.stop();
      setIsEngineRunning(false);
      setCurrentRpm(1000);
      setThrottle(0);
    } else {
      audioSynth.start(car.soundProfile, (rpm) => {
        setCurrentRpm(rpm);
      });
      setIsEngineRunning(true);
    }
  };

  const handleThrottleDown = () => {
    if (!isEngineRunning) {
      handleToggleSound();
    }
    setThrottle(1.0);
    audioSynth.setThrottle(1.0);
  };

  const handleThrottleUp = () => {
    setThrottle(0.0);
    audioSynth.setThrottle(0.0);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="car-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#120F0D] border border-[#D4AF37]/40 rounded-sm shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D4AF37]/20 bg-[#16120F]">
          <div className="flex items-center gap-3">
            <span className="font-serif-luxury text-sm tracking-[0.2em] uppercase text-[#D4AF37] font-semibold">
              {car.brandName} Monograph
            </span>
            <span aria-hidden="true" className="text-[#A89F91]">·</span>
            <span className="text-xs text-[#A89F91]">{car.modelYear} Specification Sheet</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#A89F91] hover:text-[#FAF7F2] hover:bg-white/10 rounded-sm transition-colors cursor-pointer"
            aria-label="Close specification sheet"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Visual Studio */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0C0A08]">
          <img
            src={car.heroImage}
            alt={car.name}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#120F0D] via-transparent to-black/30 pointer-events-none" />

          {/* Color Switcher Bar overlay on bottom of media */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center justify-between gap-3 bg-[#0C0A08]/85 backdrop-blur-md p-3 border border-[#D4AF37]/25 rounded-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-[#A89F91]">Finish:</span>
              <span className="text-xs font-medium text-[#FAF7F2]">{selectedColor.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {car.colorOptions.map((col, idx) => (
                <button
                  key={col.name}
                  onClick={() => setSelectedColorIdx(idx)}
                  className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                    selectedColorIdx === idx
                      ? 'border-[#D4AF37] scale-125 ring-2 ring-[#D4AF37]/50'
                      : 'border-white/20 hover:scale-110'
                  }`}
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                  aria-label={`View in ${col.name}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 md:p-8 space-y-8 max-h-[60vh] overflow-y-auto">
          {/* Title & Tagline */}
          <div className="border-b border-[#D4AF37]/15 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-[#D4AF37] mb-1">
                {car.brandName} Halo Series
              </div>
              <h2 id="car-modal-title" className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#FAF7F2]">
                {car.name}
              </h2>
              <p className="font-editorial italic text-base text-[#C8BFB2] mt-1">
                {car.tagline}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggleCompare(car)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium tracking-wider uppercase rounded-sm border transition-colors cursor-pointer ${
                  isCompared
                    ? 'bg-[#D4AF37] text-[#0C0A08] border-[#D4AF37]'
                    : 'bg-white/5 text-[#FAF7F2] hover:border-[#D4AF37] border-white/10'
                }`}
              >
                <GitCompare className="w-4 h-4" />
                <span>{isCompared ? 'Compared' : 'Add to Duel'}</span>
              </button>

              <div className="text-right">
                <div className="text-[10px] text-[#A89F91] uppercase tracking-wider">Base MSRP</div>
                <div className="font-mono-tech text-xl font-bold text-[#D4AF37]">
                  {formatPrice(car.specs.msrpUsd)}
                </div>
              </div>
            </div>
          </div>

          {/* Engine Audio Interactive Station */}
          <div className="p-5 bg-[#181410] border border-[#D4AF37]/30 rounded-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleSound}
                  className={`p-3 rounded-sm border transition-all cursor-pointer ${
                    isEngineRunning
                      ? 'bg-[#D4AF37] text-[#0C0A08] border-[#D4AF37]'
                      : 'bg-[#0C0A08] text-[#D4AF37] border-[#D4AF37]/40 hover:border-[#D4AF37]'
                  }`}
                  aria-label={isEngineRunning ? 'Mute engine' : 'Ignite engine audio'}
                >
                  {isEngineRunning ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
                </button>
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-[#FAF7F2]">
                    Acoustic Exhaust Telemetry
                  </div>
                  <div className="text-xs text-[#A89F91]">
                    {car.soundProfile.exhaustDescription}
                  </div>
                </div>
              </div>

              {/* Tachometer needle read */}
              <div className="flex items-center gap-4 bg-[#0C0A08] px-4 py-2 border border-[#D4AF37]/20 rounded-sm">
                <Gauge className="w-4 h-4 text-[#D4AF37]" />
                <div>
                  <div className="text-[10px] text-[#A89F91] uppercase tracking-wider">Tachometer</div>
                  <div className="font-mono-tech text-lg font-bold text-[#D4AF37]">
                    {currentRpm.toLocaleString()} <span className="text-xs text-[#A89F91]">RPM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Throttle rev pedal button */}
            <div className="flex items-center justify-between gap-4 pt-3 border-t border-[#D4AF37]/15">
              <span className="text-xs text-[#C8BFB2]">
                Press & hold throttle to rev engine toward {car.specs.redlineRpm.toLocaleString()} RPM redline
              </span>

              <button
                onMouseDown={handleThrottleDown}
                onMouseUp={handleThrottleUp}
                onTouchStart={handleThrottleDown}
                onTouchEnd={handleThrottleUp}
                className="px-6 py-2.5 text-xs font-bold tracking-[0.16em] uppercase text-[#0C0A08] bg-gold-gradient rounded-sm active:scale-95 transition-all shadow-md cursor-pointer select-none"
              >
                Hold Throttle Pedal
              </button>
            </div>
          </div>

          {/* Technical Blueprint Specifications */}
          <div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#FAF7F2] mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#D4AF37]" />
              <span>Full Engineering Specifications</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-[#181410] border border-[#D4AF37]/15 rounded-sm">
                <span className="text-[#A89F91] uppercase tracking-wider block mb-1">Peak Power</span>
                <span className="font-mono-tech text-base font-bold text-[#D4AF37]">
                  {car.specs.horsepower} BHP
                </span>
              </div>

              <div className="p-3 bg-[#181410] border border-[#D4AF37]/15 rounded-sm">
                <span className="text-[#A89F91] uppercase tracking-wider block mb-1">Peak Torque</span>
                <span className="font-mono-tech text-base font-bold text-[#FAF7F2]">
                  {car.specs.torque} lb-ft
                </span>
              </div>

              <div className="p-3 bg-[#181410] border border-[#D4AF37]/15 rounded-sm">
                <span className="text-[#A89F91] uppercase tracking-wider block mb-1">0 - 60 MPH</span>
                <span className="font-mono-tech text-base font-bold text-[#FAF7F2]">
                  {car.specs.zeroToSixty}s
                </span>
              </div>

              <div className="p-3 bg-[#181410] border border-[#D4AF37]/15 rounded-sm">
                <span className="text-[#A89F91] uppercase tracking-wider block mb-1">Top Speed</span>
                <span className="font-mono-tech text-base font-bold text-[#FAF7F2]">
                  {car.specs.topSpeed} MPH
                </span>
              </div>

              <div className="p-3 bg-[#181410] border border-[#D4AF37]/15 rounded-sm">
                <span className="text-[#A89F91] uppercase tracking-wider block mb-1">Curb Weight</span>
                <span className="font-mono-tech text-base font-bold text-[#FAF7F2]">
                  {car.specs.curbWeightLbs.toLocaleString()} lbs
                </span>
              </div>

              <div className="p-3 bg-[#181410] border border-[#D4AF37]/15 rounded-sm">
                <span className="text-[#A89F91] uppercase tracking-wider block mb-1">Power / Weight</span>
                <span className="font-mono-tech text-base font-bold text-[#DFBE6C]">
                  {powerToWeight} hp/k-lbs
                </span>
              </div>

              <div className="p-3 bg-[#181410] border border-[#D4AF37]/15 rounded-sm">
                <span className="text-[#A89F91] uppercase tracking-wider block mb-1">Drivetrain</span>
                <span className="font-mono-tech text-base font-bold text-[#FAF7F2]">
                  {car.specs.drivetrain}
                </span>
              </div>

              <div className="p-3 bg-[#181410] border border-[#D4AF37]/15 rounded-sm">
                <span className="text-[#A89F91] uppercase tracking-wider block mb-1">Redline Ceiling</span>
                <span className="font-mono-tech text-base font-bold text-[#D4AF37]">
                  {car.specs.redlineRpm.toLocaleString()} RPM
                </span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-[#181410] border border-[#D4AF37]/15 rounded-sm space-y-2 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-[#A89F91]">Engine Architecture:</span>
                <span className="font-mono-tech text-[#FAF7F2] font-medium">{car.specs.engine}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-[#A89F91]">Transmission:</span>
                <span className="font-mono-tech text-[#FAF7F2] font-medium">{car.specs.transmission}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-[#A89F91]">Aerodynamic Downforce:</span>
                <span className="text-[#FAF7F2]">{car.specs.downforceLbsAtSpeed}</span>
              </div>
            </div>
          </div>

          {/* Engineering Lore & Pedigree */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#D4AF37]/15">
            <div>
              <h4 className="font-serif-luxury text-sm font-bold text-[#D4AF37] uppercase tracking-wider mb-2">
                Engineering Lore
              </h4>
              <p className="text-xs text-[#C8BFB2] leading-relaxed">
                {car.engineeringLore}
              </p>
            </div>

            <div>
              <h4 className="font-serif-luxury text-sm font-bold text-[#D4AF37] uppercase tracking-wider mb-2">
                Heritage Milestone
              </h4>
              <p className="text-xs text-[#C8BFB2] leading-relaxed">
                {car.heritageMilestone}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#16120F] border-t border-[#D4AF37]/20">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold tracking-wider uppercase text-[#FAF7F2] border border-[#FAF7F2]/20 hover:border-[#D4AF37] rounded-sm transition-colors cursor-pointer"
          >
            Close Monograph
          </button>
        </div>
      </div>
    </div>
  );
};
