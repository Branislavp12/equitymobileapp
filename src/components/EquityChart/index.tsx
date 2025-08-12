// src/components/EquityChart/index.tsx

import React, { useState, useEffect, useReducer } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg from 'react-native-svg';
import useChartScales from '../../hooks/useChartScales';
import ChartAxes from './ChartAxes';
import ChartHistoryLine from './ChartHistoryLine';
import ChartBranches from './ChartBranches';
import GhostButton from '../../ui/GhostButton';
import { tokens } from '../../theme/tokens';
import { useBranchGeometry } from './useBranchGeometry';

export interface EquityChartProps {
  history: Array<number | null>;
  initialCapital: number;
  risk?: number | null;
  reward?: number | null;
  onBranchPress?: (type: 'profit' | 'loss') => void;
  nTicks?: number;
}

const MIN_VISIBLE = 10;
const MAX_VISIBLE = 20;

const EquityChart: React.FC<EquityChartProps> = ({
  history,
  initialCapital,
  risk,
  reward,
  onBranchPress,
  nTicks = 10,
}) => {
  if (!Array.isArray(history) || history.length === 0) return null;

  const [yZoom, setYZoom] = useState<number>(10);

  interface State {
    nVisible: number;
    panOffset: number;
  }

  const reducer = (state: State, payload: Partial<State>): State => ({
    ...state,
    ...payload,
  });

  const [{ nVisible, panOffset }, dispatch] = useReducer(reducer, {
    nVisible: 11,
    panOffset: 0,
  });

  const maxPan = Math.max(0, history.length - nVisible);
  const startIndex = Math.max(0, panOffset);


  useEffect(() => {
    const maxPanNow = Math.max(0, history.length - nVisible);
    if (panOffset > maxPanNow) {
      dispatch({ panOffset: maxPanNow });
    }
  }, [nVisible, history.length, panOffset]);

  const {
    yScale,
    yticks,
    xScale,
    width,
    height,
    margin,
    windowedHistory,
  } = useChartScales({
    history,
    nVisible,
    panOffset: startIndex,
    nTicks,
    initialCapital,
    yZoom,
  });

  const visiblePoints: [number, number | null][] = windowedHistory.map(
    (y, i) => [startIndex + i, y]
  );

  const lastWindowIndex = [...windowedHistory].reverse().findIndex(y => y != null);
  const lastValue = windowedHistory[windowedHistory.length - 1 - lastWindowIndex] ?? null;
  const lastIndex = startIndex + (windowedHistory.length - 1 - lastWindowIndex);

   if (__DEV__) {
    console.log('[INIT] history.length =', history.length);
    console.log('[INIT] nVisible =', nVisible);
    console.log('[INIT] maxPan =', maxPan);
    console.log('[INIT] panOffset =', panOffset);
    console.log('[INIT] startIndex =', startIndex);
    console.log('[INIT] windowedHistory =', windowedHistory);
  }


  const zoomIn = () => {
    const newVisible = Math.max(MIN_VISIBLE, nVisible - 1);
    const newStart = Math.min(startIndex + 1, history.length - newVisible);
    if (__DEV__) {
      console.log(
        '[ZOOM-X] Zooming IN → startIndex:',
        startIndex,
        '→',
        newStart,
        '| nVisible:',
        nVisible,
        '→',
        newVisible
      );
    }
    dispatch({ nVisible: newVisible, panOffset: newStart });
  };

  const zoomOut = () => {
    const newVisible = Math.min(MAX_VISIBLE, nVisible + 1);
    const newStart = Math.max(0, startIndex - 1);
    if (__DEV__) {
      console.log(
        '[ZOOM-X] Zooming OUT → startIndex:',
        startIndex,
        '→',
        newStart,
        '| nVisible:',
        nVisible,
        '→',
        newVisible
      );
    }
    dispatch({ nVisible: newVisible, panOffset: newStart });
  };
  const yZoomIn = () => setYZoom(prev => Math.min(prev * 2, 16));
  const yZoomOut = () => setYZoom(prev => Math.max(prev / 2, 0.1));
  const panStep = Math.max(1, Math.floor(nVisible * 0.1));
  const panLeft = () => dispatch({ panOffset: panOffset + panStep });
  const panRight = () => dispatch({ panOffset: Math.max(panOffset - panStep, 0) });
  const goToStart = () => dispatch({ panOffset: 0 });
  const goToEnd = () => dispatch({ panOffset: maxPan });

  // AUTOSCROLL LOGIKA
  const autoScrollIfNeeded = () => {
    const latestIndex = history.length - 1;
    const threshold = startIndex + Math.floor(nVisible * 0.7);
    const shouldScroll = latestIndex >= threshold;
    const idealOffset = Math.max(0, latestIndex - Math.floor(nVisible * 0.7));

    if (__DEV__) {
      console.log('[AUTOSCROLL] lastIndex =', history.length - 1);
      console.log(
        '[AUTOSCROLL] scrollThreshold =',
        startIndex + Math.floor(nVisible * 0.7)
      );
      console.log(
        '[AUTOSCROLL] Should scroll?',
        history.length - 1 >= startIndex + Math.floor(nVisible * 0.7)
      );
      console.log(
        '[AUTOSCROLL] Setting panOffset to:',
        Math.max(0, history.length - 1 - Math.floor(nVisible * 0.7))
      );
    }

    if (shouldScroll) {
      dispatch({ panOffset: idealOffset });
    }
  };

  useEffect(() => {
    autoScrollIfNeeded();
  }, [history.length]);

  const handleBranchPress = (type: 'profit' | 'loss') => {
    if (risk != null && reward != null && onBranchPress) {
      if (__DEV__) {
        console.log('[EVENT] Branch pressed:', type);
      }
      onBranchPress(type);
      // autoscroll sa vykoná cez useEffect
    }
  };

  const shouldRenderBranches =
    lastWindowIndex !== -1 &&
    typeof risk === 'number' &&
    typeof reward === 'number' &&
    lastValue != null &&
    typeof onBranchPress === 'function';

  const { profitBranch, lossBranch } = shouldRenderBranches
    ? useBranchGeometry({ lastIndex, lastValue, xScale, yScale, risk, reward })
    : { profitBranch: null, lossBranch: null };

  return (
    <View style={styles.wrapper}>
      <View style={styles.controls}>
        <GhostButton text="in" onPress={zoomIn} disabled={nVisible <= MIN_VISIBLE} />
        <GhostButton text="out" onPress={zoomOut} disabled={nVisible >= Math.min(MAX_VISIBLE, history.length)} />
        <GhostButton text="yin" onPress={yZoomIn} disabled={yZoom >= 16} />
        <GhostButton text="yout" onPress={yZoomOut} disabled={yZoom <= 0.1} />
        <GhostButton text="⇤" onPress={goToStart} disabled={panOffset === 0} />
        <GhostButton text="left" onPress={panLeft}  disabled={panOffset >= history.length-2} />
        <GhostButton text="right" onPress={panRight} disabled={panOffset <= 0} />
        <GhostButton text="⇥" onPress={goToEnd} disabled={panOffset === maxPan} />
      </View>

      <Svg width={width} height={height} style={styles.svg}>
        <ChartAxes
          xScale={xScale}
          yScale={yScale}
          yticks={yticks}
          width={width}
          height={height}
          margin={margin}
          nVisible={nVisible}
          startIndex={startIndex}
        />
        <ChartHistoryLine history={visiblePoints} xScale={xScale} yScale={yScale} />
        {shouldRenderBranches && profitBranch && lossBranch && (
          <ChartBranches
            profitBranch={profitBranch}
            lossBranch={lossBranch}
            onBranchPress={handleBranchPress}
          />
        )}
      </Svg>
    </View>
  );
};

export default EquityChart;

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: tokens.spacing.md,
    alignItems: 'center',
  },
  svg: {
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.md,
    overflow: 'hidden',
  },
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.sm,
  },
});
