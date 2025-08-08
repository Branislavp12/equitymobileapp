// src/components/EquityChart/ChartHistoryLine.tsx

import React from 'react';
import { Path } from 'react-native-svg';
import { line as d3Line, curveLinear } from 'd3-shape';
import { ScaleLinear } from 'd3-scale'; // Dôležité pre typovanie
import { tokens } from '../../theme/tokens';

interface ChartHistoryLineProps {
  history: Array<[number, number | null]>; // [index, value]
  xScale: ScaleLinear<number, number>;      // D3 scaleLinear objekt!
  yScale: (value: number) => number;
}

const ChartHistoryLine: React.FC<ChartHistoryLineProps> = ({
  history,
  xScale,
  yScale,
}) => {
  if (!history || history.length === 0) return null;

  const nonNullSegments: Array<Array<[number, number]>> = [];
  let segment: Array<[number, number]> = [];

  history.forEach(([i, y]) => {
    if (y != null) {
      segment.push([i, y]);
    } else if (segment.length > 0) {
      nonNullSegments.push([...segment]);
      segment = [];
    }
  });
  if (segment.length > 0) nonNullSegments.push([...segment]);

  return (
    <>
      {nonNullSegments.map((seg, idx) =>
        seg.length === 1 ? (
          <Path
            key={idx}
            d={`M${xScale(seg[0][0])},${yScale(seg[0][1])} L${xScale(seg[0][0] + 1)},${yScale(seg[0][1])}`}
            fill="none"
            stroke={tokens.colors.graphBaseline}
            strokeWidth={tokens.graph.lineWidth}
            strokeDasharray="4 4"
          />
        ) : (
          <Path
            key={idx}
            d={
              d3Line<[number, number]>()
                .x(([i]) => xScale(i)) // D3 scaleLinear!
                .y(([_, y]) => yScale(y))
                .curve(curveLinear)(seg) || undefined
            }
            fill="none"
            stroke={tokens.colors.graphLine}
            strokeWidth={tokens.graph.lineWidth}
          />
        )
      )}
    </>
  );
};

export default ChartHistoryLine;
