/** @jsx jsx */
import React from 'react';
import {jsx, Box, Label} from '@tishman/components';

import type {ThemeUIComponentProps} from '@tishman/components';

export type InputProps = ThemeUIComponentProps<
  'forms',
  'input',
  {text: string; textColor?: string; required?: boolean}
>;

export const Input = React.forwardRef(
  (
    {
      text,
      textColor = 'text',
      required = false,
      variant = 'input',
      ...props
    }: InputProps,
    ref: InputProps['ref'],
  ) => (
    <Label
      my={2}
      sx={{
        flexDirection: 'column',
        alignItems: 'flex-start',
        color: textColor,
      }}
    >
      <Box
        ref={ref}
        as="input"
        variant={variant}
        {...props}
        __themeKey="forms"
        __css={{
          display: 'block',
          width: '100%',
          p: 2,
          appearance: 'none',
          fontSize: 'inherit',
          lineHeight: 'inherit',
          border: '1px solid',
          borderRadius: 4,
          color: 'inherit',
          bg: 'transparent',
          fontFamily: 'body',
        }}
      />
      {text}
      {required && '*'}
    </Label>
  ),
);

Input.displayName = 'Input';

export default Input;
