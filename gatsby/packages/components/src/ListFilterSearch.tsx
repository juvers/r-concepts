/** @jsx jsx */
import {Input as ThemeUiInput} from 'theme-ui';
import {
  jsx,
  Flex,
  getMargin,
  Button,
  SearchSvg,
  omitMargin,
  ButtonProps
} from '@tishman/components';

import type {ComponentProps} from 'react';

export function ListFilterSearch({
  onChange,
  onClick,
  onKeyPress,
  defaultValue,
  ...props
}:   Omit<ButtonProps,'onChange'> & ComponentProps<typeof ThemeUiInput>): JSX.Element {
  return (
    <Flex
      {...getMargin(props)}
      sx={{
        position:'relative',
        justifyContent: ['flex-start', null, 'center'],
      }}
    >
        <ThemeUiInput
          defaultValue={defaultValue}
          placeholder={'Search by Name'}
          name="q"
          {...omitMargin(props)}
          sx={{
            fontFamily: 'body',
            fontWeight: 'normal',
            fontSize: [3, null, 3, 3],
            border: 'none',
            outline: 'none',
            lineHeight: 'inherit',
            mb:[0,0],
            textOverflow: 'ellipsis',
            borderBottom: `1px solid currentColor`,
            py: 3,
            pl: 2,
            pr: '35px',
          }}
          onChange={(event) => {
            onChange?.(event);
          }}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onKeyPress?.(event);
            }
          }}
        />

        <Button
          sx={{
            color: 'text',
            position:'absolute',
            margin:'auto',
            alignSelf: 'center',
            top: 0,
            bottom:0,
            right: [1, 1],
            p:1,
            lineHeight: 1,
          }}
          aria-label="search"
          variant="icon"
          type="button"
          onClick={(event)=> onClick?.(event)}
        >
          <SearchSvg aria-hidden />
        </Button>
    </Flex>
  );
}
