/** @jsx jsx */
import {Fragment, useState, useCallback, useMemo, useEffect} from 'react';
import {Global} from '@emotion/core';
import useSize from '@hzdg/use-size';
import FocusScope from '@hzdg/focus-scope';
import {
  jsx,
  Modal,
  Box,
  Link,
  ThemeProvider,
  getThemeByName,
  ArrowSvg,
} from '@tishman/components';
import {MenuBar, Menu, SearchMenu, MENU, SEARCH} from '~components/menu';
import {Meta} from '~components/Meta';
import FooterBlock from '~blocks/FooterBlock';
import {useMenuLinkGroups, useSearchSuggestionLinks} from '~blocks/queries';
import VirtualEventAlertBanner from '~components/VirtualEventAlertBanner';
import {usePageConfig} from '~PageConfig';

import type {ReactElement, Ref} from 'react';
import type {TishmanTheme} from '@tishman/components';
import type {MenuBarProps, OverlayType} from '~components/menu';
import type {PageConfig} from '~PageConfig';

interface MenuBarContainerProps extends MenuBarProps {
  menuBarRef: Ref<HTMLDivElement>;
  pageConfig: PageConfig;
}

/**
 * A container for the `MenuBar` that memoizes its render state
 * and makes sure it remains interactive while overlays are open.
 */
function MenuBarContainer({
  menuBarRef,
  pageConfig,
  ...menuBarProps
}: MenuBarContainerProps) {
  /** The CTA to render in the `MenuBar` for the current page. */
  const cta = useMemo(() => {
    if (pageConfig.cta) {
      const {label, ...props} = pageConfig.cta;
      return (
        <Link key="cta" variant="button" {...props}>
          {label}
        </Link>
      );
    }
    return null;
  }, [pageConfig.cta]);

  /** The right nav element to render in the `MenuBar` for the current page. */
  const rightNav = useMemo(() => {
    if (pageConfig.rightNav) {
      const {label, ...props} = pageConfig.rightNav;
      return (
        <Link key="right-nav" variant="underline" {...props}>
          {label}
        </Link>
      );
    }
    return null;
  }, [pageConfig.rightNav]);

  /** The left nav element to render in the `MenuBar` for the current page. */
  const leftNav = useMemo(() => {
    if (pageConfig.leftNav) {
      const {label, ...props} = pageConfig.leftNav;
      return (
        <Link key="left-nav" variant="backArrow" {...props}>
          {label}
          <ArrowSvg aria-hidden />
        </Link>
      );
    }
    return null;
  }, [pageConfig.leftNav]);

  return (
    <Box
      ref={menuBarRef}
      style={{pointerEvents: 'auto'}}
      sx={{
        '@media print': {
          display: 'none',
        },
      }}
    >
      <MenuBar
        {...menuBarProps}
        logo={pageConfig.logo}
        logoLink={pageConfig.logoLink}
        pageName={pageConfig.pageName}
        hideSearchToggleButton={pageConfig.hideSearchToggleButton}
        leftNav={leftNav}
        rightNav={rightNav}
        cta={cta}
      />
    </Box>
  );
}

export interface AppProps {
  children: ReactElement;
  path: string;
  data: Record<string, unknown>;
  pageContext: Record<string, unknown>;
}

/**
 * `App` renders the current page within the 'chrome' of the site;
 * all the stuff that is omnipresent or outside of the flow of
 * any individual page, including the `MenuBar`, the `Footer`, and overlays.
 */
export function App({
  children: page,
  data,
  path,
  pageContext,
}: AppProps): JSX.Element {
  const pageConfig = usePageConfig({path, data, ...pageContext});
  const {menuLinkGroups, menuSecondaryLinks} = useMenuLinkGroups();
  const searchSuggestionLinks = useSearchSuggestionLinks();
  const [isOpen, openOverlay] = useState<false | OverlayType>(false);
  const [menuBarSize, menuBarRef] = useSize();
  const pageTheme = getThemeByName(pageConfig.theme ?? 'Rock Center');
  const closeOverlay = useCallback(() => openOverlay(false), []);

  // Close any open overlay when the page changes.
  useEffect(closeOverlay, [closeOverlay, page]);

  /** Memoized render of the `MenuBar` and `Menu` modal. */
  const renderedMenuBarAndMenu = useMemo(
    () => (
      <FocusScope
        trap={isOpen === MENU}
        onKeyPress={
          isOpen === MENU
            ? /**Handle keypresses that dismiss the currently open overlay. */
              (event: KeyboardEvent) => {
                if (!event.defaultPrevented && event.key === 'Escape') {
                  closeOverlay();
                  event.preventDefault();
                }
              }
            : undefined
        }
      >
        {page?.props?.data?.virtualEvent && (
          <VirtualEventAlertBanner data={page.props.data} />
        )}

        <MenuBarContainer
          menuBarRef={menuBarRef}
          pageConfig={pageConfig}
          isOpen={isOpen}
          onOpen={openOverlay}
          onClose={closeOverlay}
        />
        <Box sx={{position: 'relative'}}>
          <Modal
            trap={false}
            style={{height: `calc(100vh - ${menuBarSize.height}px)`}}
            sx={{
              /* This transform is applied to the containing div to establish
               * a new containing block, so that we can fix the position of
               * the Menu Modal to it rather than the viewport.
               * See https://developer.mozilla.org/en-US/docs/Web/CSS/position#fixed
               * See https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_Block#Identifying_the_containing_block
               */
              transform: `translateY(0px)`,
              position: 'relative',
            }}
            isOpen={isOpen === MENU}
            onClose={closeOverlay}
          >
            <Menu
              linkGroups={menuLinkGroups}
              secondaryLinks={menuSecondaryLinks}
            />
          </Modal>
        </Box>
      </FocusScope>
    ),
    [
      closeOverlay,
      isOpen,
      menuBarRef,
      menuBarSize.height,
      menuLinkGroups,
      menuSecondaryLinks,
      pageConfig,
      page.props,
    ],
  );

  /** Memoized render of the `SearchMenu`. */
  const renderedSearchMenu = useMemo(
    () => (
      <Modal isOpen={isOpen === SEARCH} onClose={closeOverlay}>
        <ThemeProvider key="search" theme={getThemeByName('Rock Center Black')}>
          <SearchMenu
            to="/search"
            suggestions={searchSuggestionLinks}
            onClose={closeOverlay}
          />
        </ThemeProvider>
      </Modal>
    ),
    [closeOverlay, isOpen, searchSuggestionLinks],
  );

  return (
    <Fragment>
      <Meta {...pageConfig.meta} />
      <ThemeProvider theme={pageTheme}>
        <Global
          styles={(theme: TishmanTheme) => ({
            body: {
              backgroundColor: theme.colors.background,
            },
          })}
        />
        {renderedMenuBarAndMenu}
        {renderedSearchMenu}
        {page}
      </ThemeProvider>
      <FooterBlock />
    </Fragment>
  );
}
