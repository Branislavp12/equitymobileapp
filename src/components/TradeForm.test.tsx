import { describe, it, expect, beforeAll, jest } from '@jest/globals';
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Text } from 'react-native';

import TradeForm from './TradeForm';
import InputField from '../ui/InputField';
import PrimaryButton from '../ui/PrimaryButton';
import ErrorText from '../ui/ErrorText';

beforeAll(() => {
  // Disable development logs during tests
  // @ts-ignore
  global.__DEV__ = false;
});

const setValues = (
  component: renderer.ReactTestRenderer,
  risk: string,
  reward: string
) => {
  const [riskInput, rewardInput] = component.root.findAllByType(InputField);
  act(() => {
    riskInput.props.onChangeText(risk);
    rewardInput.props.onChangeText(reward);
  });
};

const submit = (component: renderer.ReactTestRenderer) => {
  act(() => {
    component.root.findByType(PrimaryButton).props.onPress();
  });
};

describe('TradeForm validate', () => {
  it('shows error for empty inputs', () => {
    const onSubmit = jest.fn();
    let component: renderer.ReactTestRenderer;
    act(() => {
      component = renderer.create(
        <TradeForm onSubmit={onSubmit} resetKey={0} />
      );
    });
    submit(component!);
    const error = component!.root.findByType(ErrorText);
    expect(error.props.message).toBe('Zadaj obe hodnoty.');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows error for negative percentages', () => {
    const onSubmit = jest.fn();
    let component: renderer.ReactTestRenderer;
    act(() => {
      component = renderer.create(
        <TradeForm onSubmit={onSubmit} resetKey={0} />
      );
    });
    setValues(component!, '-5', '-10');
    submit(component!);
    const error = component!.root.findByType(ErrorText);
    expect(error.props.message).toBe('Risk aj Reward musia byť väčšie než 0 %');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('limits risk to 100%', () => {
    const onSubmit = jest.fn();
    let component: renderer.ReactTestRenderer;
    act(() => {
      component = renderer.create(
        <TradeForm onSubmit={onSubmit} resetKey={0} />
      );
    });
    setValues(component!, '101', '10');
    submit(component!);
    const error = component!.root.findByType(ErrorText);
    expect(error.props.message).toBe('Maximálny risk je 100 %');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('limits reward to 500%', () => {
    const onSubmit = jest.fn();
    let component: renderer.ReactTestRenderer;
    act(() => {
      component = renderer.create(
        <TradeForm onSubmit={onSubmit} resetKey={0} />
      );
    });
    setValues(component!, '10', '501');
    submit(component!);
    const error = component!.root.findByType(ErrorText);
    expect(error.props.message).toBe('Maximálny zisk je 500 %');
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

describe('TradeForm behaviour', () => {
  it('shows risk warning when risk > 20% and submits valid data', () => {
    const onSubmit = jest.fn();
    let component: renderer.ReactTestRenderer;
    act(() => {
      component = renderer.create(
        <TradeForm onSubmit={onSubmit} resetKey={0} />
      );
    });
    setValues(component!, '25', '100');
    submit(component!);
    const warningText = 'POZOR: Riskuješ viac ako 20% kapitálu!';
    const textNodes = component!.root.findAllByType(Text);
    const warning = textNodes.find(
      node => node.props.children === warningText
    );
    expect(warning).toBeTruthy();
    expect(onSubmit).toHaveBeenCalledWith({ risk: 25, reward: 100 });
  });
});
