import React from 'react';
import { BrandId } from '../types/car';
import { SortKey } from '../utils/carLogic';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  activeBrand: BrandId;
  onSelectBrand: (brandId: BrandId) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  drivetrain: string;
  onDrivetrainChange: (dt: string) => void;
  sortKey: SortKey;
  onSortChange: (sort: SortKey) => void;
  totalResults: number;
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeBrand,
  onSelectBrand,
  searchQuery,
  onSearchChange,
  drivetrain,
  onDrivetrainChange,
  sortKey,
  onSortChange,
  totalResults,
  onReset,
}) => {
  const brandOptions: { id: BrandId; label: string }[] = [
    { id: 'all', label: 'All Marques' },
    { id: 'honda', label: 'Honda' },
    { id: 'porsche', label: 'Porsche' },
    { id: 'ferrari', label: 'Ferrari' },
    { id: 'aston-martin', label: 'Aston Martin' },
    { id: 'lamborghini', label: 'Lamborghini' },
  ];

  return (
    <div className="w-full bg-[#14110E] border-y border-[#D4AF37]/20 py-4 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Brand Segmented Controls */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {brandOptions.map((brand) => (
            <button
              key={brand.id}
              onClick={() => onSelectBrand(brand.id)}
              className={`px-3 py-1.5 text-xs font-semibold tracking-wider uppercase whitespace-nowrap rounded-sm transition-all cursor-pointer ${
                activeBrand === brand.id
                  ? 'bg-gold-gradient text-[#0C0A08] shadow-sm'
                  : 'text-[#A89F91] hover:text-[#FAF7F2] hover:bg-white/5'
              }`}
            >
              {brand.label}
            </button>
          ))}
        </div>

        {/* Search & Selectors Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-[#A89F91] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search model, engine, VTEC..."
              className="w-full bg-[#0C0A08] border border-[#D4AF37]/20 focus:border-[#D4AF37] text-xs text-[#FAF7F2] pl-8 pr-3 py-2 rounded-sm focus:outline-none placeholder-[#A89F91]/60"
            />
          </div>

          {/* Drivetrain Selector */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="drivetrain-select" className="sr-only">Drivetrain</label>
            <select
              id="drivetrain-select"
              value={drivetrain}
              onChange={(e) => onDrivetrainChange(e.target.value)}
              className="bg-[#0C0A08] border border-[#D4AF37]/20 focus:border-[#D4AF37] text-xs text-[#C8BFB2] px-2.5 py-2 rounded-sm focus:outline-none cursor-pointer"
            >
              <option value="all">All Drivetrains</option>
              <option value="RWD">RWD</option>
              <option value="AWD">AWD</option>
              <option value="FWD">FWD</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="sort-select" className="sr-only">Sort by</label>
            <select
              id="sort-select"
              value={sortKey}
              onChange={(e) => onSortChange(e.target.value as SortKey)}
              className="bg-[#0C0A08] border border-[#D4AF37]/20 focus:border-[#D4AF37] text-xs text-[#C8BFB2] px-2.5 py-2 rounded-sm focus:outline-none cursor-pointer"
            >
              <option value="hp-desc">Horsepower (Highest)</option>
              <option value="speed-desc">Top Speed (Fastest)</option>
              <option value="accel-asc">0-60 MPH (Quickest)</option>
              <option value="price-desc">MSRP (High to Low)</option>
              <option value="price-asc">MSRP (Low to High)</option>
              <option value="year-desc">Model Year (Newest)</option>
            </select>
          </div>

          {/* Results Count & Reset */}
          <div className="flex items-center gap-2 text-xs text-[#A89F91] shrink-0 pl-1">
            <span className="font-mono-tech font-bold text-[#D4AF37]">{totalResults}</span>
            <span>{totalResults === 1 ? 'Icon' : 'Icons'}</span>

            {(searchQuery || drivetrain !== 'all' || activeBrand !== 'all') && (
              <button
                onClick={onReset}
                className="p-1 hover:text-[#FAF7F2] transition-colors cursor-pointer ml-1"
                title="Reset all filters"
                aria-label="Reset filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
