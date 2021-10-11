/** @jsx jsx */
import React from 'react';
import {jsx, Box, Label, getMargin, omitMargin} from '@tishman/components';
import {DropArrowSvg} from '../icons';

import type {ThemeUIComponentProps} from '@tishman/components';

export type SelectProps = ThemeUIComponentProps<
  'forms',
  'select',
  {text?: string; textColor?: string; required?: boolean}
>;

export const Select = React.forwardRef(
  (
    {
      text,
      textColor = 'text',
      required = false,
      variant = 'input',
      sx,
      ...props
    }: SelectProps,
    ref?: SelectProps['ref'],
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
        {...getMargin(props)}
        sx={{
          display: 'flex',
        }}
      >
        <Box
          ref={ref}
          as="select"
          variant={variant}
          sx={sx}
          {...omitMargin(props)}
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
        <DropArrowSvg
          sx={{
            mb: 2,
            ml: -28,
            alignSelf: 'center',
            pointerEvents: 'none',
          }}
        />
      </Box>
      {text}
      {required && '*'}
    </Label>
  ),
);

Select.displayName = 'Select';

export default Select;
