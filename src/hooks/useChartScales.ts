import { useMemo } from 'react';
import { scaleLinear } from 'd3-scale';

/**
 * Vstupné parametre pre výpočet mierky grafu (škály, okna, tickov, paddingu atď.)
 */
interface ChartScalesProps {
  /**
   * Celá história equity krivky – pole čísel alebo null (medzery).
   * Každý prvok je stav účtu po jednom obchode, null znamená výpadok dát.
   */
  history: Array<number | null>;

  /**
   * Počet bodov, ktoré budú naraz viditeľné na X osi (zoom level).
   * Čím menšie, tým väčší detail (zoom in), čím väčšie, tým viac bodov naraz (zoom out).
   */
  nVisible: number;

  /**
   * Počet bodov, o ktoré je graf posunutý (scroll – "panovanie").
   * 0 = začínaš na začiatku histórie, maxPan = posledné možné okno.
   */
  panOffset: number;

  /**
   * Počet tickov (čiarkok/popiskov) na Y osi grafu.
   * D3 automaticky rozloží ticky na "pekné" hodnoty v rozsahu osy.
   */
  nTicks: number;

  /**
   * Počiatočný kapitál – je vždy zahrnutý do rozsahu Y osy.
   */
  initialCapital: number;

  /**
   * Vertikálny zoom – násobí rozpätie Y osy (1 = normálne, >1 = natiahne, <1 = stlačí).
   */
  yZoom: number;
}

/**
 * Hook na výpočet všetkých mierok, okna, tickov a dimenzií grafu pre interaktívny equity chart.
 * Vráti objekt so škálami, oknom, rozmermi, tickmi aj paddingom – stačí zapojiť do SVG a graf funguje.
 */
