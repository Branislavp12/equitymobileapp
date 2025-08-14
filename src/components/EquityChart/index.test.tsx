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
});

