import { describe, it, expect } from '@jest/globals';
import { computeWindowIndices, computeYDomain, computeYTicks, padWindowedHistory } from './chartScales';

describe('computeWindowIndices', () => {
  it('clamps pan within bounds', () => {
    const res = computeWindowIndices(100, 20, 10);
    expect(res).toEqual({ start: 70, end: 90, maxPan: 80 });
  });

  it('handles negative pan offsets', () => {
    const res = computeWindowIndices(50, 20, -10);
    expect(res).toEqual({ start: 30, end: 50, maxPan: 30 });
  });

  it('limits pan offset to maxPan', () => {
    const res = computeWindowIndices(50, 20, 100);
    expect(res).toEqual({ start: 0, end: 20, maxPan: 30 });
  });
});

describe('computeYDomain', () => {
  it('auto-zooms within target range', () => {
    const domain = computeYDomain([50, 60], 0.1, 100);
    expect(domain[0]).toBe(0);
    expect(domain[1]).toBeCloseTo(133.3333333, 5);
  });

  it('auto-zooms out when history exceeds target', () => {
    const domain = computeYDomain([150, 160], 0.1, 100);
    expect(domain[0]).toBe(0);
    expect(domain[1]).toBeCloseTo(176, 5);
  });

  it('returns [0,1] for invalid inputs', () => {
    expect(computeYDomain([], 0.1, null)).toEqual([0, 1]);
  });

  it('ignores non-numeric history values', () => {
    const domain = computeYDomain([null, -5, 'abc' as any], 0.1, 100);
    expect(domain[0]).toBe(0);
    expect(domain[1]).toBeCloseTo(133.3333333, 5);
  });
});

describe('computeYTicks', () => {
  it('rounds ticks to nearest ten', () => {
    const ticks = computeYTicks(0, 100, 5);
    expect(ticks).toEqual([0, 30, 50, 80, 100]);
  });
});

describe('padWindowedHistory', () => {
  it('pads empty history with initial capital and nulls', () => {
    const padded = padWindowedHistory([], 3, 100);
    expect(padded).toEqual([100, null, null]);
  });

  it('pads shorter history with nulls', () => {
    const padded = padWindowedHistory([110, 120], 5, 100);
    expect(padded).toEqual([110, 120, null, null, null]);
  });
});

