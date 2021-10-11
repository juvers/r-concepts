/** @jsx jsx */
import React from 'react';
import ResizeTextarea from 'react-textarea-autosize';
import {jsx, Box, Label} from '@tishman/components';

import type {ComponentPropsWithoutRef} from 'react';
import type {ThemeUIComponentProps} from '@tishman/components';

export type TextareaProps = ThemeUIComponentProps<
  'forms',
  'textarea',
  {text: string; textColor?: string; required?: boolean}
>;

export const Textarea = React.forwardRef(
  (
    {
      text,
      textColor = 'text',
      required = false,
      variant = 'textarea',
      ...props
    }: TextareaProps,
    ref: TextareaProps['ref'],
  ) => {
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
          as={ResizeTextarea}
          variant={variant}
          {...(props as ComponentPropsWithoutRef<typeof ResizeTextarea>)}
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
    );
  },
);

Textarea.displayName = 'Textarea';

export default Textarea;
