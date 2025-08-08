// src/components/EquityChart/useBranchGeometry.ts

interface BranchLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: 'profit' | 'loss';
}

interface UseBranchGeometryProps {
  lastIndex: number;
  lastValue: number;
  xScale: (index: number) => number;
  yScale: (value: number) => number;
  risk: number;
  reward: number;
}

export const useBranchGeometry = ({
  lastIndex,
  lastValue,
  xScale,
  yScale,
  risk,
  reward,
}: UseBranchGeometryProps): {
  profitBranch: BranchLine;
  lossBranch: BranchLine;
} => {
  const x1 = xScale(lastIndex);
  const y1 = yScale(lastValue);

  const profitValue = lastValue * (1 + reward / 100);
  const lossValue = lastValue * (1 - risk / 100);

  const x2 = xScale(lastIndex + 1); // vetva o 1 index doprava
  const y2Profit = yScale(profitValue);
  const y2Loss = yScale(lossValue);

  return {
    profitBranch: {
      x1,
      y1,
      x2,
      y2: y2Profit,
      type: 'profit',
    },
    lossBranch: {
      x1,
      y1,
      x2,
      y2: y2Loss,
      type: 'loss',
    },
  };
};
