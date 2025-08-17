import React from "react";
import renderer, { act } from "react-test-renderer";
import useCalendarGoal, { CalendarGoal } from "./useCalendarGoal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { daysBetween, calcCompoundDailyRate } from "../utils/calendarMath";

// Mock AsyncStorage with in-memory store
jest.mock("@react-native-async-storage/async-storage", () => {
  let store: Record<string, string> = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn((key: string) => Promise.resolve(store[key] ?? null)),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
        return Promise.resolve();
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
        return Promise.resolve();
      }),
      clear: jest.fn(() => {
        store = {};
        return Promise.resolve();
      }),
    },
  };
});

// Helper to render the hook with ability to rerender with different equity
function renderHookWithEquity(currentEquity: number) {
  const result: { current: ReturnType<typeof useCalendarGoal> } = {
    current: null as any,
  };
  const TestComponent = ({ equity }: { equity: number }) => {
    result.current = useCalendarGoal(equity);
    return null;
  };
  const element = React.createElement(TestComponent, { equity: currentEquity });
  let testRenderer: renderer.ReactTestRenderer;
  act(() => {
    testRenderer = renderer.create(element);
  });
  return {
    result,
    rerender: (equity: number) =>
      testRenderer.update(React.createElement(TestComponent, { equity })),
  };
}

const flush = () => new Promise((resolve) => setImmediate(resolve));

beforeEach(async () => {
  await (AsyncStorage as any).clear();
  jest.clearAllMocks();
});

describe("useCalendarGoal", () => {
  test("loads goal from AsyncStorage and computes nDays and dailyRate", async () => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 9); // 10 days including today
    const goal: CalendarGoal = {
      targetAmount: 2000,
      targetDate: targetDate.toISOString().slice(0, 10),
    };
    await AsyncStorage.setItem("calendar_goal", JSON.stringify(goal));

    const { result } = renderHookWithEquity(1000);
    await act(async () => {
      await flush();
    });

    expect(result.current.goal).toEqual(goal);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith("calendar_goal");

    const expectedDays = daysBetween(new Date(), goal.targetDate);
    const expectedRate = calcCompoundDailyRate(1000, goal.targetAmount, expectedDays);
    expect(result.current.nDays).toBe(expectedDays);
    expect(result.current.dailyRate).toBeCloseTo(expectedRate);
  });

  test("saves and removes goal in AsyncStorage", async () => {
    const { result } = renderHookWithEquity(1000);
    await act(async () => {
      await flush();
    });
    expect(result.current.goal).toBeNull();

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 4);
    const goal: CalendarGoal = {
      targetAmount: 1500,
      targetDate: targetDate.toISOString().slice(0, 10),
    };

    await act(async () => {
      await result.current.saveGoal(goal);
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith("calendar_goal", JSON.stringify(goal));
    expect(result.current.goal).toEqual(goal);

    await act(async () => {
      await result.current.removeGoal();
    });

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith("calendar_goal");
    expect(result.current.goal).toBeNull();
    expect(result.current.nDays).toBe(0);
    expect(result.current.dailyRate).toBe(0);
    expect(await AsyncStorage.getItem("calendar_goal")).toBeNull();
  });

  test("handles nDays and dailyRate for various inputs", async () => {
    const { result, rerender } = renderHookWithEquity(0);
    await act(async () => {
      await flush();
    });
    expect(result.current.nDays).toBe(0);
    expect(result.current.dailyRate).toBe(0);

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);
    const goal: CalendarGoal = {
      targetAmount: 1000,
      targetDate: targetDate.toISOString().slice(0, 10),
    };

    await act(async () => {
      await result.current.saveGoal(goal);
    });

    expect(result.current.nDays).toBe(daysBetween(new Date(), goal.targetDate));
    expect(result.current.dailyRate).toBe(0); // equity 0 => rate 0

    await act(() => {
      rerender(500);
    });

    const expectedDays = daysBetween(new Date(), goal.targetDate);
    const expectedRate = calcCompoundDailyRate(500, goal.targetAmount, expectedDays);
    expect(result.current.nDays).toBe(expectedDays);
    expect(result.current.dailyRate).toBeCloseTo(expectedRate);
  });
});

