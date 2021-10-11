/** @jsx jsx */
import {animated, to} from 'react-spring';
import {useRef, useState, useEffect, memo} from 'react';
import {useLocation} from '@reach/router';
import {Nav} from '@hzdg/sectioning';
import {FocusScope} from '@hzdg/focus-scope';
import {
  jsx,
  Grid,
  Box,
  Link,
  Button,
  Text,
  ArrowSvg,
  useScrollTo,
  usePageTransition,
  usePageTransitionPhase,
} from '@tishman/components';

import type {ReactNode} from 'react';
import type {ButtonProps} from '@tishman/components';

export interface MenuLinkProps {
  url: string;
  label: string;
}

export interface MenuLinkGroup {
  url: string;
  label: string;
  links: MenuLinkProps[];
}

export interface MenuProps {
  /**
   * A list of menu link data, each with its own sublist of link data.
   *
   * Each item in this structure is a group of themeatically related links.
   *
   * @example
   *
   * [{
   *   label: 'Culture',
   *   to: '/culture',
   *   links: [
   *     {url: '/atlas-magazine', label: 'Atlas Magazine'},
   *     {url: '/art-and-history', label: 'Art & History'},
   *     {url: '/news-and-updates', label: 'News & Updates'},
   *     {url: '/newsstand-studios', label: 'Newsstand Studios'},
   *   ],
   * }]
   */
  linkGroups: MenuLinkGroup[];
  /**
   * A list of menu link data to appear in a secondary nav.
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
  secondaryLinks?: MenuLinkProps[];
}

/**
 * `MenuHeadingButton` is used to trigger a reveal of a nested menu stack
 * on small screens. It is not displayed on large screens.
 */
const MenuHeadingButton = ({children, ...props}: ButtonProps) => (
  <Button
    variant="menuHeading"
    aria-haspopup="true"
    sx={{
      display: [null, 'none'],
      ':not(:disabled):hover svg': {
        transform: 'translateX(5px)',
      },
    }}
    {...props}
  >
    {children}
    <ArrowSvg
      aria-hidden
      sx={{mr: 2, transition: 'transform 0.3s ease-in-out'}}
    />
  </Button>
);

/**
 * `MenuBackButton` is used to return the main menu from a revealed
 * menu group on small screens. It is not displayed on large screens.
 */
const MenuBackButton = (props: ButtonProps) => (
  <Button
    aria-label="Back to main menu"
    variant="circle"
    sx={{display: [null, 'none']}}
    {...props}
  >
    <ArrowSvg
      aria-hidden
      sx={{
        transform: 'scaleX(-1)',
        strokeWidth: 1,
        width: '23px',
        height: 'auto',
      }}
    />
  </Button>
);

interface MenuGroupProps extends MenuLinkProps {
  /**
   * Whether or not this group is the active group.
   * On large screens, this has no visual or functional effect, but on
   * small screens, setting this to `true` will 'reveal' the menu group
   * with a scroll animation.
   */
  active: boolean;
  /**
   * A callback for handling when the menu group has been 'swiped' away.
   *
   * On large screens, this is not used, as there is no swipable interface,
   * but on small screens, this will be called when the menu group slide
   * overlay is swiped to reveal the content underneath.
   */
  onClose?: (label: string) => void;
  children: ReactNode;
}

/**
 * `MenuGroup` renders a list of menu links with a heading
 * and a 'View All' link.
 *
 * On small screens, this list is presented as a slide overlay,
 * meaning that it is animated over top of its parent, and can be swiped
 * to reveal the parent conten beneath.
 */
function MenuGroup({active, onClose, label, url, children}: MenuGroupProps) {
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);
  const [listElement, setListElement] = useState<HTMLElement | null>(null);
  const scrollTo = useScrollTo({domTarget: scrollElement, behavior: 'smooth'});
  const closeCallback = useRef(onClose);
  closeCallback.current = onClose;

  useEffect(() => {
    if (active && listElement && scrollElement) {
      let lastScrollLeft = scrollElement.scrollLeft;
      const options: AddEventListenerOptions = {passive: true};
      const handleScroll = () => {
        const {scrollLeft} = scrollElement;
        scrollElement.style.setProperty(
          '--overlay-opacity',
          `${Math.max(0, Math.min(1, scrollLeft / 200))}`,
        );
        if (scrollLeft <= 0 && lastScrollLeft > 0) {
          closeCallback.current?.(label);
        }
        lastScrollLeft = scrollLeft;
      };
      scrollElement.addEventListener('scroll', handleScroll, options);
      scrollTo(listElement);
      return () => {
        scrollElement.removeEventListener('scroll', handleScroll, options);
      };
    }
  }, [active, scrollTo, listElement, scrollElement, label]);

