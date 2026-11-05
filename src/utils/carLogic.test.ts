import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePowerToWeight, filterCars, sortCars, compareCars, formatPrice } from './carLogic';
import { CARS } from '../data/cars';

test('calculatePowerToWeight calculates hp per 1000 lbs correctly', () => {
  // 600 hp with 3895 lbs = (600 / 3895) * 1000 = 154.04... -> 154.0
  const ratio = calculatePowerToWeight(600, 3895);
  assert.equal(ratio, 154);

  // zero or negative weight edge case
  assert.equal(calculatePowerToWeight(500, 0), 0);
});

test('formatPrice formats currency without decimals', () => {
  const formatted = formatPrice(171495);
  assert.match(formatted, /\$171,495/);
});

test('filterCars strictly isolates brand cars without leakage', () => {
  // Test Honda filtering: strictly Honda cars only
  const hondaCars = filterCars(CARS, { brandId: 'honda' });
  assert.ok(hondaCars.length >= 4);
  hondaCars.forEach((car) => {
    assert.equal(car.brandId, 'honda', `Car ${car.name} is not Honda`);
    assert.equal(car.brandName, 'Honda');
  });

  // Test Porsche filtering: strictly Porsche cars only
  const porscheCars = filterCars(CARS, { brandId: 'porsche' });
  assert.ok(porscheCars.length >= 3);
  porscheCars.forEach((car) => {
    assert.equal(car.brandId, 'porsche', `Car ${car.name} is not Porsche`);
  });

  // Test Ferrari filtering: strictly Ferrari cars only
  const ferrariCars = filterCars(CARS, { brandId: 'ferrari' });
  assert.ok(ferrariCars.length >= 3);
  ferrariCars.forEach((car) => {
    assert.equal(car.brandId, 'ferrari', `Car ${car.name} is not Ferrari`);
  });
});

test('filterCars query search matches name, engine, or tagline', () => {
  const queryResult = filterCars(CARS, { searchQuery: 'VTEC' });
  assert.ok(queryResult.length > 0);
  queryResult.forEach((car) => {
    const text = `${car.name} ${car.tagline} ${car.specs.engine}`.toLowerCase();
    assert.ok(text.includes('vtec'));
  });
});

test('sortCars correctly re-orders cars by horsepower and speed', () => {
  const sortedByHp = sortCars(CARS, 'hp-desc');
  assert.ok(sortedByHp[0].specs.horsepower >= sortedByHp[1].specs.horsepower);
  assert.ok(sortedByHp[0].name.includes('Valkyrie') || sortedByHp[0].specs.horsepower >= 1000);

  const sortedBySpeed = sortCars(CARS, 'speed-desc');
  assert.ok(sortedBySpeed[0].specs.topSpeed >= sortedBySpeed[1].specs.topSpeed);
});

test('compareCars calculates winners and differentials accurately', () => {
  const nsx = CARS.find((c) => c.id === 'honda-nsx')!;
  const civic = CARS.find((c) => c.id === 'honda-civic-typer')!;

  const comparison = compareCars(nsx, civic);
  // NSX has 600hp vs Civic 315hp
  assert.equal(comparison.hpWinner, 'carA');
  assert.equal(comparison.hpDelta, 285);

  // Civic is lighter (3188 lbs vs 3895 lbs), so Civic wins weight
  assert.equal(comparison.weightWinner, 'carB');

  // NSX 0-60 is 2.7s vs Civic 4.9s, NSX wins acceleration
  assert.equal(comparison.accelWinner, 'carA');
  assert.equal(comparison.accelDelta, 2.2);
});
