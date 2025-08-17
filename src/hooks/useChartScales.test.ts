import { describe, it, expect, beforeAll } from '@jest/globals';
import React from 'react';
import renderer, { act } from 'react-test-renderer';

import useChartScales from './useChartScales';

beforeAll(() => {
  // Disable development logs in tests
  // @ts-ignore
  global.__DEV__ = false;
});

function renderHook(props: Parameters<typeof useChartScales>[0]) {
  let hookResult: ReturnType<typeof useChartScales>;
  function TestComponent() {
    hookResult = useChartScales(props);
    return null;
  }
  act(() => {
    renderer.create(React.createElement(TestComponent));
  });
  return hookResult!;
}

describe('useChartScales hook', () => {
  it('calculates scales and windowed history for given params', () => {
    const result = renderHook({
      history: [100, 105, null, 95, 110, 90],
      nVisible: 3,
      panOffset: 1,
      nTicks: 5,
      initialCapital: 100,
      yZoom: 1,
    });

    expect(result.windowedHistory).toEqual([105, null, 95]);
    expect(result.maxPan).toBe(3);
    expect(result.xScale.domain()).toEqual([1, 3]);
    expect(result.yScale.domain()).toEqual([94.5, 105.5]);

    const snapshot = {
      xScale: {
        domain: result.xScale.domain(),
        range: result.xScale.range(),
      },
      yScale: {
        domain: result.yScale.domain(),
        range: result.yScale.range(),
      },
      yticks: result.yticks,
      width: result.width,
      height: result.height,
      margin: result.margin,
      windowedHistory: result.windowedHistory,
      maxPan: result.maxPan,
      startIndex: result.startIndex,
      nVisible: result.nVisible,
    };
    expect(snapshot).toMatchSnapshot();
  });

  it('supports custom zoom and includes initial capital in domain', () => {
    const result = renderHook({
      history: [1, 2, 3, 4, 5, 6],
      nVisible: 4,
      panOffset: 0,
      nTicks: 5,
      initialCapital: 0,
      yZoom: 2,
    });

    expect(result.windowedHistory).toEqual([1, 2, 3, 4]);
    expect(result.maxPan).toBe(2);
    expect(result.xScale.domain()).toEqual([0, 3]);
    expect(result.yScale.domain()).toEqual([-0.4, 4.4]);

    const snapshot = {
      xScale: {
        domain: result.xScale.domain(),
        range: result.xScale.range(),
      },
      yScale: {
        domain: result.yScale.domain(),
        range: result.yScale.range(),
      },
      yticks: result.yticks,
      width: result.width,
      height: result.height,
      margin: result.margin,
      windowedHistory: result.windowedHistory,
      maxPan: result.maxPan,
      startIndex: result.startIndex,
      nVisible: result.nVisible,
    };
    expect(snapshot).toMatchSnapshot();
  });

  it('expands y domain and generates ticks for flat history', () => {
    const history = Array(5).fill(100);
    const result = renderHook({
      history,
      nVisible: 5,
      panOffset: 0,
      nTicks: 10,
      initialCapital: 100,
      yZoom: 1,
    });

    expect(result.maxPan).toBe(0);
    expect(result.windowedHistory).toEqual(history);
    expect(result.yScale.domain()).toEqual([50, 150]);
    expect(result.yticks.length).toBe(11);

    const snapshot = {
      xScale: {
        domain: result.xScale.domain(),
        range: result.xScale.range(),
      },
      yScale: {
        domain: result.yScale.domain(),
        range: result.yScale.range(),
      },
      yticks: result.yticks,
      width: result.width,
      height: result.height,
      margin: result.margin,
      windowedHistory: result.windowedHistory,
      maxPan: result.maxPan,
      startIndex: result.startIndex,
      nVisible: result.nVisible,
    };
    expect(snapshot).toMatchSnapshot();
  });
});

