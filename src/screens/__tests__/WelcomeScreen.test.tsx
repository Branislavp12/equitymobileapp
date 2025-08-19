import { describe, it, expect, beforeAll, jest, beforeEach } from '@jest/globals';
import React from 'react';
import renderer, { act } from 'react-test-renderer';

import WelcomeScreen from '../WelcomeScreen';
import { getCapital, setCapital } from '../../storage/persist';

jest.mock('@ui-kitten/components', () => {
  const React = require('react');
  const { View, Text, TextInput, TouchableOpacity } = require('react-native');
  return {
    Layout: ({ children }: any) => <View>{children}</View>,
    Card: ({ children }: any) => <View>{children}</View>,
    Text: ({ children, ...props }: any) => <Text {...props}>{children}</Text>,
    Input: ({ value, onChangeText, ...props }: any) => (
      <TextInput value={value} onChangeText={onChangeText} {...props} />
    ),
    Button: ({ children, onPress }: any) => (
      <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>
    ),
    Spinner: () => null,
  };
});

jest.mock('../../storage/persist', () => ({
  getCapital: jest.fn(),
  setCapital: jest.fn(),
}));

const flush = () => new Promise(resolve => setImmediate(resolve));

beforeAll(() => {
  // Disable development logs during tests
  // @ts-ignore
  global.__DEV__ = false;
});

describe('WelcomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('navigates to Main if existing capital', async () => {
    (getCapital as jest.Mock).mockResolvedValue(100);
    const navigation = { replace: jest.fn() } as any;

    await act(async () => {
      renderer.create(<WelcomeScreen navigation={navigation} />);
      await flush();
    });

    expect(navigation.replace).toHaveBeenCalledWith('Main');
  });

  it.each([
    ['', 'Zadaj sumu kapitálu.'],
    ['0', 'Kapitál musí byť väčší než 0.'],
  ])('shows error message for invalid input %p', async (inputValue, expectedError) => {
    (getCapital as jest.Mock).mockResolvedValue(null);
    const navigation = { replace: jest.fn() } as any;
    let component: renderer.ReactTestRenderer;

    await act(async () => {
      component = renderer.create(<WelcomeScreen navigation={navigation} />);
      await flush();
    });

    const input = component!.root.findByProps({ placeholder: 'Tvoj počiatočný kapitál (€)' });
    const startBtn = component!.root.findAll(node => node.props.onPress && node.props.children === 'START')[0];

    act(() => {
      input.props.onChangeText(inputValue);
    });
    act(() => {
      startBtn.props.onPress();
    });

    const errorNode = component!.root.findAll(node => node.props.children === expectedError)[0];
    expect(errorNode).toBeTruthy();
    expect(navigation.replace).not.toHaveBeenCalled();
  });

  it('shows storage error when setCapital fails', async () => {
    (getCapital as jest.Mock).mockResolvedValue(null);
    (setCapital as jest.Mock).mockRejectedValue(new Error('fail'));
    const navigation = { replace: jest.fn() } as any;
    let component: renderer.ReactTestRenderer;
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      component = renderer.create(<WelcomeScreen navigation={navigation} />);
      await flush();
    });

    const input = component!.root.findByProps({ placeholder: 'Tvoj počiatočný kapitál (€)' });
    const startBtn = component!.root.findAll(node => node.props.onPress && node.props.children === 'START')[0];

    await act(async () => {
      input.props.onChangeText('100');
    });

    await act(async () => {
      await startBtn.props.onPress();
      await flush();
    });

    const errorNode = component!.root.findAll(node => node.props.children === 'Nepodarilo sa uložiť kapitál.')[0];
    expect(errorNode).toBeTruthy();
    expect(navigation.replace).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

