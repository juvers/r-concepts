/** @jsx jsx */
import React from 'react';
import {jsx, Box, Label} from '@tishman/components';

import type {ThemeUIComponentProps} from '@tishman/components';

export type TimeProps = ThemeUIComponentProps<
  'forms',
  'input',
  {text: string; textColor?: string; required?: boolean}
>;

export const Time = React.forwardRef(
  (
    {
      text,
      textColor = 'text',
      required = false,
      variant = 'input',
      ...props
    }: TimeProps,
    ref: TimeProps['ref'],
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
        type="time"
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
          '::-webkit-calendar-picker-indicator': {display: 'none'},
        }}
      />
      {text}
      {required === true ? '*' : ''}
    </Label>
  ),
);

Time.displayName = 'Time';

export default Time;
