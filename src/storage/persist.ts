// src/storage/persist.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

// Kľúče pre ukladanie do AsyncStorage
const CAPITAL_KEY = '@equity_app/capital';
const TRADES_KEY = '@equity_app/trades';

// Typ pre jeden obchod
export type Trade = {
  id: string;
  timestamp: number;
  risk: number;
  reward: number;
  result: 'profit' | 'loss';
  equityBefore: number;
  equityAfter: number;
};

// Kapitál
export const getCapital = async (): Promise<number | null> => {
  try {
    const val = await AsyncStorage.getItem(CAPITAL_KEY);
    return val ? Number(val) : null;
  } catch (e) {
    console.error('Error loading capital from storage:', e);
    return null;
  }
};

export const setCapital = async (value: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(CAPITAL_KEY, value.toString());
  } catch (e) {
    console.error('Error saving capital to storage:', e);
  }
};

export const removeCapital = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CAPITAL_KEY);
  } catch (e) {
    console.error('Error removing capital from storage:', e);
  }
};

// Obchody
export const getTrades = async (): Promise<Trade[]> => {
  try {
    const val = await AsyncStorage.getItem(TRADES_KEY);
    // Robustná validácia: ak failne parse, vráť []
    if (!val) return [];
    try {
      const trades = JSON.parse(val);
      return Array.isArray(trades) ? trades : [];
    } catch {
      return [];
    }
  } catch (e) {
    console.error('Error loading trades from storage:', e);
    return [];
  }
};

export const setTrades = async (trades: Trade[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(TRADES_KEY, JSON.stringify(trades));
  } catch (e) {
    console.error('Error saving trades to storage:', e);
  }
};

export const removeTrades = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TRADES_KEY);
  } catch (e) {
    console.error('Error removing trades from storage:', e);
  }
};

// Vymaž všetky dáta aplikácie (tvrdý reset)
export async function resetAllData() {
  try {
    await AsyncStorage.clear();
  } catch (err) {
    // Možno logovať chybu, ak chceš
  }
}