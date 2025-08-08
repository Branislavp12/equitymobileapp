// src/components/EquityChart/ChartAxes.tsx

import React from 'react';
import { G, Line, Text } from 'react-native-svg';
import { ScaleLinear } from 'd3-scale';
import { tokens } from '../../theme/tokens';

type Margin = { top: number; right: number; bottom: number; left: number };

interface ChartAxesProps {
  xScale: ScaleLinear<number, number>; // D3 scaleLinear objekt pre X
  yScale: ScaleLinear<number, number>;
  yticks: number[];
  width: number;
  height: number;
  margin: Margin;
  nVisible: number;
  startIndex: number;
}

const ChartAxes: React.FC<ChartAxesProps> = ({
  xScale,
  yScale,
  yticks,
  width,
  height,
  margin,
  nVisible,
  startIndex,
}) => {
  // Generuj X-ticky cez D3 scale.ticks()
  const xticks = xScale.ticks(Math.min(10, nVisible));

  return (
    <G>
      {/* Y os */}
      <Line
        x1={xScale(startIndex)}
        y1={margin.top}
        x2={xScale(startIndex)}
        y2={height - margin.bottom}
        stroke={tokens.colors.textMuted}
        strokeWidth={1}
      />

      {/* X os */}
      <Line
        x1={xScale(startIndex)}
        y1={height - margin.bottom}
        x2={xScale(startIndex + nVisible - 1)}
        y2={height - margin.bottom}
        stroke={tokens.colors.textMuted}
        strokeWidth={1}
      />

      {/* Y-ticky */}
      {yticks.map((tick, i) => (
        <G key={`ytick-${tick}-${i}`}>
          <Line
            x1={xScale(startIndex) - 5}
            x2={xScale(startIndex)}
            y1={yScale(tick)}
            y2={yScale(tick)}
            stroke={tokens.colors.graphBaseline}
            strokeWidth={1}
          />
          <Text
            x={xScale(startIndex) - 8}
            y={yScale(tick) + 3}
            fill={tokens.colors.textMuted}
            fontSize="10"
            fontFamily={tokens.font.family}
            textAnchor="end"
          >
            {tick}
          </Text>
        </G>
      ))}

      {/* X-ticky - generované cez D3 scale.ticks() */}
      {xticks.map((tick) => {
        const x = xScale(tick);
        return (
          <G key={`xtick-${tick}`}>
            <Line
              x1={x}
              x2={x}
              y1={height - margin.bottom}
              y2={height - margin.bottom + 4}
              stroke={tokens.colors.graphBaseline}
              strokeWidth={1}
            />
            <Text
              x={x}
              y={height - margin.bottom + 14}
              fill={tokens.colors.textMuted}
              fontSize="10"
              fontFamily={tokens.font.family}
              textAnchor="middle"
            >
              {Math.round(tick)}
            </Text>
          </G>
        );
      })}
    </G>
  );
};

export default ChartAxes;
