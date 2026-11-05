import { BrandId, Car } from '../types/car';

/**
 * Calculates power-to-weight ratio in horsepower per 1,000 lbs.
 */
export function calculatePowerToWeight(horsepower: number, weightLbs: number): number {
  if (weightLbs <= 0) return 0;
  const ratio = (horsepower / weightLbs) * 1000;
  return Math.round(ratio * 10) / 10;
}

/**
 * Formats USD currency values.
 */
export function formatPrice(priceUsd: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(priceUsd);
}

/**
 * Strict filtering function for cars.
 * Ensures that selecting a brand ONLY returns cars of that brand.
 */
export function filterCars(
  cars: Car[],
  options: {
    brandId?: BrandId;
    searchQuery?: string;
    drivetrain?: string;
    minHorsepower?: number;
  }
): Car[] {
  const { brandId = 'all', searchQuery = '', drivetrain = 'all', minHorsepower = 0 } = options;
  const query = searchQuery.trim().toLowerCase();

  return cars.filter((car) => {
    // Strict brand filtering
    if (brandId !== 'all' && car.brandId !== brandId) {
      return false;
    }

    // Search query match (name, brand, engine, tagline)
    if (query) {
      const matchName = car.name.toLowerCase().includes(query);
      const matchBrand = car.brandName.toLowerCase().includes(query);
      const matchEngine = car.specs.engine.toLowerCase().includes(query);
      const matchTagline = car.tagline.toLowerCase().includes(query);
      if (!matchName && !matchBrand && !matchEngine && !matchTagline) {
        return false;
      }
    }

    // Drivetrain match
    if (drivetrain !== 'all' && car.specs.drivetrain !== drivetrain) {
      return false;
    }

    // Minimum horsepower
    if (car.specs.horsepower < minHorsepower) {
      return false;
    }

    return true;
  });
}

export type SortKey = 'hp-desc' | 'speed-desc' | 'accel-asc' | 'price-desc' | 'price-asc' | 'year-desc';

/**
 * Sorts cars based on selected key.
 */
export function sortCars(cars: Car[], sortKey: SortKey): Car[] {
  const sorted = [...cars];
  switch (sortKey) {
    case 'hp-desc':
      return sorted.sort((a, b) => b.specs.horsepower - a.specs.horsepower);
    case 'speed-desc':
      return sorted.sort((a, b) => b.specs.topSpeed - a.specs.topSpeed);
    case 'accel-asc':
      return sorted.sort((a, b) => a.specs.zeroToSixty - b.specs.zeroToSixty);
    case 'price-desc':
      return sorted.sort((a, b) => b.specs.msrpUsd - a.specs.msrpUsd);
    case 'price-asc':
      return sorted.sort((a, b) => a.specs.msrpUsd - b.specs.msrpUsd);
    case 'year-desc':
      return sorted.sort((a, b) => b.modelYear - a.modelYear);
    default:
      return sorted;
  }
}

export interface ComparisonResult {
  hpWinner: 'carA' | 'carB' | 'tie';
  accelWinner: 'carA' | 'carB' | 'tie';
  speedWinner: 'carA' | 'carB' | 'tie';
  weightWinner: 'carA' | 'carB' | 'tie';
  powerToWeightA: number;
  powerToWeightB: number;
  powerToWeightWinner: 'carA' | 'carB' | 'tie';
  hpDelta: number;
  accelDelta: number;
  topSpeedDelta: number;
}

/**
 * Performs side-by-side comparison between two cars.
 */
export function compareCars(carA: Car, carB: Car): ComparisonResult {
  const ptwA = calculatePowerToWeight(carA.specs.horsepower, carA.specs.curbWeightLbs);
  const ptwB = calculatePowerToWeight(carB.specs.horsepower, carB.specs.curbWeightLbs);

  const hpDiff = carA.specs.horsepower - carB.specs.horsepower;
  const accelDiff = carA.specs.zeroToSixty - carB.specs.zeroToSixty; // lower is better
  const speedDiff = carA.specs.topSpeed - carB.specs.topSpeed;
  const weightDiff = carA.specs.curbWeightLbs - carB.specs.curbWeightLbs; // lower is better

  return {
    hpWinner: hpDiff > 0 ? 'carA' : hpDiff < 0 ? 'carB' : 'tie',
    accelWinner: accelDiff < 0 ? 'carA' : accelDiff > 0 ? 'carB' : 'tie',
    speedWinner: speedDiff > 0 ? 'carA' : speedDiff < 0 ? 'carB' : 'tie',
    weightWinner: weightDiff < 0 ? 'carA' : weightDiff > 0 ? 'carB' : 'tie',
    powerToWeightA: ptwA,
    powerToWeightB: ptwB,
    powerToWeightWinner: ptwA > ptwB ? 'carA' : ptwA < ptwB ? 'carB' : 'tie',
    hpDelta: Math.abs(hpDiff),
    accelDelta: Math.round(Math.abs(accelDiff) * 10) / 10,
    topSpeedDelta: Math.abs(speedDiff),
  };
}
