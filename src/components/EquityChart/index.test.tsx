import { describe, it, expect } from "@jest/globals";
import React from 'react';
import renderer from 'react-test-renderer';

import EquityChart from './index';
import ChartAxes from './ChartAxes';
import ChartHistoryLine from './ChartHistoryLine';

describe('EquityChart component', () => {
  it('renders nothing when history is empty', () => {
    const tree = renderer
      .create(<EquityChart history={[]} initialCapital={1000} />)
      .toJSON();
    expect(tree).toBeNull();
  });

  it('renders axes and history line for provided history', () => {
    const component = renderer.create(
      <EquityChart history={[100, 105, 110]} initialCapital={1000} />
    );

    expect(() => component.root.findByType(ChartAxes)).not.toThrow();
    expect(() => component.root.findByType(ChartHistoryLine)).not.toThrow();
  });
});
