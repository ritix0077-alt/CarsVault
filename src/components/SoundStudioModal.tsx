import React, { useState, useEffect } from 'react';
import { CARS } from '../data/cars';
import { Car } from '../types/car';
import { audioSynth } from '../utils/audioSynth';
import { X, Volume2, VolumeX, Gauge, Flame, Radio } from 'lucide-react';

interface SoundStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SoundStudioModal: React.FC<SoundStudioModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCarId, setSelectedCarId] = useState<string>('honda-nsx');
  const [isEngineOn, setIsEngineOn] = useState(false);
  const [rpm, setRpm] = useState(1000);
  const [throttle, setThrottle] = useState(0);

  const selectedCar = CARS.find((c) => c.id === selectedCarId) || CARS[0];

  useEffect(() => {
    if (!isOpen) {
      audioSynth.stop();
      setIsEngineOn(false);
      setRpm(1000);
      setThrottle(0);
    }
  }, [isOpen]);

  const handleCarSelect = (car: Car) => {
    setSelectedCarId(car.id);
    if (isEngineOn) {
      audioSynth.start(car.soundProfile, (newRpm) => setRpm(newRpm));
    }
  };

  const handleToggleIgnition = () => {
    if (isEngineOn) {
      audioSynth.stop();
      setIsEngineOn(false);
      setRpm(1000);
      setThrottle(0);
    } else {
      audioSynth.start(selectedCar.soundProfile, (newRpm) => setRpm(newRpm));
      setIsEngineOn(true);
    }
  };

  const handleThrottleDown = () => {
    if (!isEngineOn) {
      handleToggleIgnition();
    }
    setThrottle(1.0);
    audioSynth.setThrottle(1.0);
  };

  const handleThrottleUp = () => {
    setThrottle(0.0);
    audioSynth.setThrottle(0.0);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setThrottle(val);
    if (!isEngineOn) {
      audioSynth.start(selectedCar.soundProfile, (newRpm) => setRpm(newRpm));
      setIsEngineOn(true);
    }
    audioSynth.setThrottle(val);
  };

  if (!isOpen) return null;

  const redline = selectedCar.specs.redlineRpm;
  const rpmPercent = Math.min(100, Math.round((rpm / redline) * 100));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sound-studio-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#120F0D] border border-[#D4AF37]/40 rounded-sm shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D4AF37]/20 bg-[#16120F]">
          <div className="flex items-center gap-3">
            <Radio className="w-4 h-4 text-[#D4AF37]" />
            <h2 id="sound-studio-title" className="font-serif-luxury text-sm tracking-[0.2em] uppercase text-[#FAF7F2] font-bold">
              Acoustic Exhaust Studio
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A89F91] hover:text-[#FAF7F2] hover:bg-white/10 rounded-sm transition-colors cursor-pointer"
            aria-label="Close sound studio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Content */}
        <div className="p-6 md:p-8 space-y-6">
          <p className="text-xs text-[#A89F91] leading-relaxed">
            Experience real harmonic acoustic synthesis calibrated to each engine's combustion order, cylinder count, and redline harmonics using the Web Audio API.
          </p>

          {/* Engine Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {CARS.slice(0, 10).map((car) => {
              const isSelected = car.id === selectedCarId;
              return (
                <button
                  key={car.id}
                  onClick={() => handleCarSelect(car)}
                  className={`text-left p-2.5 rounded-sm border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1C1713] border-[#D4AF37] text-[#FAF7F2] shadow-sm'
                      : 'bg-[#14110E] border-white/10 text-[#A89F91] hover:border-white/30 hover:text-[#FAF7F2]'
                  }`}
                >
                  <div className="text-[10px] tracking-wider uppercase text-[#D4AF37] truncate">
                    {car.brandName}
                  </div>
                  <div className="text-xs font-bold truncate">
                    {car.name.replace(car.brandName, '').trim()}
                  </div>
                  <div className="text-[10px] text-[#A89F91] font-mono-tech mt-1">
                    {car.specs.redlineRpm.toLocaleString()} RPM
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Car Soundstage Card */}
          <div className="p-6 bg-[#0C0A08] border border-[#D4AF37]/30 rounded-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] mb-1">
                  Active Chamber
                </div>
                <div className="font-serif-luxury text-2xl font-bold text-[#FAF7F2]">
                  {selectedCar.name}
                </div>
                <div className="text-xs text-[#C8BFB2] mt-1 font-mono-tech">
                  {selectedCar.specs.engine}
                </div>
              </div>

              {/* Ignition Toggle */}
              <button
                onClick={handleToggleIgnition}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-sm font-bold text-xs uppercase tracking-[0.16em] transition-all shadow-md cursor-pointer ${
                  isEngineOn
                    ? 'bg-red-900/60 text-red-200 border border-red-500/50 hover:bg-red-800/80'
                    : 'bg-gold-gradient text-[#0C0A08] hover:brightness-110'
                }`}
              >
                {isEngineOn ? <VolumeX className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
                <span>{isEngineOn ? 'Kill Ignition' : 'Start Ignition'}</span>
              </button>
            </div>

            {/* Tachometer Visualizer */}
            <div className="space-y-3 pt-4 border-t border-[#D4AF37]/15">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#A89F91] uppercase tracking-wider flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Engine Speed</span>
                </span>
                <span className="font-mono-tech font-bold text-lg text-[#D4AF37]">
                  {rpm.toLocaleString()} / {redline.toLocaleString()} RPM
                </span>
              </div>

              {/* Tachometer Bar */}
              <div className="w-full h-3 bg-[#1A1512] rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-[#DFBE6C] via-[#D4AF37] to-[#DC2626] transition-all duration-75 ease-out"
                  style={{ width: `${rpmPercent}%` }}
                />
              </div>

              {/* VTEC indicator if Honda */}
              {selectedCar.soundProfile.vtecCrossoverRpm && (
                <div className="flex items-center justify-between text-[11px] text-[#A89F91]">
                  <span>VTEC Crossover: {selectedCar.soundProfile.vtecCrossoverRpm} RPM</span>
                  <span className={`font-bold uppercase ${rpm >= selectedCar.soundProfile.vtecCrossoverRpm ? 'text-red-500 animate-pulse' : 'text-[#64748B]'}`}>
                    {rpm >= selectedCar.soundProfile.vtecCrossoverRpm ? '● VTEC Engaged' : '○ Low Cam'}
                  </span>
                </div>
              )}
            </div>

            {/* Interactive Throttle Controls */}
            <div className="mt-6 pt-6 border-t border-[#D4AF37]/15 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div>
                <label htmlFor="throttle-slider" className="block text-xs uppercase tracking-wider text-[#A89F91] mb-2">
                  Throttle Position: {Math.round(throttle * 100)}%
                </label>
                <input
                  id="throttle-slider"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={throttle}
                  onChange={handleSliderChange}
                  className="w-full accent-[#D4AF37] cursor-pointer"
                />
              </div>

              <div className="text-center sm:text-right">
                <button
                  onMouseDown={handleThrottleDown}
                  onMouseUp={handleThrottleUp}
                  onTouchStart={handleThrottleDown}
                  onTouchEnd={handleThrottleUp}
                  className="w-full sm:w-auto px-8 py-3.5 text-xs font-bold tracking-[0.2em] uppercase text-[#0C0A08] bg-gold-gradient rounded-sm active:scale-95 transition-all shadow-lg cursor-pointer select-none"
                >
                  Hold Throttle Pedal
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 bg-[#16120F] border-t border-[#D4AF37]/20">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold tracking-wider uppercase text-[#FAF7F2] border border-[#FAF7F2]/20 hover:border-[#D4AF37] rounded-sm transition-colors cursor-pointer"
          >
            Exit Studio
          </button>
        </div>
      </div>
    </div>
  );
};
