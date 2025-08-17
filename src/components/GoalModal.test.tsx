import { describe, it, expect, beforeAll, jest } from '@jest/globals';
import React from 'react';
import renderer, { act } from 'react-test-renderer';

import GoalModal from './GoalModal';
import InputField from '../ui/InputField';
import DateField from '../ui/DateField';
import ErrorText from '../ui/ErrorText';
import { validateGoalInput } from '../utils/calendarMath';

jest.mock('../utils/calendarMath', () => ({
  validateGoalInput: jest.fn(),
}));

jest.mock('../ui/ModalContainer', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

beforeAll(() => {
  // Disable development logs during tests
  // @ts-ignore
  global.__DEV__ = false;
});

describe('GoalModal', () => {
  it('shows error text on invalid input and does not call onSave', () => {
    (validateGoalInput as jest.Mock).mockReturnValue('Invalid input');
    const onSave = jest.fn().mockResolvedValue(undefined);
    const onClose = jest.fn();

    let component: renderer.ReactTestRenderer;
    act(() => {
      component = renderer.create(
        <GoalModal
          visible={true}
          onClose={onClose}
          onSave={onSave}
          currentEquity={1000}
        />
      );
    });

    const saveBtn = component.root.findByProps({ text: 'Uložiť cieľ' });
    act(() => {
      saveBtn.props.onPress();
    });

    const error = component.root.findByType(ErrorText);
    expect(error.props.message).toBe('Invalid input');
    expect(onSave).not.toHaveBeenCalled();
  });

  it('resets state when modal is closed and reopened', () => {
    (validateGoalInput as jest.Mock).mockReturnValue('Invalid input');
    const onSave = jest.fn().mockResolvedValue(undefined);

    let component: renderer.ReactTestRenderer;
    act(() => {
      component = renderer.create(
        <GoalModal
          visible={true}
          onClose={jest.fn()}
          onSave={onSave}
          currentEquity={1000}
          defaultAmount={100}
          defaultDate="2024-01-10"
        />
      );
    });

    let input = component.root.findByType(InputField);
    let dateField = component.root.findByType(DateField);
    expect(input.props.value).toBe('100');
    expect(dateField.props.date?.toISOString().slice(0, 10)).toBe('2024-01-10');

    act(() => {
      input.props.onChangeText('500');
      dateField.props.onSelect(new Date('2024-01-20'));
    });

    const saveBtn = component.root.findByProps({ text: 'Uložiť cieľ' });
    act(() => {
      saveBtn.props.onPress();
    });

    let errors = component.root.findAllByType(ErrorText);
    expect(errors[0].props.message).toBe('Invalid input');

    act(() => {
      component.update(
        <GoalModal
          visible={false}
          onClose={jest.fn()}
          onSave={onSave}
          currentEquity={1000}
          defaultAmount={100}
          defaultDate="2024-01-10"
        />
      );
    });

    act(() => {
      component.update(
        <GoalModal
          visible={true}
          onClose={jest.fn()}
          onSave={onSave}
          currentEquity={1000}
          defaultAmount={100}
          defaultDate="2024-01-10"
        />
      );
    });

    input = component.root.findByType(InputField);
    dateField = component.root.findByType(DateField);
    errors = component.root.findAllByType(ErrorText);

    expect(input.props.value).toBe('100');
    expect(dateField.props.date?.toISOString().slice(0, 10)).toBe('2024-01-10');
    expect(errors[0].props.message).toBe('');
  });
});

