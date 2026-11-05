import React from 'react';
import { Car } from '../types/car';
import { CARS } from '../data/cars';
import { compareCars, calculatePowerToWeight, formatPrice } from '../utils/carLogic';
import { X, GitCompare, Trophy, Zap, Trash2, Plus } from 'lucide-react';

interface ComparisonDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  comparedCars: Car[];
  onRemoveCar: (carId: string) => void;
  onClearAll: () => void;
  onAddCar: (car: Car) => void;
}

export const ComparisonDrawer: React.FC<ComparisonDrawerProps> = ({
  isOpen,
  onClose,
  comparedCars,
  onRemoveCar,
  onClearAll,
  onAddCar,
}) => {
  if (!isOpen) return null;

  // Preset duels for fast 1-click comparison
  const presetDuels = [
    {
      title: 'East vs West Super-Hybrids',
      carAId: 'honda-nsx',
      carBId: 'porsche-918-spyder',
    },
    {
      title: 'Naturally Aspirated V12 Showdown',
      carAId: 'ferrari-daytona-sp3',
      carBId: 'aston-valkyrie',
    },
    {
      title: 'The Honda Type R Bloodline',
      carAId: 'honda-civic-typer',
      carBId: 'honda-integra',
    },
    {
      title: 'Atmospheric Track Titans',
      carAId: 'porsche-gt3-rs',
      carBId: 'lambo-huracan-sto',
    },
  ];

  const handleApplyPreset = (carAId: string, carBId: string) => {
    onClearAll();
    const carA = CARS.find((c) => c.id === carAId);
    const carB = CARS.find((c) => c.id === carBId);
    if (carA) onAddCar(carA);
    if (carB) onAddCar(carB);
  };

  const hasTwo = comparedCars.length >= 2;
  const comparison = hasTwo ? compareCars(comparedCars[0], comparedCars[1]) : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparison-drawer-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#120F0D] border border-[#D4AF37]/40 rounded-sm shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D4AF37]/20 bg-[#16120F]">
          <div className="flex items-center gap-3">
            <GitCompare className="w-4 h-4 text-[#D4AF37]" />
            <h2 id="comparison-drawer-title" className="font-serif-luxury text-sm tracking-[0.2em] uppercase text-[#FAF7F2] font-bold">
              The Grand Duel · Spec Comparison Lounge
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {comparedCars.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-[#A89F91] hover:text-[#DC2626] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-[#A89F91] hover:text-[#FAF7F2] hover:bg-white/10 rounded-sm transition-colors cursor-pointer"
              aria-label="Close comparison lounge"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto space-y-6">
          {comparedCars.length === 0 ? (
            <div className="text-center py-10">
              <GitCompare className="w-12 h-12 text-[#D4AF37]/40 mx-auto mb-4" />
              <h3 className="font-serif-luxury text-xl font-bold text-[#FAF7F2] mb-2">
                No Machines Selected for Comparison
              </h3>
              <p className="text-xs text-[#A89F91] max-w-md mx-auto mb-6">
                Add 2 or more cars from any brand page using the duel button on each card, or select a curated exhibition duel below.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto text-left">
                {presetDuels.map((preset) => (
                  <button
                    key={preset.title}
                    onClick={() => handleApplyPreset(preset.carAId, preset.carBId)}
                    className="p-3 bg-[#181410] hover:bg-[#201A15] border border-[#D4AF37]/20 hover:border-[#D4AF37] rounded-sm transition-all cursor-pointer"
                  >
                    <div className="text-[10px] uppercase tracking-wider text-[#D4AF37] mb-1">
                      Exhibition Duel
                    </div>
                    <div className="text-xs font-bold text-[#FAF7F2]">
                      {preset.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : comparedCars.length === 1 ? (
            <div className="space-y-6">
              <div className="p-4 bg-[#181410] border border-[#D4AF37]/25 rounded-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] block">
                    Slot 1 Occupied
                  </span>
                  <span className="font-serif-luxury text-lg font-bold text-[#FAF7F2]">
                    {comparedCars[0].name}
                  </span>
                </div>
                <button
                  onClick={() => onRemoveCar(comparedCars[0].id)}
                  className="text-xs text-[#A89F91] hover:text-red-400 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center py-6 border border-dashed border-[#D4AF37]/25 rounded-sm p-6">
                <Plus className="w-8 h-8 text-[#D4AF37] mx-auto mb-2 opacity-60" />
                <h4 className="text-sm font-bold text-[#FAF7F2] mb-1">Select a Rival Machine</h4>
                <p className="text-xs text-[#A89F91] mb-4">
                  Select a contender from the catalog below to launch the comparative breakdown.
                </p>

                <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
                  {CARS.filter((c) => c.id !== comparedCars[0].id).slice(0, 6).map((car) => (
                    <button
                      key={car.id}
                      onClick={() => onAddCar(car)}
                      className="px-3 py-1.5 text-xs bg-[#181410] hover:border-[#D4AF37] text-[#FAF7F2] border border-white/10 rounded-sm transition-colors cursor-pointer"
                    >
                      + {car.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Contender Cards Strip */}
              <div className={`grid grid-cols-1 md:grid-cols-${comparedCars.length} gap-4`}>
                {comparedCars.map((car, idx) => (
                  <div
                    key={car.id}
                    className="p-4 bg-[#0C0A08] border border-[#D4AF37]/30 rounded-sm relative"
                  >
                    <button
                      onClick={() => onRemoveCar(car.id)}
                      className="absolute top-3 right-3 p-1 text-[#A89F91] hover:text-red-400 transition-colors"
                      aria-label={`Remove ${car.name}`}
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] mb-1">
                      Contender {idx + 1} · {car.brandName}
                    </div>

                    <h3 className="font-serif-luxury text-xl font-bold text-[#FAF7F2] mb-2">
                      {car.name}
                    </h3>

                    <div className="aspect-[16/9] w-full rounded-sm overflow-hidden mb-3 border border-white/10">
                      <img
                        src={car.heroImage}
                        alt={car.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="text-xs text-[#C8BFB2] font-mono-tech">
                      {formatPrice(car.specs.msrpUsd)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparative Table */}
              <div className="border border-[#D4AF37]/20 rounded-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#181410] border-b border-[#D4AF37]/20 text-[#A89F91] uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Metric</th>
                      {comparedCars.map((c) => (
                        <th key={c.id} className="p-3.5 font-bold text-[#FAF7F2]">
                          {c.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono-tech">
                    {/* Horsepower */}
                    <tr className="hover:bg-white/[0.02]">
                      <td className="p-3.5 font-sans text-[#A89F91]">Peak Horsepower</td>
                      {comparedCars.map((c, i) => {
                        const isWin = comparison && (
                          (i === 0 && comparison.hpWinner === 'carA') ||
                          (i === 1 && comparison.hpWinner === 'carB')
                        );
                        return (
                          <td key={c.id} className="p-3.5 font-bold text-sm">
                            <span className={isWin ? 'text-[#D4AF37] font-extrabold' : 'text-[#FAF7F2]'}>
                              {c.specs.horsepower} BHP
                            </span>
                            {isWin && (
                              <span className="ml-2 text-[10px] uppercase text-[#D4AF37] font-sans">
                                [Lead +{comparison?.hpDelta}]
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* 0-60 */}
                    <tr className="hover:bg-white/[0.02]">
                      <td className="p-3.5 font-sans text-[#A89F91]">0 - 60 MPH</td>
                      {comparedCars.map((c, i) => {
                        const isWin = comparison && (
                          (i === 0 && comparison.accelWinner === 'carA') ||
                          (i === 1 && comparison.accelWinner === 'carB')
                        );
                        return (
                          <td key={c.id} className="p-3.5 font-bold text-sm">
                            <span className={isWin ? 'text-[#D4AF37] font-extrabold' : 'text-[#FAF7F2]'}>
                              {c.specs.zeroToSixty}s
                            </span>
                            {isWin && (
                              <span className="ml-2 text-[10px] uppercase text-[#D4AF37] font-sans">
                                [Faster -{comparison?.accelDelta}s]
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Top Speed */}
                    <tr className="hover:bg-white/[0.02]">
                      <td className="p-3.5 font-sans text-[#A89F91]">Top Speed</td>
                      {comparedCars.map((c, i) => {
                        const isWin = comparison && (
                          (i === 0 && comparison.speedWinner === 'carA') ||
                          (i === 1 && comparison.speedWinner === 'carB')
                        );
                        return (
                          <td key={c.id} className="p-3.5 font-bold text-sm">
                            <span className={isWin ? 'text-[#D4AF37] font-extrabold' : 'text-[#FAF7F2]'}>
                              {c.specs.topSpeed} MPH
                            </span>
                            {isWin && (
                              <span className="ml-2 text-[10px] uppercase text-[#D4AF37] font-sans">
                                [Lead +{comparison?.topSpeedDelta} mph]
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Power to Weight */}
                    <tr className="hover:bg-white/[0.02]">
                      <td className="p-3.5 font-sans text-[#A89F91]">Power / Weight</td>
                      {comparedCars.map((c, i) => {
                        const ptw = calculatePowerToWeight(c.specs.horsepower, c.specs.curbWeightLbs);
                        const isWin = comparison && (
                          (i === 0 && comparison.powerToWeightWinner === 'carA') ||
                          (i === 1 && comparison.powerToWeightWinner === 'carB')
                        );
                        return (
                          <td key={c.id} className="p-3.5 font-bold text-sm">
                            <span className={isWin ? 'text-[#D4AF37] font-extrabold' : 'text-[#FAF7F2]'}>
                              {ptw} hp/k-lbs
                            </span>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Curb Weight */}
                    <tr className="hover:bg-white/[0.02]">
                      <td className="p-3.5 font-sans text-[#A89F91]">Curb Weight</td>
                      {comparedCars.map((c, i) => {
                        const isWin = comparison && (
                          (i === 0 && comparison.weightWinner === 'carA') ||
                          (i === 1 && comparison.weightWinner === 'carB')
                        );
                        return (
                          <td key={c.id} className="p-3.5 text-[#FAF7F2]">
                            {c.specs.curbWeightLbs.toLocaleString()} lbs
                            {isWin && (
                              <span className="ml-2 text-[10px] uppercase text-emerald-400 font-sans">
                                [Lighter]
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Engine */}
                    <tr className="hover:bg-white/[0.02]">
                      <td className="p-3.5 font-sans text-[#A89F91]">Engine</td>
                      {comparedCars.map((c) => (
                        <td key={c.id} className="p-3.5 text-[#C8BFB2] font-sans">
                          {c.specs.engine}
                        </td>
                      ))}
                    </tr>

                    {/* Drivetrain */}
                    <tr className="hover:bg-white/[0.02]">
                      <td className="p-3.5 font-sans text-[#A89F91]">Drivetrain</td>
                      {comparedCars.map((c) => (
                        <td key={c.id} className="p-3.5 text-[#FAF7F2]">
                          {c.specs.drivetrain}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 bg-[#16120F] border-t border-[#D4AF37]/20">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold tracking-wider uppercase text-[#FAF7F2] border border-[#FAF7F2]/20 hover:border-[#D4AF37] rounded-sm transition-colors cursor-pointer"
          >
            Close Duel
          </button>
        </div>
      </div>
    </div>
  );
};
