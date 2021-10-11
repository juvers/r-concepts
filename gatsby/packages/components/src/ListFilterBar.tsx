/** @jsx jsx */
import {
  jsx,
  ListFilterSelect,
  Grid,
  Flex,
  Box,
  Link,
  ArrowSvg,
  Sticky,
  ScrollToTopLink,
} from '@tishman/components';
import React, {useMemo, useState} from 'react';
import {ListFilterSearch} from './ListFilterSearch';

import type {LinkProps, GridProps} from '@tishman/components';

/** Props that describe a page-specific CTA, like a 'buy tickets' button. */
interface PageCtaConfig<TState = unknown> {
  /** The path the CTA links to. */
  to: string;
  /** The label for the CTA. */
  label: string;
  /** Optional state to add to location state when the CTA is clicked. */
  state?: LinkProps<TState>['state'];
}

/** Props that describe a page-specific navigation item, like a 'back' button. */
interface NavProps<TState = unknown> {
  /** The path the Nav item links to. */
  to: string;
  /** The label for the Nav item. */
  label: string;
  /**
   * Optional link variant to use.
   *
   * For a left nav item, the default variant is `'backArrow'`.
   *
   * For a right nav item, the default variant is `'underline'`.
   */
  variant?: LinkProps<TState>['variant'];
  /** Optional state to add to location state when the nav item is clicked. */
  state?: LinkProps<TState>['state'];
}

const ListFilterBarColumn = ({
  children,
  sx,
  ...props
}: Omit<GridProps, 'ref'>) => (
  <Grid
    gap={2}
    sx={{
      flexShrink: 0,
      gridAutoFlow: 'column',
      gridAutoColumns: 'max-content',
      alignItems: 'center',
      minHeight: '69px',
      ...sx,
    }}
    {...props}
  >
    {children}
  </Grid>
);

export interface ListFilterBarProps<
  FilterNames extends string = string,
  LeftNavState = unknown,
  CtaState = unknown,
> {
  options: ReadonlyArray<[FilterNames, ReadonlyArray<string>]>;
  /** A callback that is called when a filter option is selected. */
  onFilterChange: (filterName: FilterNames, value: string) => void;
  /** Whether or not bar is sticky. */
  sticky?: boolean;
  /**
   * Optional navigation item to appear on the left side
   * of the `ListFilterBar`.
   *
   * Defaults to a `back to top` button, which can be disabled
   * by passing `false`.
   *
   * Note: this will only be visible on large screens when
   * the `ListFilterBar` is sticky!
   */
  leftNav?: NavProps<LeftNavState> | false;
  /**
   * Optional navigation item to appear on the right side
   * of the `ListFilterBar`,
   *
   * Note: this will only be visible on large screens when
   * the `ListFilterBar` is sticky!
   */
  cta?: PageCtaConfig<CtaState>;
  /**
   * Optional value that can be used to set value.
   */
  value?: string;

  /** Save filter values with respect to path */
  filterValue?: Map<string, string>;
}

/**
 * A sticky menu bar that shows select fields for filtering list views
 * and additional navigation items.
 *
 * This component supports options and filter as defined by `createListView`.
 *
 * @see https://tishman.netlify.app/guides/list-views
 * @see https://tishman.netlify.app/hooks/create-list-view
 * @see https://tishman.netlify.app/components/list-filter-bar
 */
export function ListFilterBar<FilterNames extends string>({
  options,
  onFilterChange,
  leftNav,
  cta,
  sticky = true,
  filterValue
}:  ListFilterBarProps<FilterNames>): JSX.Element {
  const [searchedName, setSearchedName] = useState('');
  const ctaElement = useMemo(() => {
    if (cta) {
      const {label, ...props} = cta;
      return (
        <Link key="cta" variant="button" {...props}>
          {label}
        </Link>
      );
    }
    return null;
  }, [cta]);

  const leftNavElement = useMemo(() => {
    if (leftNav) {
      const {label, ...props} = leftNav;
      return (
        <Link key="left-nav" variant="backArrow" {...props}>
          {label}
          <ArrowSvg aria-hidden />
        </Link>
      );
    }
    if (leftNav !== false) return <ScrollToTopLink />;
    return null;
  }, [leftNav]);
  return (
    <Sticky top="auto" disabled={!sticky}>
      <Flex
        bg="background"
        sx={{
          maxWidth: 'container',
          mx: 'auto',
          px: [0, null, 3],
          height: ['filterBarMobile', null, 'filterBar'],
          justifyContent: ['stretch', null, 'center'],
          '.sticky > &': {
            px: [0, null, 4],
            maxWidth: 'inherit',
            justifyContent: ['stretch', null, 'space-between'],
          },
        }}
      >
        <ListFilterBarColumn
          sx={{
            display: 'none',
            '.sticky &': {
              display: ['none', null, 'inherit'],
            },
          }}
        >
          {leftNavElement}
        </ListFilterBarColumn>
        <Box
          as="form"
          sx={{
            display: 'flex',
            alignItems: 'stretch',
            flexDirection: ['column', 'row'],
            width: '100%',
            justifyContent: options.length > 1 ? 'flex-start' : 'left',
            '.sticky &': {
              justifyContent: 'center',
              flexDirection: 'row',
            },
          }}
        >
          {options.map(([field, values]) => (
            <Box
              key={field as string}
              bg="background"
              sx={{
                pt: 2,
                pb: 3,
                marginTop: 'auto',
                width: ['100%', 240],
                flexGrow: 0,
              }}
            >
              {field.toLocaleLowerCase() == 'name' ? (
                <Box
                  sx={{
                    position: 'relative',
                  }}
                >
                  <ListFilterSearch
                    defaultValue={''}
                    mx={3}
                    sx={{
                      '.sticky &': {
                        borderBottom: 'none',
                      },
                    }}
                    onChange={(event) => { 
                      const searchedText = event.target.value;
                      setSearchedName(searchedText);
                      if(!searchedText || searchedText.length == 0){
                        onFilterChange(field, searchedText);
                      }
                    }}
                    onClick={() => {
                      onFilterChange(field, searchedName);
                    }}
                    onKeyPress={() => {
                      onFilterChange(field, searchedName);
                    }}
                  />
                 
                </Box>
              ) : (
                <React.Fragment>
                  <ListFilterSelect
                    value={filterValue?.get(field)}
                    onChange={({target}) => onFilterChange(field, target.value)}
                    mx={3}
                    sx={{
                      '.sticky &': {
                        borderBottom: 'none',
                      },
                    }}
                  >
                    <option value="">{field}</option>
                    {values.map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </ListFilterSelect>
                </React.Fragment>
              )}
            </Box>
          ))}
        </Box>
        <ListFilterBarColumn
          sx={{
            display: 'none',
            justifySelf: 'end',
            '.sticky &': {
              display: ['none', null, 'inherit'],
            },
          }}
        >
          {ctaElement}
        </ListFilterBarColumn>
      </Flex>
    </Sticky>
  );
}
