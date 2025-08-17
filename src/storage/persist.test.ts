import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCapital, setCapital, removeCapital, getTrades, setTrades, removeTrades, type Trade } from './persist';

jest.mock('@react-native-async-storage/async-storage', () => {
  let store: Record<string, string> = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(async (key: string) => (key in store ? store[key] : null)),
      setItem: jest.fn(async (key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: jest.fn(async (key: string) => {
        delete store[key];
      }),
      clear: jest.fn(async () => {
        store = {};
      }),
    },
  };
});

describe('persist storage', () => {
  const CAPITAL_KEY = '@equity_app/capital';
  const TRADES_KEY = '@equity_app/trades';

  beforeEach(async () => {
    await (AsyncStorage.clear as jest.Mock)();
    jest.clearAllMocks();
  });

  it('handles capital operations', async () => {
    await setCapital(100);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(CAPITAL_KEY, '100');
    const capital = await getCapital();
    expect(capital).toBe(100);
    await removeCapital();
    const removed = await getCapital();
    expect(removed).toBeNull();
  });

  it('handles trade operations', async () => {
    const trades: Trade[] = [
      { id: '1', timestamp: 1, risk: 1, reward: 2, result: 'profit', equityBefore: 100, equityAfter: 102 },
    ];
    await setTrades(trades);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(TRADES_KEY, JSON.stringify(trades));
    const loaded = await getTrades();
    expect(loaded).toEqual(trades);
    await removeTrades();
    const empty = await getTrades();
    expect(empty).toEqual([]);
  });

  it('returns empty array when trades JSON is invalid', async () => {
    await AsyncStorage.setItem(TRADES_KEY, 'not-json');
    const loaded = await getTrades();
    expect(loaded).toEqual([]);
  });
});

