// src/utils/chartScales.ts

// Výpočet začiatku a konca okna v histórii podľa zoom a pan
export function computeWindowIndices(
  historyLength: number,
  zoomLevel: number,
  panOffset: number = 0
): { start: number; end: number; maxPan: number } {
  const maxPan = Math.max(0, historyLength - zoomLevel);
  const clampedPan = Math.max(0, Math.min(panOffset, maxPan));
  const start = historyLength - zoomLevel - clampedPan;
  const end = historyLength - clampedPan;
  return {
    start: Math.max(0, start),
    end: Math.max(zoomLevel, end),
    maxPan,
  };
}

// Výpočet okna histórie (view)
export function getWindowedHistory(
  history: Array<number | null>,
  start: number,
  end: number
): Array<number | null> {
  return history.slice(start, end);
}

// Výpočet domén pre škálu X
export function computeXDomain(windowLength: number): [number, number] {
  return [0, windowLength - 1];
}

/**
 * Výpočet Y domény pre počiatočný stav podľa zadania:
 * - Baseline Ymin = 0
 * - Ymax = initialCapital / 0.75 (počiatočná equity je na 75% výšky grafu)
 * - Ak equity prerazí túto hranicu, graf sa dynamicky roztiahne (auto-zoom out)
 * - Ošetrenie bugov, extrémnych hodnôt a záporných čísel
 */
export function computeYDomain(
  windowedHistory: Array<number | null>,
  padding: number = 0.1,
  initialCapital: number | null = null
): [number, number] {
  if (!Array.isArray(windowedHistory) || windowedHistory.length === 0 || !initialCapital) {
    return [0, 1];
  }

  const cleanHistory = windowedHistory
    .map(Number)
    .filter(v => isFinite(v) && v >= 0);

  if (cleanHistory.length === 0) {
    return [0, initialCapital / 0.75];
  }

  const min = Math.min(...cleanHistory);
  const max = Math.max(...cleanHistory);

  const targetYmax = initialCapital / 0.75;

  if (max <= targetYmax) {
    return [0, targetYmax];
  }

  return [0, max * 1.1];
}

// Výpočet Y tickov
export function computeYTicks(
  yMin: number,
  yMax: number,
  nTicks: number = 10
): number[] {
  const step = (yMax - yMin) / (nTicks - 1);
  return Array.from({ length: nTicks }, (_, i) => {
    const value = yMin + i * step;
    // Zaokrúhlenie na najbližších 10 (napr. 213 → 210, 216 → 220)
    return Math.round(value / 10) * 10;
  });
}

// Doplní do okna "prázdne sloty", ak je v histórii menej než minWindowSize bodov
export function padWindowedHistory(
  windowedHistory: Array<number | null>,
  minWindowSize: number,
  initialCapital: number | null
): Array<number | null> {
  if (windowedHistory.length >= minWindowSize) return windowedHistory;
  // Prvý bod je vždy initialCapital, zvyšok null
  const padArray: Array<number | null> = [initialCapital, ...Array(minWindowSize - 1).fill(null)];
  for (let i = 0; i < windowedHistory.length; i++) {
    padArray[i] = windowedHistory[i];
  }
  return padArray;
}
