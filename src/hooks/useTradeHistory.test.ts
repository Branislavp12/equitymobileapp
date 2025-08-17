import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import React from 'react';
import renderer, { act } from 'react-test-renderer';

import useTradeHistory from './useTradeHistory';
import type { Trade } from '../storage/persist';

// Mock storage functions
jest.mock('../storage/persist', () => ({
  getCapital: jest.fn(),
  setCapital: jest.fn(),
  removeCapital: jest.fn(),
  getTrades: jest.fn(),
  setTrades: jest.fn(),
  removeTrades: jest.fn(),
}));

// Avoid debounce delays in tests
jest.mock('lodash.debounce', () => (fn: any) => fn);

import {
  getCapital,
  getTrades,
  removeCapital,
  removeTrades,
} from '../storage/persist';

type HookResult = ReturnType<typeof useTradeHistory>;
let testRenderer: renderer.ReactTestRenderer;

async function renderHook(initialCapital?: number): Promise<{ current: HookResult }> {
  const result: { current: HookResult } = { current: undefined as any };

  function TestComponent() {
    result.current = useTradeHistory(initialCapital);
    return null;
  }

  await act(async () => {
    testRenderer = renderer.create(React.createElement(TestComponent));
  });

  // Flush pending promises from initial useEffect
  await act(async () => {});

  return result;
}

describe('useTradeHistory hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    if (testRenderer) {
      act(() => {
        testRenderer.unmount();
      });
    }
  });

  it('adds trades, computes equity curve and stats, and supports undo and resets', async () => {
    (getCapital as jest.Mock).mockResolvedValue(1000);
    (getTrades as jest.Mock).mockResolvedValue([]);

    const result = await renderHook();

    expect(result.current.initialCapital).toBe(1000);
    expect(result.current.trades).toHaveLength(0);
    expect(result.current.equityCurve).toEqual([1000]);

    await act(async () => {
      result.current.addTrade({ risk: 2, reward: 4, result: 'profit' });
    });

    expect(result.current.trades).toHaveLength(1);
    expect(result.current.equityCurve).toEqual([1000, 1040]);
    expect(result.current.stats).toEqual({ tradesCount: 1, winCount: 1, lossCount: 0, winrate: 100 });

    await act(async () => {
      result.current.addTrade({ risk: 2, reward: 4, result: 'loss' });
    });

    expect(result.current.trades).toHaveLength(2);
    expect(result.current.equityCurve).toEqual([1000, 1040, 1019.2]);
    expect(result.current.stats).toEqual({ tradesCount: 2, winCount: 1, lossCount: 1, winrate: 50 });

    await act(async () => {
      result.current.undoLastTrade();
    });

    expect(result.current.trades).toHaveLength(1);
    expect(result.current.equityCurve).toEqual([1000, 1040]);
    expect(result.current.stats).toEqual({ tradesCount: 1, winCount: 1, lossCount: 0, winrate: 100 });

    await act(async () => {
      result.current.resetHistory();
    });

    expect(result.current.trades).toHaveLength(0);
    expect(removeTrades).toHaveBeenCalledTimes(1);

    await act(async () => {
      result.current.addTrade({ risk: 1, reward: 2, result: 'profit' });
      result.current.resetAccount();
    });

    expect(result.current.trades).toHaveLength(0);
    expect(result.current.initialCapital).toBe(0);
    expect(removeTrades).toHaveBeenCalledTimes(2);
    expect(removeCapital).toHaveBeenCalledTimes(1);
  });

  it('filters invalid stored capital and trades', async () => {
    (getCapital as jest.Mock).mockResolvedValue(-100);

    const validTrade: Trade = {
      id: '1',
      timestamp: 1,
      risk: 1,
      reward: 1,
      result: 'profit',
      equityBefore: 1000,
      equityAfter: 1010,
    };

    const invalidTrade = { id: 2, result: 'loss' } as any;

    (getTrades as jest.Mock).mockResolvedValue([validTrade, invalidTrade]);

    const result = await renderHook();

    expect(result.current.initialCapital).toBe(0);
    expect(removeCapital).toHaveBeenCalledTimes(1);

    expect(result.current.trades).toEqual([validTrade]);
  });
});

