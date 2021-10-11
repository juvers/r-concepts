/** @jsx jsx */
import {
  jsx,
  Box,
  Grid,
  Flex,
  Link,
  ArrowSvg,
  Sticky,
  ScrollToTopLink,
  ScrollSentinel,
} from '@tishman/components';
import {Fragment, useMemo, useState} from 'react';
import {SecondaryMenu} from '~SecondaryMenu';

import type {GridProps, LinkProps} from '@tishman/components';
import type {SecondaryMenuLinkProps} from '~SecondaryMenu';

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

const SecondaryMenuBarColumn = ({
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

export interface SecondaryMenuBarProps<
  LeftNavState = unknown,
  RightNavState = unknown,
  CtaState = unknown
> {
  /** The secondary menu title. This is only visible on small screens. */
  title: string;
  /** Whether or not the nav is sticky.
   *
   * Note that this does not mean the nav will neccessarily __become__ stuck
   * when this is true, only that it may become stuck if passes the
   * threshold defined by the position props.
   */
  sticky?: boolean;
  /**
   * How far past the top of the scrollport to activate the sticky behavior,
   * where `0` means right at the top edge, and `1` means the scrollport height.
   */
  threshold?: number;
  /**
   * A list of menu link data to appear in the secondary nav.
   *
   * @example
   *
   * [
   *   {url: '/plan-your-visit', label: 'Plan Your Visit'},
   *   {url: '/map-and-directions', label: 'Map & Directions'},
   *   {url: 'zo-login', label: 'Zo. Login'},
   *   {url: '/contact', label: 'Contact'},
   * ]
   */
  links?: SecondaryMenuLinkProps[];
  /**
   * Optional navigation item to appear on the left side
   * of the `SecondaryMenuBar`.
   *
   * By default, this will be a 'scroll to top' button.
   *
   * Note: this will only be visible on large screens when
   * the `SecondaryMenuBar` is sticky!
   */
  leftNav?: NavProps<LeftNavState>;
  /**
   * Optional navigation item to appear on the right side
   * of the `SecondaryMenuBar`, just before the CTA.
   *
   * Note: this will only be visible on large screens when
   * the `SecondaryMenuBar` is sticky!
   */
  rightNav?: NavProps<RightNavState>;
  /**
   * Optional navigation item to appear on the right side
   * of the `SecondaryMenuBar`,
   *
   * Note: this will only be visible on large screens when
   * the `SecondaryMenuBar` is sticky!
   */
  cta?: PageCtaConfig<CtaState>;
}

/**
 * `SecondaryMenuBar` renders a list of secondary nav links.
 *
 * On small screens, the list is displayed as custom select.
 */
export function SecondaryMenuBar({
  title,
  links,
  leftNav,
  rightNav,
  cta,
  threshold,
  sticky = false,
}: SecondaryMenuBarProps): JSX.Element {
  const [thresholdMet, setThresholdMet] = useState(sticky && threshold == null);
  const disabled = !sticky || !thresholdMet;

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

  const rightNavElement = useMemo(() => {
    if (rightNav) {
      const {label, ...props} = rightNav;
      return (
        <Link
          key="right-nav"
          variant="button"
          {...props}
          sx={{px: 4, display: ['none', null, null, null, null, 'inherit']}}
        >
          {label}
        </Link>
      );
    }
    return null;
  }, [rightNav]);

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
    return <ScrollToTopLink />;
  }, [leftNav]);

  return (
    <Fragment>
      {threshold != null && (
        <ScrollSentinel threshold={threshold + 1} onChange={setThresholdMet} />
      )}
      {/* This spacer keeps the inline secondary menu items
      from clobbering the content above it. */}
      <Box mt={5} />
      <Sticky top="auto" disabled={disabled}>
        <Flex
          px={[0, null, 4]}
          sx={{
            position: 'relative',
            zIndex: ['sticky', null, 'unset'],
            justifyContent: ['stretch', null, 'center'],
            transform: ({space}) => `translateY(-${space?.[5] ?? 48}px)`,
            '.sticky > &': {
              py: [2, 3],
              bg: 'background',
              justifyContent: ['stretch', null, 'space-between'],
              transform: 'translateY(0%)',
              transition: 'transform 0.3s ease',
            },
          }}
        >
          <SecondaryMenuBarColumn
            sx={{
              display: 'none',
              '.sticky > * > &': {
                display: ['none', null, 'inherit'],
              },
            }}
          >
            {leftNavElement}
          </SecondaryMenuBarColumn>
          <SecondaryMenu title={title} links={links} />
          <SecondaryMenuBarColumn
            gap={2}
            sx={{
              display: 'none',
              justifySelf: 'end',
              '.sticky > * > &': {
                display: ['none', null, 'inherit'],
              },
            }}
          >
            {rightNavElement}
            {ctaElement}
          </SecondaryMenuBarColumn>
        </Flex>
      </Sticky>
      {/* This spacer pulls the following content up to cover
      the empty space created by the inline secondary menu. */}
      <Box mb={[-7, null, -6]} />
    </Fragment>
  );
}
