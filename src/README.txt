src/
├── components/
│   ├── EquityChart/
│   │   ├── ChartAxes.tsx           <-- Renderuje SVG osy, ticky a popisky podľa škál
│   │   ├── ChartBranches.tsx       <-- Interaktívne vetvy profit/loss, napojené na onBranchPress
│   │   ├── ChartHistoryLine.tsx    <-- Vykresľuje historickú equity čiaru (segmentovanú podľa null slotov)
│   │   └── index.tsx               <-- Hlavný komponent EquityChart – kombinuje osy, čiaru, vetvy, zoom/pan
│   └── TradeForm.tsx               <-- Formulár pre zadanie risk/reward, validácie, varovanie pri veľkom riske
│
├── hooks/
│   ├── useChartScales.ts           <-- Logika škálovania grafu, výpočty okna, tickov, baseline
│   └── useTradeHistory.ts          <-- Centralizovaná logika obchodov: kapitál, obchody, štatistiky, undo/reset, type-safe API
│
├── navigation/
│   └── AppNavigator.tsx            <-- Stack navigácia medzi WelcomeScreen a TradingScreen (typované props)
│
├── screens/
│   ├── WelcomeScreen.tsx           <-- Úvodná obrazovka (zadanie kapitálu, validácia, redirect)
│   └── TradingScreen.tsx           <-- Hlavná obrazovka: graf, obchodovanie, štatistiky, ovládacie akcie (reset, undo)
│
├── storage/
│   └── persist.ts                  <-- Type-safe AsyncStorage API pre kapitál a obchody, exportuje aj typ Trade
│
└── utils/
    └── chartScales.ts              <-- Čisto výpočtové funkcie pre graf (škály, domény, baseline, ticky, padding)

