// src/hooks/useTradeHistory.ts

import { useState, useCallback, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import {
  getTrades,
  setTrades as saveTrades,
  removeTrades,
  getCapital,
  setCapital as saveCapital,
  removeCapital,
  Trade as TradeType // typ z persist.ts
} from '../storage/persist';

// Typ výsledku obchodu
export type TradeResult = 'profit' | 'loss';

// Typ nového obchodu na pridanie
export interface TradeParams {
  risk: number;
  reward: number;
  result: TradeResult;
}

// Hook state a návratový typ
export interface UseTradeHistoryReturn {
  trades: TradeType[];
  equityCurve: number[];
  addTrade: (params: TradeParams) => void;
  undoLastTrade: () => void;
  resetHistory: () => void;
  resetAccount: () => void;
  initialCapital: number;
  setInitialCapital: (value: number) => void;
  stats: {
    tradesCount: number;
    winCount: number;
    lossCount: number;
    winrate: number;
  };
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now();
}

function validateTrades(trades: any): TradeType[] {
  if (!Array.isArray(trades)) return [];
  return trades.filter((t: any) =>
    t &&
    typeof t.id === 'string' &&
    (t.result === 'profit' || t.result === 'loss') &&
    typeof t.equityAfter === 'number' &&
    typeof t.equityBefore === 'number'
  );
}

function isValidCapital(val: any): val is number {
  return typeof val === 'number' && isFinite(val) && val > 0;
}

export default function useTradeHistory(initialCapitalProp?: number): UseTradeHistoryReturn {
  const [capital, setCapitalState] = useState<number>(initialCapitalProp ?? 0);
  const [trades, setTrades] = useState<TradeType[]>([]);

  // Debounced persist (zabránime zbytočným zápisom do storage)
  const debouncedSaveTrades = useMemo(() => debounce((t: TradeType[]) => saveTrades(t), 300), []);

  useEffect(() => {
    (async () => {
      const [storedCapital, storedTrades] = await Promise.all([
        getCapital(),
        getTrades()
      ]);

      if (isValidCapital(storedCapital)) {
        setCapitalState(storedCapital);
      } else {
        setCapitalState(0);
        removeCapital();
      }

      const valid = validateTrades(storedTrades);
      setTrades(valid);
    })();
  }, []);

  useEffect(() => {
    debouncedSaveTrades(trades);
  }, [trades, debouncedSaveTrades]);

  useEffect(() => {
    if (isValidCapital(capital)) {
      saveCapital(capital);
    }
  }, [capital]);

  const setInitialCapital = useCallback((val: number) => {
    if (!isValidCapital(val)) return;
    setCapitalState(val);
    saveCapital(val);
    setTrades([]);
    removeTrades();
  }, []);

  const addTrade = useCallback(({ risk, reward, result }: TradeParams) => {
    setTrades(prev => {
      const equityBefore = prev.length === 0 ? capital : prev[prev.length - 1].equityAfter;
      const equityAfter = result === 'profit'
        ? Math.round((equityBefore * (1 + reward / 100)) * 100) / 100
        : Math.round((equityBefore * (1 - risk / 100)) * 100) / 100;
      return [
        ...prev,
        {
          id: generateId(),
          timestamp: Date.now(),
          risk,
          reward,
          result,
          equityBefore,
          equityAfter,
        },
      ];
    });
  }, [capital]);

  const undoLastTrade = useCallback(() => {
    setTrades(prev => prev.slice(0, -1));
  }, []);

  const resetHistory = useCallback(() => {
    setTrades([]);
    removeTrades();
  }, []);

  const resetAccount = useCallback(() => {
    setTrades([]);
    setCapitalState(0);
    removeTrades();
    removeCapital();
  }, []);

  const equityCurve = useMemo(
    () => [capital, ...trades.map(t => t.equityAfter)],
    [capital, trades]
  );

  const stats = useMemo(() => ({
    tradesCount: trades.length,
    winCount: trades.filter(t => t.result === 'profit').length,
    lossCount: trades.filter(t => t.result === 'loss').length,
    winrate: trades.length > 0
      ? Math.round(100 * trades.filter(t => t.result === 'profit').length / trades.length)
      : 0,
  }), [trades]);

  return {
    trades,
    equityCurve,
    addTrade,
    undoLastTrade,
    resetHistory,
    resetAccount,
    initialCapital: capital,
    setInitialCapital,
    stats,
  };
}
