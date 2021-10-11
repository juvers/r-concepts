/** @jsx jsx */
import React, {forwardRef} from 'react';
import {jsx, Flex} from '@tishman/components';
import {Label, Checkbox as ThemeUICheckbox} from 'theme-ui';

import type {ThemeUIComponentProps} from '@tishman/components';
import type {CheckboxProps as ThemeUICheckboxProps} from 'theme-ui';

export type CheckboxProps = ThemeUIComponentProps<
  'forms',
  'input',
  {text: string; textColor?: string; required?: boolean}
>;

export const Checkbox = forwardRef(
  (
    {text, textColor = 'text', required = false, ...props}: CheckboxProps,
    ref?: CheckboxProps['ref'],
  ) => (
    <Label m={0} p={0} sx={{color: textColor}}>
      <Flex>
        <ThemeUICheckbox ref={ref} {...(props as ThemeUICheckboxProps)} />
        <span>
          {text}
          {required && '*'}
        </span>
      </Flex>
    </Label>
  ),
);
