/** @jsx jsx */
import React from 'react';
import {jsx, Box, Label} from '@tishman/components';

import type {KeyboardEvent} from 'react';
import type {ThemeUIComponentProps} from '@tishman/components';

export type DateProps = ThemeUIComponentProps<
  'forms',
  'input',
  {text: string; textColor?: string; required?: boolean}
>;

export const Date = React.forwardRef(
  (
    {
      text,
      textColor = 'text',
      required = false,
      variant = 'input',
      ...props
    }: DateProps,
    ref: DateProps['ref'],
  ) => {
    const [updated, setUpdated] = React.useState(false);

    return (
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
          type="date"
          data-updated={updated}
          onKeyPress={(event: KeyboardEvent<HTMLInputElement>) => {
            if (event.currentTarget.value !== null) {
              setUpdated(true);
            } else {
              setUpdated(false);
            }
          }}
          {...props}
          __themeKey="forms"
          __css={{
            display: 'block',
            width: '100%',
            p: 2,
            appearance: 'none',
            fontSize: 'inherit',
            lineHeight: 'inherit',
            fontFamily: 'body',
            border: '1px solid',
            borderRadius: 4,
            color: 'inherit',
            bg: 'transparent',
            textTransform: 'uppercase',
            '&[data-updated="false"]': {
              color: '#757575',
              borderColor: '#fff',
            },
            '::-webkit-calendar-picker-indicator': {display: 'none'},
          }}
        />
        {text}
        {required && '*'}
      </Label>
    );
  },
);

Date.displayName = 'Date';

export default Date;