export default function useChartScales({
  history,
  nVisible,
  panOffset,
  nTicks,
  initialCapital,
  yZoom,
}: ChartScalesProps) {
  /**
   * Okraje SVG grafu (v pixeloch) – určujú priestor pre popisky osí a gridu.
   * Ladiť môžeš podľa UI – ak potrebuješ viac miesta na čísla na Y osi, zvýš left.
   */
  const MARGIN = { top: 24, right: 16, bottom: 28, left: 42 };

  /**
   * Výška SVG grafu v px (ovplyvňuje rozpätie Y osy a "zvislý priestor" na krivku).
   */
  const CHART_HEIGHT = 220;

  /**
   * Šírka SVG grafu v px (ovplyvňuje hustotu X osi, fit-to-width a "šírku" okna).
   */
  const CHART_WIDTH = 360;

  /**
   * Maximálny posun okna na X osi – zabraňuje, aby si scrolloval za koniec histórie.
   * Je to rozdiel medzi počtom bodov v histórii a veľkosťou okna.
   */
  const maxPan = Math.max(0, history.length - nVisible);

  /**
   * Skutočný index začiatku okna (reálny začiatok aktuálneho výrezu v histórii).
   * Ak panOffset je mimo dovoleného rozsahu, zarovná sa na najbližšiu povolenú hodnotu.
   */
  const startIndex = Math.max(0, panOffset);

  
  

  /**
   * Aktuálne vykresľovaný úsek histórie (len nVisible bodov v okne, podľa panovania).
   * Práve tieto hodnoty sa vizualizujú – slúži na výpočet minY, maxY, kreslenie krivky aj vetiev.
   */

/**
 * Aktuálne vykresľovaný úsek histórie (len nVisible bodov v okne, podľa panovania).
 * Práve tieto hodnoty sa vizualizujú – slúži na výpočet minY, maxY, kreslenie krivky aj vetiev.
 */
if (__DEV__) {
  console.log('----------------------------');
  console.log('[useChartScales] INPUT: history.length =', history.length);
  console.log('[useChartScales] INPUT: panOffset =', panOffset);
  console.log('[useChartScales] INPUT: nVisible =', nVisible);
  console.log('[useChartScales] INPUT: yZoom =', yZoom);
  console.log('[useChartScales] INPUT: initialCapital =', initialCapital);
}

  const windowedHistory = useMemo(
    () => history.slice(startIndex, startIndex + nVisible),
    [history, startIndex, nVisible]
  );
if (__DEV__) {
  console.log('[useChartScales] CALC: windowedHistory.length =', windowedHistory.length);
  console.log('[useChartScales] CALC: windowedHistory =', windowedHistory);
}
  /**
   * Najnižšia hodnota v aktuálnom okne (spodný okraj Y osy).
   * Vždy zahŕňa aj initialCapital – aby Y os nikdy "nepreskočila" nulu alebo počiatočný stav.
   * Ak chceš vždy začínať Y os od nuly, pridaj medzi argumenty Math.min(..., 0).
   */
  const minY = useMemo(() => {
    const visible = windowedHistory.filter(v => typeof v === 'number') as number[];
    return Math.min(...visible, initialCapital);
  }, [windowedHistory, initialCapital]);

  /**
   * Najvyššia hodnota v aktuálnom okne (horný okraj Y osy).
   * Vždy zahŕňa aj initialCapital.
   */
  const maxY = useMemo(() => {
    const visible = windowedHistory.filter(v => typeof v === 'number') as number[];
    return Math.max(...visible, initialCapital);
  }, [windowedHistory, initialCapital]);
 // NOVÁ LOGIKA: zabezpečí, že aj pri jednom bode bude Y os rozdelená na 10 tickov s odstupom 10%
  const isFlat = minY === maxY;
const base = isFlat ? Math.abs(minY) : (maxY - minY);
// Pri jednom bode - doména je od -50% po +50% hodnoty
const domainMargin = isFlat ? base * 0.5 : base * 0.05 * yZoom;
const domain = [
  minY - domainMargin,
  maxY + domainMargin,
];
const yScale = useMemo(() => {
  return scaleLinear()
    .domain(domain)
    .range([CHART_HEIGHT - MARGIN.bottom, MARGIN.top]);
}, [domain[0], domain[1]]);

  /**
   * yticks – pole tickov (čísel), kde budú popisky/čiarky na Y osi.
   * Počet určuješ cez nTicks, hodnoty rozdelí D3 na "pekné" pozície v doméne Y osy.
   */
const yticks = useMemo(() => {
  if (isFlat) {
    const tickInterval = base * 0.1;
    return Array.from({ length: 11 }, (_, i) => minY - 0.5 * base + i * tickInterval);
  }
  return yScale.ticks(10);
}, [yScale, isFlat, minY, base]);



  /**
   * xScale – funkcia na mapovanie globálneho indexu na X pozíciu v SVG.
   * Doména = [startIndex, startIndex + nVisible - 1] (len viditeľné okno, nie celá história!).
   * Range je fit-to-width – medzi margin.left a margin.right.
   * Ak chceš graf natiahnuť na celú šírku, uprav CHART_WIDTH alebo margin.right/left.
   */
  const xScale = useMemo(() => {
    return scaleLinear()
      .domain([startIndex, startIndex + nVisible - 1])
      .range([MARGIN.left, CHART_WIDTH - MARGIN.right]);
  }, [startIndex, nVisible]);


if (__DEV__) {
  console.log('[useChartScales] SCALE: yScale.domain =', yScale.domain());
  console.log('[useChartScales] SCALE: xScale.domain =', xScale.domain());
  console.log('[useChartScales] SCALE: xScale.range =', xScale.range());
  console.log('[useChartScales] SCALE: yScale.range =', yScale.range());
  console.log('----------------------------');
}

  // ========== Výstup hooku – všetky potrebné výpočty na kreslenie grafu ==========
  return {
    /** Funkcia: hodnota (kapitál) -> Y pozícia v SVG */
    yScale,
    /** Array hodnôt, kde sú Y-ticky (popisky, gridy) */
    yticks,
    /** Funkcia: index bodu -> X pozícia v SVG (fit-to-width) */
    xScale,
    /** Šírka SVG grafu */
    width: CHART_WIDTH,
    /** Výška SVG grafu */
    height: CHART_HEIGHT,
    /** Marginy SVG (padding pre osy, popisky) */
    margin: MARGIN,
    /** Aktuálne vykresľovaný úsek dát (len viditeľné body v okne) */
    windowedHistory,
    /** Maximálny posun okna (panovanie v histórii) */
    maxPan,
    /** Index začiatku okna (prvý bod v aktuálnom výreze histórie) */
    startIndex,
    /** Počet bodov v okne (aktuálny zoom) */
    nVisible,
  };
}
