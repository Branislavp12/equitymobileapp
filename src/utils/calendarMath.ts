// src/utils/calendarMath.ts

/**
 * Vypočíta počet dní medzi dvoma dátumami (vrátane dnešného dňa).
 * @param from - počiatočný dátum (Date alebo ISO string)
 * @param to - cieľový dátum (Date alebo ISO string)
 */
export function daysBetween(from: Date | string, to: Date | string): number {
  const d1 = typeof from === "string" ? new Date(from) : from;
  const d2 = typeof to === "string" ? new Date(to) : to;
  // Zaokrúhľujeme na polnoc, aby porovnanie bolo spravodlivé
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.max(1, Math.floor((d2.getTime() - d1.getTime()) / msPerDay) + 1);
}

/**
 * Compound Daily Growth Rate na dosiahnutie cieľa v danom počte dní.
 * @param current - aktuálna equity (číslo)
 * @param target - cieľová suma (číslo)
 * @param nDays - počet dní (celé číslo, >=1)
 * @returns denný rast (napr. 0.0113 pre 1.13% denne)
 */
export function calcCompoundDailyRate(current: number, target: number, nDays: number): number {
  if (current <= 0 || target <= 0 || nDays <= 0) return 0;
  return Math.pow(target / current, 1 / nDays) - 1;
}

/**
 * Validácia cieľa (vracia text chyby alebo prázdny string)
 */
export function validateGoalInput(
  amount: number,
  date: string,
  currentEquity: number,
  minDate: Date = new Date()
): string {
  if (!amount || isNaN(amount) || amount <= 0) return "Zadaj kladnú cieľovú sumu.";
  if (!date) return "Vyber dátum.";
  const d = new Date(date);
  if (d < minDate) return "Cieľový dátum musí byť v budúcnosti.";
  if (currentEquity !== undefined && amount <= currentEquity)
    return "Cieľ musí byť väčší než tvoja aktuálna equity.";
  return "";
}

/**
 * Vypočíta konkrétnu cieľovú sumu v € pre každý deň medzi dnes a cieľom,
 * podľa compound percenta a počiatočnej equity.
 * 
 * @param startEquity - aktuálna equity (z ktorej začínaš)
 * @param dailyRate - compound daily percento (napr. 0.0113 = 1.13% denne)
 * @param startDate - od ktorého dňa začať (väčšinou dnes)
 * @param endDate - do ktorého dňa cieľ počítať (vrátane)
 * @returns objekt { [date: string]: number } kde date je YYYY-MM-DD, number je target €
 */
export function getCompoundDailyTargets(
  startEquity: number,
  dailyRate: number,
  startDate: Date,
  endDate: Date
): Record<string, number> {
  const targets: Record<string, number> = {};
  let equity = startEquity;
  let d = new Date(startDate);
  d.setHours(0,0,0,0);

  // fix na endDate polnoc
  const end = new Date(endDate);
  end.setHours(0,0,0,0);

  while (d <= end) {
    const dateStr = d.toISOString().slice(0, 10);
    const dailyTarget = equity * dailyRate;
    targets[dateStr] = dailyTarget;
    equity = equity * (1 + dailyRate); // na ďalší deň už zarátava aj nárast
    d.setDate(d.getDate() + 1);
  }
  return targets;
}
