/** @jsx jsx */
import React from 'react';
import {jsx} from '@tishman/components';
import {Label, Radio as ThemeUIRadio} from 'theme-ui';

import type {ThemeUIComponentProps} from '@tishman/components';
import type {RadioProps as ThemeUIRadioProps} from 'theme-ui';

export type RadioProps = ThemeUIComponentProps<
  'forms',
  'input',
  {text: string; textColor?: string; required?: boolean}
>;

export const Radio = React.forwardRef(
  (
    {text, textColor = 'text', required = false, ...props}: RadioProps,
    ref: RadioProps['ref'],
  ) => (
    <Label m={0} p={0} sx={{color: textColor, display: 'flex'}}>
      <ThemeUIRadio ref={ref} {...(props as ThemeUIRadioProps)} />
      {text}
      {required && '*'}
    </Label>
  ),
);
