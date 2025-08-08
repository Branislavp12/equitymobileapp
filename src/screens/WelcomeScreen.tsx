import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Card, Text, Input, Button, Spinner } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import { getCapital, setCapital } from '../storage/persist';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
type RootStackParamList = {
  Welcome: undefined;
  Main: undefined;
};
type WelcomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const [capital, setCapitalInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const existingCapital = await getCapital();
        if (typeof existingCapital === 'number' && existingCapital > 0) {
          navigation.replace('Main');
        } else {
          setLoading(false);
        }
      } catch (e) {
        console.error('Chyba pri načítaní kapitálu:', e);
        setLoading(false);
      }
    })();
  }, [navigation]);

  const validate = (val: string): string => {
    const n = Number(val);
    if (!val || isNaN(n)) return 'Zadaj sumu kapitálu.';
    if (n <= 0) return 'Kapitál musí byť väčší než 0.';
    return '';
  };

  const errorMsg = validate(capital);

  const handleStart = async () => {
    const parsed = Number(capital);
    const error = validate(capital);
    if (error) {
      setError(error);
      return;
    }

    try {
      setSubmitting(true);
      await setCapital(parsed);
      navigation.replace('Main');
    } catch (e) {
      console.error('Chyba pri ukladaní kapitálu:', e);
      setError('Nepodarilo sa uložiť kapitál.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout style={styles.centered}>
        <Spinner size="giant" />
      </Layout>
    );
  }

  return (
    <LinearGradient colors={['#23294D', '#383A7C']} style={styles.gradientBg}>
      <Layout level="2" style={styles.outer}>
        <Text category="h4" style={styles.title}>
          Interactive Equity
        </Text>
        <Card style={styles.card}>
        
          <Input
            style={styles.input}
            placeholder="Tvoj počiatočný kapitál (€)"
            keyboardType="numeric"
            value={capital}
            onChangeText={(text) => {
              setCapitalInput(text);
              setError('');
            }}
            status={errorMsg && capital ? 'danger' : 'basic'}
          />
          {errorMsg || error ? (
            <Text status="danger" appearance="hint" style={styles.error}>
              {error || errorMsg}
            </Text>
          ) : null}
          <Button
            style={styles.button}
            disabled={!!errorMsg || submitting}
            onPress={handleStart}
          >
            START
          </Button>
        </Card>
      </Layout>
    </LinearGradient>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'transparent',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 1,
  },
  card: {
    minWidth: 260,
    width: '88%',
    maxWidth: 340,
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    backgroundColor: 'transparent',
  },
  input: {
    width: 180,
    marginBottom: 12,
  },
  button: {
    width: 180,
    marginTop: 10,
  },
  error: {
    marginBottom: 6,
    textAlign: 'center',
    width: 180,
    fontSize: 13,
  },
});
