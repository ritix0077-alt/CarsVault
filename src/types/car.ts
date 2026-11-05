export type BrandId = 'all' | 'honda' | 'porsche' | 'ferrari' | 'aston-martin' | 'lamborghini';

export type PowertrainType = 'Naturally Aspirated' | 'Twin-Turbo' | 'Hybrid' | 'Electric';
export type DrivetrainType = 'RWD' | 'AWD' | 'FWD';

export interface CarSpecs {
  horsepower: number; // hp
  torque: number; // lb-ft
  zeroToSixty: number; // seconds
  topSpeed: number; // mph
  engine: string;
  transmission: string;
  drivetrain: DrivetrainType;
  curbWeightLbs: number;
  displacementLiters?: number;
  redlineRpm: number;
  msrpUsd: number;
  quarterMileSec?: number;
  downforceLbsAtSpeed?: string;
}

export interface SoundProfile {
  engineType: 'vtec-i4' | 'flat6' | 'v12-nat-asp' | 'v12-twin-turbo' | 'v10';
  idleFreq: number; // Hz base tone
  redlineFreq: number; // Hz base tone
  vtecCrossoverRpm?: number;
  exhaustDescription: string;
}

export interface ColorOption {
  name: string;
  hex: string;
  code?: string;
}

export interface Car {
  id: string;
  name: string; // Keep simple as requested: e.g. "Honda NSX"
  brandId: 'honda' | 'porsche' | 'ferrari' | 'aston-martin' | 'lamborghini';
  brandName: string;
  tagline: string;
  modelYear: number;
  heroImage: string;
  specs: CarSpecs;
  soundProfile: SoundProfile;
  colorOptions: ColorOption[];
  overview: string;
  engineeringLore: string;
  heritageMilestone: string;
  badgeAccentHex: string;
}

export interface BrandInfo {
  id: 'honda' | 'porsche' | 'ferrari' | 'aston-martin' | 'lamborghini';
  name: string;
  foundingYear: number;
  headquarters: string;
  motto: string;
  heroImage: string;
  heritageText: string;
  accentColor: string;
  hallmarkTech: string;
}
