module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|expo-.*|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|d3-scale|d3-array|d3-format|d3-interpolate|d3-color|d3-time|d3-time-format|internmap|d3-shape|d3-path)/)",
    "node_modules/react-native-reanimated/plugin/",
  ],
};

