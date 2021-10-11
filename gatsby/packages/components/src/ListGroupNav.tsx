/** @jsx jsx */
import {
  jsx,
  Box,
  Grid,
  Text,
  Button,
  ThemeProvider,
  getThemeByName,
  useScrollTo,
} from '@tishman/components';
import {useState, useLayoutEffect, useMemo, useRef} from 'react';
import {animated, useSpring} from 'react-spring';

import type {ItemGroup, BoxProps} from '@tishman/components';

const getOffsetY = (element: HTMLElement) =>
  element.offsetTop + element.offsetHeight / 2 - 4;

export interface ListGroupNavProps<Item>
  extends Omit<BoxProps, 'ref' | 'onChange'> {
  groups: ReadonlyArray<ItemGroup<Item>>;
  activeGroup?: ItemGroup<Item> | null;
  onActiveGroupChange?: (group: ItemGroup<Item> | null) => void;
}

/**
 * A single column grid of navigation links, one link per group.
 *
 * Links will be active whenever their group name matches the location hash.
 * Groups that have no items will be 'disabled' (text instead of links).
 *
 * This component supports groups as defined by `createListView`.
 *
 * @see https://tishman.netlify.app/guides/list-views
 * @see https://tishman.netlify.app/hooks/create-list-view
 * @see https://tishman.netlify.app/components/xx-list-nav
 */
export function ListGroupNav<Item>({
  groups,
  activeGroup,
  onActiveGroupChange,
  sx,
  ...props
}: ListGroupNavProps<Item>): JSX.Element {
  // A map of groups to their button elements.
  const [elements] = useState(
    () => new WeakMap<ItemGroup<Item>, HTMLElement>(),
  );

  // Scroll to the active group button.
  const domTarget = useRef<HTMLDivElement>(null);
  const scrollTo = useScrollTo({domTarget});

  // Animate the indicator position to align with the active group button.
  const [indicatorTransform, animateIndicator] = useSpring(() => ({y: 0}));
  useLayoutEffect(() => {
    const element = activeGroup ? elements.get(activeGroup) : null;
    if (element) {
      scrollTo(element);
      void animateIndicator({y: getOffsetY(element)});
    }
  });

  /** A small circle icon that represents the active group. */
  const indicator = useMemo(
    () => (
      <animated.svg
        aria-hidden
        width="8"
        height="8"
        viewBox="0 0 8 8"
        sx={{
          position: 'absolute',
          left: 'calc(50% + 8px)',
          color: 'text',
        }}
        style={indicatorTransform}
      >
        <circle fill="currentColor" cx="4" cy="4" r="4" />
      </animated.svg>
    ),
    [indicatorTransform],
  );

  return (
    <ThemeProvider theme={getThemeByName('Rock Center Black')}>
      <Box
        bg="background"
        sx={{
          overflowY: 'scroll',
          scrollbarWidth: 'none',
          '::-webkit-scrollbar': {
            display: 'none',
          },
          ...sx,
        }}
        {...props}
      >
        <Grid
          as="ol"
          ref={domTarget}
          gap={0}
          py={4}
          pl={1}
          sx={{
            width: [65, null, 70],
            placeContent: 'start center',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {indicator}
          {groups.map(
            (group) =>
              group.name && (
                <li
                  key={group.name}
                  ref={
                    group.hasItems
                      ? (element) => element && elements.set(group, element)
                      : null
                  }
                >
                  {group.hasItems ? (
                    <Button
                      variant="listGroupNav"
                      data-active={group === activeGroup}
                      onClick={() => onActiveGroupChange?.(group)}
                    >
                      {group.name}
                    </Button>
                  ) : (
                    <Text as="span" aria-hidden variant="groupList">
                      {group.name}
                    </Text>
                  )}
                </li>
              ),
          )}
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
