import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Input from '../input';

describe('The Input component', () => {
  test('renders an input field with a label', () => {
    render(<Input id={'search'}>Input</Input>);

    expect(screen.getByLabelText('Input')).toBeInTheDocument();
  });

  test('renders a text input field with no type specified', () => {
    render(<Input id={'search'}>Input</Input>);

    expect(screen.getByLabelText('Input')).toHaveAttribute('type', 'text');
  });

  test('renders a password input field with the password type specified', () => {
    render(<Input id={'search'} type={'password'}>Input</Input>);

    expect(screen.getByLabelText('Input')).toHaveAttribute('type', 'password');
  });

  test('renders an input field without focus given no isFocused parameter', () => {
    render(<Input id={'search'}>Input</Input>);

    expect(screen.getByLabelText('Input')).not.toHaveFocus();
  });

  test('renders an input field with focus given an isFocused parameter', () => {
    render(<Input id={'search'} isFocused>Input</Input>);

    expect(screen.getByLabelText('Input')).toHaveFocus();
  });

  test('renders an input field with no initial value given no value parameter', () => {
    render(<Input id={'search'}>Input</Input>);

    expect(screen.getByLabelText('Input')).toHaveValue('');
  });

  test('renders an input field with an initial value given a value parameter', () => {
    const onInputChange = jest.fn();

    render(<Input id={'search'} value={'input'} onInputChange={onInputChange}>Input</Input>);

    expect(screen.getByLabelText('Input')).toHaveValue('input');
  });

  test('calls the callback handler on changing the input', () => {
    const onInputChange = jest.fn();

    render(<Input id={'search'} onInputChange={onInputChange}>Input</Input>);

    userEvent.type(screen.getByLabelText('Input'), 'input');

    expect(onInputChange).toHaveBeenCalledTimes(5);
  });
});
