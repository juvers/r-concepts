/** @jsx jsx */
import {Fragment, memo} from 'react';
import {
  jsx,
  Grid,
  MenuToggleButton,
  SearchSvg,
  Button,
  Fixed,
} from '@tishman/components';
import {MenuBarLogo} from './MenuBarLogo';

import type {PropsWithChildren, ReactNode} from 'react';
import type {GridProps, LinkProps} from '@tishman/components';
import type {LogoType} from './MenuBarLogo';

export const MENU = 'MENU';
export const SEARCH = 'SEARCH';

export type OverlayType = typeof MENU | typeof SEARCH;

const MenuBarRow = ({children, sx, ...props}: Omit<GridProps, 'ref'>) => (
  <Grid
    gap={2}
    sx={{
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

export type MenuBarProps<LogoLinkState = unknown> = PropsWithChildren<{
  /**
   * The logo to show in the `MenuBar`.
   *
   * Defaults to 'Rockefeller Center'
   */
  logo?: LogoType;
  /**
   * The link to follow when the logo is clicked.
   * Set this to `null` to have no link.
   *
   * Defaults to the Rockefeller Center homepage.
   */
  logoLink?: {
    /** The path the Logo links to. */
    to: string;
    /** The label for the link (will be a title). */
    label: string;
    /** Optional state to add to location state when the logo is clicked. */
    state?: LinkProps<LogoLinkState>['state'];
  } | null;
  /**
   * An optional short name for this page, .e.g., 'Home', or 'Bar SixtyFive'.
   * If provided, this name _may_ appear underneath the logo, unless
   * the logo has its own logo type.
   */
  pageName?: string | null;

  /**
   * Optional navigation item to appear on the left side of the `MenuBar`.
   * Visually, this is typically a back arrow button.
   *
   * Note that, if provided, this will _replace_ the Menu toggle button!
   */
  leftNav?: ReactNode;
  /**
   * Optional navigation item to appear on the right side of the `MenuBar`,
   * _before_ the Search toggle button. Visually, this istypically a text link.
   *
   * Note: This will be hidden on small screens!
   */
  rightNav?: ReactNode;
  /**
   * Optional navigation item to appear on the right side of the `MenuBar`,
   * _after_ the Search toggle Button. Visually, this is typically a button.
   *
   * Note: This will be hidden on small screens!
   */
  cta?: ReactNode;
  /**
   * Whether or not to hide the search toggle button in the `MenuBar`.
   */
  hideSearchToggleButton?: boolean;
  /**
   * What type of overlay is currently open, or `false` if no overlay is open.
   */
  isOpen?: false | OverlayType;
  /**
   * A callback for handling requests to open overlays from menu nav clicks,
   * i.e., from `MENU` or `SEARCH`.
   */
  onOpen?: (type: OverlayType) => void;
  /**
   * A callback for handling requests to close overlays from nav clicks.
   */
  onClose?: () => void;
}>;

/**
 * Default logo to show when now logo has been configured,
 * or when the nav is open.
 */
const defaultLogo = 'Rockefeller Center';

/**
 * Default link to wrap the logo in when no link has been configured,
 * or when the nav is open.
 */
const defaultLogoLink = {
  to: '/',
  label: 'Rockefeller Center',
};

/**
 * The RC `MenuBar` is a grid row with:
 *
 * - Left aligned grid row of navigation with:
 *   - A menu toggle button (hamburger)
 *     - The menu toggle button may replaced with a navigation item
 *       via the `leftNav` prop.
 * - The current page logo, optionally with the current page name
 *   via the `pageName` prop
 * - Right aligned grid row of navigation with:
 *   - Optional nav item via the `rightNav` prop
 *   - A search button
 *   - Optional nav item via the `cta` prop
 */
export const MenuBar = memo(function MenuBar({
  logo = defaultLogo,
  logoLink = defaultLogoLink,
  hideSearchToggleButton = false,
  pageName,
  leftNav,
  rightNav,
  cta,
  isOpen,
  onClose,
  onOpen,
}: MenuBarProps): JSX.Element {
  return (
    <Fragment>
      <Grid
        columns={['2fr 1fr 2fr', null, null, '1fr 1fr 1fr']}
        gap={0}
        pt={[3, 4]}
        px={[0, 3, 4]}
        sx={{height: [111, 150, 150, 155], alignItems: 'start'}}
      >
        <MenuBarRow>
          {leftNav ?? (
            <MenuToggleButton
              isOpen={isOpen === MENU}
              onOpenChange={(v) => (v ? onOpen?.(MENU) : onClose?.())}
            />
          )}
        </MenuBarRow>
        <MenuBarLogo
          logo={isOpen === MENU ? defaultLogo : logo}
          pageName={isOpen === MENU ? undefined : pageName}
          link={isOpen === MENU ? defaultLogoLink : logoLink}
        />
        <MenuBarRow sx={{justifySelf: 'end'}}>
          {rightNav ? (
            <MenuBarRow sx={{display: ['none', null, null, 'inherit']}}>
              {rightNav}
            </MenuBarRow>
          ) : null}
          {hideSearchToggleButton ? null : (
            <Button
              variant="iconUnderline"
              aria-expanded={isOpen === SEARCH}
              aria-label="Search"
              onClick={() => onOpen?.(SEARCH)}
            >
              <SearchSvg aria-hidden />
            </Button>
          )}
          {cta ? (
            <MenuBarRow sx={{display: ['none', null, 'inherit']}}>
              {cta}
            </MenuBarRow>
          ) : null}
        </MenuBarRow>
      </Grid>
      {cta ? (
        <Fixed
          bottom={0}
          left={0}
          right={0}
          sx={{
            height: 'ctaMobile',
            display: ['grid', null, 'none'],
            placeContent: 'stretch',
            textAlign: 'center',
          }}
        >
          {cta}
        </Fixed>
      ) : null}
    </Fragment>
  );
});
