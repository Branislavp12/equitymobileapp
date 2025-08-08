// src/hooks/useCalendarGoal.ts

import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { daysBetween, calcCompoundDailyRate } from "../utils/calendarMath";

export interface CalendarGoal {
  targetAmount: number;
  targetDate: string; // ISO format, napr. "2025-11-15"
}

const STORAGE_KEY = "calendar_goal";

/**
 * Hook na správu obchodného cieľa (amount + date) s persistenciou.
 */
export default function useCalendarGoal(currentEquity: number) {
  const [goal, setGoal] = useState<CalendarGoal | null>(null);
  const [loading, setLoading] = useState(true);

  // Načítať cieľ zo storage pri mounte
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setGoal(JSON.parse(raw));
        }
      } catch (e) {
        setGoal(null);
      }
      setLoading(false);
    })();
  }, []);

  // Uložiť cieľ do storage
  const saveGoal = useCallback(async (g: CalendarGoal) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(g));
    setGoal(g);
  }, []);

  // Vymazať cieľ (ak treba)
  const removeGoal = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setGoal(null);
  }, []);

  // Helpery na výpočty
  const nDays = goal
    ? daysBetween(new Date(), goal.targetDate)
    : 0;
  const dailyRate = goal && currentEquity > 0
    ? calcCompoundDailyRate(currentEquity, goal.targetAmount, nDays)
    : 0;

  return {
    goal,
    loading,
    saveGoal,
    removeGoal,
    nDays,
    dailyRate, // 0.0113 pre 1.13% denne
  };
}
