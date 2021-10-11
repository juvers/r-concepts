/** @jsx jsx */
import {
  jsx,
  Box,
  Flex,
  Link,
  Button,
  DropArrowSvg,
  useBreakpointIndex,
  useBlockedDocument,
  ScrollToTopLink,
} from '@tishman/components';
import {useState, useEffect, useMemo, useCallback} from 'react';
import {animated, useSpring, useTrail} from 'react-spring';
import FocusScope from '@hzdg/focus-scope';
import {useLocation} from '@reach/router';

import type {MouseEvent} from 'react';

export interface SecondaryMenuLinkProps {
  url: string;
  label: string;
}

export interface SecondaryMenuProps {
  /** The secondary menu title. This is only visible on small screens. */
  title: string;
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
}

export function SecondaryMenu({links, title}: SecondaryMenuProps): JSX.Element {
  const [state, setState] = useState<'wide' | 'open' | 'closed'>('closed');

  // Close the menu whenever the location changes.
  const location = useLocation();
  useEffect(() => setState((mode) => (mode === 'open' ? 'closed' : mode)), [
    location,
  ]);

  // Close the menu if the mobile threshold is exceeded.
  const isMobile = useBreakpointIndex() < 2;
  useEffect(
    () =>
      setState((mode) => {
        return isMobile ? (mode === 'wide' ? 'closed' : mode) : 'wide';
      }),
    [isMobile],
  );

  // We gotta block the document when the mobile menu is open.
  const blockedDocRef = useBlockedDocument(state === 'open');

  const bgTransition = useSpring({
    from: {scaleY: 0},
    scaleY: state === 'open' ? 1 : 0,
    config: {tension: 190, friction: 32},
  });

  const opacityTrail = useTrail((links?.length ?? 0) + 1, {
    reverse: state === 'closed',
    opacity: state === 'closed' ? 0 : 1,
    config: {tension: 360, friction: 30},
  });

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.defaultPrevented) return;
    if (event.key === 'Escape') {
      setState((state) => (state === 'open' ? 'closed' : state));
      event.preventDefault();
    }
  }, []);

  const handleClose = useCallback((event?: MouseEvent) => {
    if (event?.defaultPrevented) return;
    setState((state) => (state === 'open' ? 'closed' : state));
  }, []);

  const handleToggle = useCallback((event?: MouseEvent) => {
    if (event?.defaultPrevented) return;
    setState((state) =>
      state === 'open' ? 'closed' : state === 'closed' ? 'open' : state,
    );
  }, []);

  const overlay = useMemo(
    () => (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          height: '100vh',
          bg: 'backgroundOverlay',
        }}
        onClick={handleClose}
      />
    ),
    [handleClose],
  );

  return (
    <FocusScope
      ref={blockedDocRef}
      trap={state === 'open'}
      onKeyPress={handleKeyPress}
      sx={{
        pointerEvents: 'auto',
        mx: ['initial', null, 3],
        overflowX: ['visible', null, 'scroll'],
        width: '100%',
        scrollbarWidth: 'none',
        '::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      <Box sx={{px: [2, 0]}}>
        <Button
          variant="secondaryMenuToggle"
          sx={{
            display: ['static', null, 'none'],
            '.sticky &': {
              color: state === 'open' ? 'muted' : 'text',
            },
          }}
          onClick={handleToggle}
        >
          {title}
          <DropArrowSvg
            aria-hidden
            sx={{
              transform: state === 'open' ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease-in-out',
            }}
          />
        </Button>
      </Box>
      <Box sx={{position: 'relative'}}>
        {state === 'open' && overlay}
        <Box
          sx={{
            position: ['absolute', null, 'relative'],
            top: 0,
            left: 0,
            minWidth: '100%',

            '.sticky &': {
              position: 'absolute',
            },
          }}
        >
          <animated.div
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              bg: 'background',
              transformOrigin: 'top center',
            }}
            style={bgTransition}
          />
          <Flex
            as="nav"
            sx={{
              pt: [3, null, 0],
              pb: [5, null, 0],
              px: [3, 4, 0],
              justifyContent: ['flex-start', null, 'space-between'],
              alignItems: ['flex-start', null, 'center'],
              flexDirection: ['column', null, 'row'],
              minHeight: ['auto', null, '69px'],
              zIndex: ['sticky', null, 'unset'],
              /**
               * These spacers allow the items to appear justified center
               * when the container is wider than the list of items,
               * but justified start when the container is narrower.
               */
              ':before': {
                content: '""',
                flex: 1,
              },
              ':after': {
                content: '""',
                flex: 1,
              },
            }}
          >
            {links?.map((link, index) => (
              <animated.span
                key={link.url}
                sx={{
                  display: state === 'closed' ? 'none' : 'inherit',
                  mx: [2, 0, 2, 3],
                  my: [2, null, 0],
                }}
                style={opacityTrail[index]}
              >
                <Link
                  variant="menuSecondaryCompressed"
                  to={link.url}
                  onClick={handleClose}
                >
                  {link.label}
                </Link>
              </animated.span>
            ))}
            <animated.span
              key="back to top"
              sx={{
                display: state === 'wide' ? 'none' : 'inherit',
                position: 'absolute',
                right: [2, 4, 5],
                bottom: [3, 4],
                mx: [2, 0, 3],
                my: [2, null, 0],
              }}
              style={opacityTrail[opacityTrail.length - 1]}
            >
              <ScrollToTopLink
                variant="upArrowCompressed"
                onClick={handleClose}
              />
            </animated.span>
          </Flex>
        </Box>
      </Box>
    </FocusScope>
  );
}
