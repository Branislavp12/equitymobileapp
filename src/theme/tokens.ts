// src/theme/tokens.ts

export const tokens = {
  colors: {
    background: "#111",
    card: "#191919",
    surface: "#222",
    textPrimary: "#fff",
    textMuted: "#aaa",
    accentBlue: "#4061e1",
    accentGreen: '#3DDC84',
    accentRed: "#ff4c4c",
    transparent: "transparent",
    graphLine: '#ffffff',
  graphBaseline: '#888888',
  
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
  radius: {
    sm: 6,
    md: 12,
    lg: 18,
  },
  font: {
    family: "monospace",
    weightBold: 'bold' as const,
    weightNormal: 'normal' as const,
    weightMedium: '500' as const,
  },
  graph: {
  lineWidth: 2,
}
};