  return (
    <Grid
      gap={0}
      // We make a 2 column grid so that there will be enough scrollable
      // area on small screens to create the slide overlay effect.
      columns="repeat(2, 100%)"
      aria-expanded={active}
      aria-hidden={!active}
      ref={setScrollElement}
      sx={{
        // On small screens, position the group over its parent's content.
        position: ['absolute', 'static'],
        top: [0, 'auto'],
        left: [0, 'auto'],
        bottom: [0, 'auto'],
        right: [0, 'auto'],
        height: ['100%', 'auto'],
        zIndex: ['overlay', 'content'],

        // Disable pointer events on this element on small screens
        // so that underlying content can be interacted with by default.
        pointerEvents: ['none', 'auto'],

        // On small screens, make this content scrollable, and snap to
        // the grid elements' positions. This creates the swipable
        // slide overlay effect.
        overflowX: ['scroll', 'visible'],
        overscrollBehaviorX: 'contain',
        scrollSnapType: 'x mandatory',
        scrollbarWidth: 'none',
        '::-webkit-scrollbar': {
          display: 'none',
        },

        // Create a pseudoelement to act as an overlay and fill
        // the first column of the grid. On small screens,
        // this will render a semi-opaque overlay on top of
        // the parent content, but on large screens,
        // this pseudoelement is hidden, so the menu group contents
        // will move up to fill the first column instead of this overlay.
        '--overlay-opacity': '0',
        '::before': {
          content: '""',
          display: 'none',
          scrollSnapAlign: 'start',
          pointerEvents: 'auto',
          bg: 'backgroundOverlay',
          opacity: 'var(--overlay-opacity)',
        },

        // When this group is active, enable pointer events
        // and display the overlay on small screens.
        '&[aria-expanded="true"]': {
          pointerEvents: 'auto',

          '::before': {
            display: ['block', 'none'],
          },
        },
      }}
    >
      <FocusScope
        as="ul"
        role="region"
        aria-label={label}
        trap={active}
        restoreFocus
        ref={setListElement}
        sx={{
          scrollSnapAlign: 'start',
          flexDirection: 'column',
          display: ['none', 'flex'],
          bg: ['background', 'transparent'],
          pointerEvents: 'auto',
          py: [3, 0],
          px: [4, 0],

          '[aria-expanded="true"] > &': {
            display: 'flex',
          },
        }}
      >
        <Text as="li" variant="menuHeading" key={label} role="heading">
          {label}
        </Text>
        {children}
        <li key="to-all">
          <Link variant="menu" to={url}>
            View All
          </Link>
        </li>
        <li key="back" sx={{alignSelf: 'flex-end', display: ['block', 'none']}}>
          <MenuBackButton onClick={() => scrollTo(0, 0)} />
        </li>
      </FocusScope>
    </Grid>
  );
}

/**
 * `Menu` renders a grid of menu link groups and a grid of secondary links.
 *
 * On small screens, the grid of menu link groups is reduced to a column of
 * group heading links that, when activated, reveal their respective links
 * in a slide overlay.
 */
export const Menu = memo(function Menu({
  linkGroups,
  secondaryLinks,
}: MenuProps): JSX.Element {
  const location = useLocation();
  const enterLocation = useRef(location);
  const [activeLinkGroup, setActiveLinkGroup] = useState<string | null>(null);
  usePageTransitionPhase((phase) => {
    if (phase === 'leave') setActiveLinkGroup(null);
  });
  const linkGroupTrail = usePageTransition(linkGroups.length + 1, {
    enter: () => {
      enterLocation.current = location;
      return {opacity: 1, y: 0, config: {tension: 360, friction: 30}};
    },
    leave: () => ({
      opacity: 0,
      y: -6,
      config: {tension: 720, friction: 30, clamp: true},
      immediate: enterLocation.current !== location,
    }),
  });
  const firstTransition = linkGroupTrail[0];
  const midTransition = linkGroupTrail[Math.floor(linkGroupTrail.length / 2)];
  const lastTransition = linkGroupTrail[linkGroupTrail.length - 1];

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
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
        style={{
          transform: to(
            [firstTransition.opacity, midTransition.opacity],
            (first, mid) => `scaleY(${(first + mid) / 2})`,
          ),
        }}
      />
      <Box
        p={[3, 6]}
        m="0 auto"
        sx={{
          width: '100%',
          height: '100%',
          overflowX: 'hidden',
          overflowY: 'scroll',
          position: 'relative',
        }}
      >
        <Nav aria-label="main menu" sx={{maxWidth: '1220px', mx: 'auto'}}>
          <Grid
            as="ul"
            columns={['1fr', 'repeat(auto-fit, minmax(200px, 1fr))']}
            sx={{rowGap: [0, 4], columnGap: [0, 7, 8]}}
          >
            {linkGroups.map(({links, label: title, url: toAll}, groupIndex) => (
              <animated.li key={title} style={linkGroupTrail[groupIndex]}>
                <MenuHeadingButton onClick={() => setActiveLinkGroup(title)}>
                  {title}
                </MenuHeadingButton>
                <MenuGroup
                  label={title}
                  url={toAll}
                  active={activeLinkGroup === title}
                  onClose={(menuGroupLabel) => {
                    if (menuGroupLabel === activeLinkGroup) {
                      setActiveLinkGroup(null);
                    }
                  }}
                >
                  {links.map(({url, label}) => (
                    <li key={label} sx={{my: 1}}>
                      <Link variant="menu" to={url}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </MenuGroup>
              </animated.li>
            ))}
          </Grid>
        </Nav>
        {secondaryLinks?.length ? (
          <Nav
            aria-label="secondary menu"
            sx={{
              maxWidth: '1220px',
              mx: 'auto',
              mt: [5, 6],
            }}
          >
            <animated.ul
              sx={{display: 'flex', flexDirection: ['column', null, 'row']}}
              style={lastTransition}
            >
              {secondaryLinks.map(({url, label}) => (
                <li key={label} sx={{ml: [3, 0], mr: 4, mb: [3, 0]}}>
                  <Link variant="menuSecondary" to={url}>
                    {label}
                  </Link>
                </li>
              ))}
            </animated.ul>
          </Nav>
        ) : null}
      </Box>
    </Box>
  );
});
