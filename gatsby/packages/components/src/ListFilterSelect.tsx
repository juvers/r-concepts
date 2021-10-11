/** @jsx jsx */
import React from 'react';
import {jsx, Flex, Box, getMargin, omitMargin} from '@tishman/components';
import {DropArrowSvg} from './icons';

import type {ThemeUIComponentProps} from '@tishman/components';

export type ListFilterSelectProps = Omit<
  ThemeUIComponentProps<'forms', 'select'>,
  'variant'
>;

export const ListFilterSelect = React.forwardRef(
  (
    {sx, ...props}: ListFilterSelectProps,
    ref?: ListFilterSelectProps['ref'],
  ) => (
    <Flex
      {...getMargin(props)}
      sx={{justifyContent: ['flex-start', null, 'center']}}
    >
      <Box
        ref={ref}
        as="select"
        sx={sx}
        {...omitMargin(props)}
        __themeKey="forms"
        __css={{
          display: 'block',
          appearance: 'none',
          lineHeight: 'inherit',
          color: 'text',
          bg: 'background',
          fontFamily: 'body',
          border: 'none',
          borderRadius: 'square',
          borderBottom: `1px solid currentColor`,
          fontSize: 3,
          py: 3,
          pl: 2,
          pr: '56px',
          textOverflow: 'ellipsis',
          width: '100%',
        }}
      />
      <DropArrowSvg
        sx={{
          flexShrink: 0,
          color: 'text',
          ml: '-28px',
          alignSelf: 'center',
          pointerEvents: 'none',
        }}
      />
    </Flex>
  ),
);

ListFilterSelect.displayName = 'ListFilterSelect';
