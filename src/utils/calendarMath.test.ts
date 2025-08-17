import {
  daysBetween,
  calcCompoundDailyRate,
  validateGoalInput,
  getCompoundDailyTargets,
} from './calendarMath';

describe('calendarMath utilities', () => {
  describe('daysBetween', () => {
    it('calculates inclusive days between two dates', () => {
      expect(daysBetween('2024-01-01', '2024-01-10')).toBe(10);
    });

    it('returns 1 for the same date', () => {
      expect(daysBetween('2024-01-01', '2024-01-01')).toBe(1);
    });

    it('returns 1 when end date precedes start date', () => {
      expect(daysBetween('2024-01-10', '2024-01-01')).toBe(1);
    });
  });

  describe('calcCompoundDailyRate', () => {
    it('computes the compound daily growth rate', () => {
      const rate = calcCompoundDailyRate(100, 121, 10);
      expect(rate).toBeCloseTo(0.0192448, 6);
    });

    it('returns 0 when values are non-positive', () => {
      expect(calcCompoundDailyRate(-100, 121, 10)).toBe(0);
      expect(calcCompoundDailyRate(100, -121, 10)).toBe(0);
      expect(calcCompoundDailyRate(100, 121, 0)).toBe(0);
    });
  });

  describe('validateGoalInput', () => {
    const today = new Date('2023-01-01');

    it('validates positive amount', () => {
      expect(validateGoalInput(-10, '2024-01-01', 0, today)).toBe(
        'Zadaj kladnú cieľovú sumu.',
      );
    });

    it('requires a date', () => {
      expect(validateGoalInput(100, '', 0, today)).toBe('Vyber dátum.');
    });

    it('requires future date', () => {
      expect(validateGoalInput(100, '2022-12-31', 0, today)).toBe(
        'Cieľový dátum musí byť v budúcnosti.',
      );
    });

    it('requires amount to exceed current equity', () => {
      expect(validateGoalInput(50, '2024-01-01', 100, today)).toBe(
        'Cieľ musí byť väčší než tvoja aktuálna equity.',
      );
    });

    it('returns empty string for valid input', () => {
      expect(validateGoalInput(200, '2024-01-01', 100, today)).toBe('');
    });
  });

  describe('getCompoundDailyTargets', () => {
    it('generates targets for each day with positive rate', () => {
      const targets = getCompoundDailyTargets(
        100,
        0.1,
        new Date('2024-01-01'),
        new Date('2024-01-03'),
      );
      expect(targets['2024-01-01']).toBe(10);
      expect(targets['2024-01-02']).toBeCloseTo(11);
      expect(targets['2024-01-03']).toBeCloseTo(12.1);
    });

    it('handles negative daily rate', () => {
      const targets = getCompoundDailyTargets(
        100,
        -0.1,
        new Date('2024-01-01'),
        new Date('2024-01-02'),
      );
      expect(targets).toEqual({
        '2024-01-01': -10,
        '2024-01-02': -9,
      });
    });

    it('returns single entry when start and end dates are the same', () => {
      const targets = getCompoundDailyTargets(
        100,
        0.1,
        new Date('2024-01-01'),
        new Date('2024-01-01'),
      );
      expect(targets).toEqual({ '2024-01-01': 10 });
    });
  });
});

