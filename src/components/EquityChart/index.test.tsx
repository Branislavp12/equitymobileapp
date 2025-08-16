import { describe, it, expect, beforeAll } from "@jest/globals";
import React from 'react';
import renderer, { act } from 'react-test-renderer';

import EquityChart from './index';
import ChartAxes from './ChartAxes';
import ChartHistoryLine from './ChartHistoryLine';

beforeAll(() => {
  // Disable development logs during tests
  // to avoid "Cannot log after tests are done" errors.
  // @ts-ignore
  global.__DEV__ = false;
});

describe('EquityChart component', () => {
  it('renders nothing when history is empty', () => {
    let tree: renderer.ReactTestRendererJSON | renderer.ReactTestRendererJSON[] | null;
    act(() => {
      tree = renderer
        .create(<EquityChart history={[]} initialCapital={1000} />)
        .toJSON();
    });
    expect(tree).toBeNull();
  });

  it('renders axes and history line for provided history', () => {
    let component: renderer.ReactTestRenderer;
    act(() => {
      component = renderer.create(
        <EquityChart history={[100, 105, 110]} initialCapital={1000} />
      );
    });

    expect(component.root.findByType(ChartAxes)).toBeTruthy();
    expect(component.root.findByType(ChartHistoryLine)).toBeTruthy();
  });

  it('handles panning controls and disables buttons at bounds', () => {
    const history = Array.from({ length: 20 }, (_, i) => 100 + i);
    let component: renderer.ReactTestRenderer;

    act(() => {
      component = renderer.create(
        <EquityChart history={history} initialCapital={1000} />
      );
    });

    const getAxes = () => component.root.findByType(ChartAxes);
    const getStartIndex = () => getAxes().props.startIndex;
    const getBtn = (text: string) => component.root.findByProps({ text });

    const maxPan = history.length - getAxes().props.nVisible;

    // Component autoscrolls to the end by default – reset to start
    act(() => {
      getBtn('\u21e4').props.onPress();
    });

    // Initial state at start of history
    expect(getStartIndex()).toBe(0);
    expect(getBtn('\u21e4').props.disabled).toBe(true); // ⇤
    expect(getBtn('right').props.disabled).toBe(true);

    // Pan left increases offset
    act(() => {
      getBtn('left').props.onPress();
    });
    expect(getStartIndex()).toBe(1);
    expect(getBtn('right').props.disabled).toBe(false);

    // Pan right decreases offset
    act(() => {
      getBtn('right').props.onPress();
    });
    expect(getStartIndex()).toBe(0);

    // Jump to end and verify max pan
    act(() => {
      getBtn('\u21e5').props.onPress(); // ⇥
    });
    expect(getStartIndex()).toBe(maxPan);
    expect(getBtn('\u21e5').props.disabled).toBe(true);

    // Jump back to start
    act(() => {
      getBtn('\u21e4').props.onPress();
    });
    expect(getStartIndex()).toBe(0);
    expect(getBtn('\u21e4').props.disabled).toBe(true);
    expect(getBtn('right').props.disabled).toBe(true);
  });
});

