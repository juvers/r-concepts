/** @jsx jsx */
import React from 'react';
import {jsx, Box, Label} from '@tishman/components';
import {Flex} from '@tishman/components';

import type {ThemeUIComponentProps} from '@tishman/components';

export type DollarInputProps = ThemeUIComponentProps<
  'forms',
  'input',
  {text: string; textColor?: string; required?: boolean}
>;

export const DollarInput = React.forwardRef(
  (
    {
      text,
      textColor = 'text',
      required = false,
      variant = 'input',
      ...props
    }: DollarInputProps,
    ref: DollarInputProps['ref'],
  ) => (
    <Label
      my={2}
      sx={{
        flexDirection: 'column',
        alignItems: 'flex-start',
        color: textColor,
      }}
    >
      <Flex>
        <Box>$</Box>
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
          }}
        />
      </Flex>
      {text}
      {required && '*'}
    </Label>
  ),
);

DollarInput.displayName = 'DollarInput';

DollarInput.defaultProps = {
  textColor: 'text',
  required: false,
};

export default DollarInput;
