import React, { useState, useEffect } from 'react';
import { G, Line } from 'react-native-svg';

/**
 * Popisuje jednu vetvu (čiaru) pre profit alebo loss – 
 * obsahuje začiatok a koniec vetvy v SVG súradniciach a typ vetvy.
 */
export interface BranchLine {
  /** X pozícia začiatku vetvy */
  x1: number;
  /** Y pozícia začiatku vetvy */
  y1: number;
  /** X pozícia konca vetvy */
  x2: number;
  /** Y pozícia konca vetvy */
  y2: number;
  /** Typ vetvy ('profit' alebo 'loss'), použité na štýlovanie */
  type: 'profit' | 'loss';
}

/**
 * Props pre ChartBranches komponent – obsahuje súradnice oboch vetiev a callback.
 */
interface Props {
  /** Geometria a typ vetvy pre ziskovú (profit) vetvu */
  profitBranch: BranchLine;
  /** Geometria a typ vetvy pre stratovú (loss) vetvu */
  lossBranch: BranchLine;
  /** Callback volaný po kliknutí na vetvu (profit alebo loss) */
  onBranchPress: (type: 'profit' | 'loss') => void;
}

/**
 * Komponent na vykreslenie interaktívnych vetiev (profit/loss) v equity grafe.
 * Každá vetva je klikateľná (široká neviditeľná čiara + viditeľná tenká čiara)
 * Po kliknutí sa stav zmení a vetva sa zvýrazní (biela), druhá zmizne.
 */
const ChartBranches: React.FC<Props> = ({ profitBranch, lossBranch, onBranchPress }) => {
  /**
   * selected – stav, ktorá vetva bola zvolená (null = ešte nevybratá, alebo po zmene dát).
   */
  const [selected, setSelected] = useState<'profit' | 'loss' | null>(null);

  /**
   * Resetuje stav (selected) vždy, keď sa zmení geometria vetiev (napr. po novom obchode)
   * Zabezpečí, že po zmene grafu je výber opäť možný.
   */
  useEffect(() => {
    setSelected(null);
  }, [profitBranch, lossBranch]);

  /**
   * Funkcia na kliknutie na vetvu – nastaví stav, zavolá callback do parenta.
   * Ak už je niečo vybraté (selected), neumožní ďalšie kliknutie.
   */
  const handlePress = (type: 'profit' | 'loss') => {
    if (selected) return;
    setSelected(type);
    onBranchPress(type);
  };

  return (
    <G>
      {/* --- PROFIT BRANCH --- */}
      {selected !== 'loss' && (
        <>
          {/* Neviditeľná široká čiara pre pohodlné kliknutie na profit vetvu */}
          <Line
            {...profitBranch}
            stroke="transparent"
            strokeWidth={20}
            onPress={() => handlePress('profit')}
          />
          {/* Viditeľná tenká čiara – po kliknutí sa zvýrazní bielou, inak zelenou */}
          <Line
            {...profitBranch}
            stroke={selected === 'profit' ? 'white' : 'lightgreen'}
            strokeWidth={2}
            strokeDasharray={selected === 'profit' ? undefined : [6, 4]}
          />
        </>
      )}

      {/* --- LOSS BRANCH --- */}
      {selected !== 'profit' && (
        <>
          {/* Neviditeľná široká čiara pre pohodlné kliknutie na loss vetvu */}
          <Line
            {...lossBranch}
            stroke="transparent"
            strokeWidth={20}
            onPress={() => handlePress('loss')}
          />
          {/* Viditeľná tenká čiara – po kliknutí sa zvýrazní bielou, inak červenou */}
          <Line
            {...lossBranch}
            stroke={selected === 'loss' ? 'white' : 'tomato'}
            strokeWidth={2}
            strokeDasharray={selected === 'loss' ? undefined : [6, 4]}
          />
        </>
      )}
    </G>
  );
};

export default ChartBranches;
