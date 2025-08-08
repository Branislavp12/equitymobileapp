// App.js
import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';        // <-- DOPLNIŤ!
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />                 {/* <-- DOPLNIŤ! */}
      <ApplicationProvider {...eva} theme={eva.dark}>
        <SafeAreaProvider>
          <RootNavigator />
        </SafeAreaProvider>
      </ApplicationProvider>
    </>
  );
}
