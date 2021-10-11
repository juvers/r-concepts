/** @jsx jsx */
import {useState} from 'react';
import {animated} from 'react-spring';
import {Input as ThemeUiInput} from 'theme-ui';
import {jsx, Label, usePageTransition} from '@tishman/components';

import type {ComponentProps} from 'react';

export function SearchInput({
  onChange,
  defaultValue,
  ...props
}: ComponentProps<typeof ThemeUiInput>): JSX.Element {
  const [hasInput, setHasInput] = useState(Boolean(defaultValue));
  const underlineTransition = usePageTransition({
    initial: {scaleX: 0},
    enter: {scaleX: 1, delay: 300},
    leave: {scaleX: 1},
  });
  return (
    <Label
      color="muted"
      sx={{
        position: 'relative',
        fontWeight: 'regular',
        fontSize: [4, null, 5, 6],
        lineHeight: 1,
        maxWidth: 990,
      }}
    >
      <span sx={{position: 'absolute', top: 0, width: '100%', pt: 2}}>
        {/*
          Note: We have two placeholder labels on purpose: the 'real' label,
          which should be visible on large screens, and the small label,
          which shows a different label on small screens.
          Screen readers should only see the real label.
        */}
        <span sx={{display: hasInput ? 'none' : ['none', 'block']}}>
          Search by keyword, event, etc.
        </span>
        <span sx={{display: hasInput ? 'none' : ['block', 'none']}}>
          Search
        </span>
      </span>
      <ThemeUiInput
        {...props}
        defaultValue={defaultValue}
        sx={{
          py: 2,
          fontWeight: 'medium',
          fontSize: [4, null, 5, 6],
          border: 'none',
          outline: 'none',
          lineHeight: 1,
        }}
        onChange={(event) => {
          setHasInput(Boolean(event.target.value));
          onChange?.(event);
        }}
      />
      <animated.div
        sx={{
          width: '100%',
          height: '1px',
          bg: 'text',
          transformOrigin: 'center left',
        }}
        style={underlineTransition}
      />
    </Label>
  );
}
