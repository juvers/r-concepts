/** @jsx jsx */
import {Fragment, useMemo, useRef, useEffect} from 'react';
import {animated, useTransition} from 'react-spring';
import {
  jsx,
  Box,
  Text,
  Link,
  RockefellerCenterLogoTypeSvg,
  RockefellerCenterLogoSvg,
  ObservationDeckLogoSvg,
  RainbowRoomLogoSvg,
  RinkLogoSvg,
  TopOfTheRockLogoSvg,
  RockefellerCenterTourLogoSvg,
  LoftAndGardenLogoSvg,
  NewsStandStudiosSvg,
} from '@tishman/components';

import type {ReactElement} from 'react';
import type {LinkProps} from '@tishman/components';

export type LogoType =
  | 'Rockefeller Center'
  | 'Top of the Rock'
  | 'Top of the Rock Buy Tickets'
  | 'Observation Deck Buy Tickets'
  | 'Observation Deck'
  | 'Rainbow Room'
  | 'The Rink'
  | 'Rockefeller Center Tour'
  | '620 Loft and Garden'
  | 'Newsstand studios';

export interface MenuBarLogoProps<LinkState = unknown> {
  logo: LogoType;
  pageName?: string | null;
  /**
   * The link to follow when the logo is clicked.
   */
  link: {
    /** The path the Logo links to. */
    to: string;
    /** The label for the link (will be a title). */
    label: string;
    /** Optional state to add to location state when the logo is clicked. */
    state?: LinkProps<LinkState>['state'];
  } | null;
}

const getKey = ({props: {logo, pageName}}: ReactElement<MenuBarLogoProps>) =>
  `${logo}${pageName ? `:${pageName}` : ''}`;

const logoStyles = {
  transition: 'color 0.7s ease-in-out',
  width: '100%',
  height: 'auto',
};

function LogoSvg({
  logo,
  pageName,
}: Pick<MenuBarLogoProps, 'logo' | 'pageName'>) {
  switch (logo) {
    case 'Rockefeller Center': {
      if (pageName !== undefined) {
        return (
          <Fragment>
            <RockefellerCenterLogoSvg
              sx={{maxWidth: 238, minWidth: 150, ...logoStyles}}
            />
            {pageName ? (
              <Text
                mt={['-0.8em', null, null, '-1em']}
                ml={['-0.4em', null, null, '-0.5em']}
                variant="rockCenterPageName"
              >
                {pageName}
              </Text>
            ) : null}
          </Fragment>
        );
      } else {
        return (
          <RockefellerCenterLogoTypeSvg
            sx={{maxWidth: 238, minWidth: 150, ...logoStyles}}
          />
        );
      }
    }
    case 'Observation Deck': {
      return (
        <ObservationDeckLogoSvg
          sx={{maxWidth: 275, minWidth: 175, ...logoStyles}}
        />
      );
    }
    case 'Rainbow Room': {
      return (
        <Fragment>
          <RainbowRoomLogoSvg
            sx={{maxWidth: 150, minWidth: 110, ...logoStyles}}
          />
          {pageName ? (
            <Text mt="1em" variant="rainbowRoomPageName">
              {pageName}
            </Text>
          ) : null}
        </Fragment>
      );
    }
    case 'The Rink': {
      return (
        <RinkLogoSvg
          sx={{
            mt: 2,
            maxWidth: 270,
            minWidth: 184,
            width: '100%',
            height: 'auto',
          }}
        />
      );
    }
    case 'Top of the Rock': {
      return (
        <TopOfTheRockLogoSvg
          sx={{maxWidth: 275, minWidth: 175, ...logoStyles}}
        />
      );
    }
    case 'Top of the Rock Buy Tickets': {
      return (
        <TopOfTheRockLogoSvg
          sx={{maxWidth: 171, minWidth: 132, ...logoStyles}}
        />
      );
    }
    case 'Observation Deck Buy Tickets': {
      return (
        <ObservationDeckLogoSvg
          sx={{maxWidth: 180, minWidth: 175, ...logoStyles}}
        />
      );
    }
    case 'Rockefeller Center Tour': {
      return (
        <RockefellerCenterTourLogoSvg
          sx={{maxWidth: 175, minWidth: 139, ...logoStyles}}
        />
      );
    }
    case '620 Loft and Garden': {
      return (
        <LoftAndGardenLogoSvg
          sx={{maxWidth: 155, minWidth: 130, ...logoStyles}}
        />
      );
    }
    case 'Newsstand studios': {
      return (
        <NewsStandStudiosSvg
          sx={{
            maxWidth: 155,
            minWidth: [155, 359],
            position: 'absolute',
            top: [20, 0],
            ...logoStyles,
          }}
        />
      );
    }
  }
}

const useMountedRef = () => {
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => void (mounted.current = false);
  }, []);
  return mounted;
};

export function MenuBarLogo(props: MenuBarLogoProps): JSX.Element {
  const mounted = useMountedRef();
  const logo = useMemo(
    () => <LogoSvg logo={props.logo} pageName={props.pageName} />,
    [props.logo, props.pageName],
  );

  const transition = useTransition(logo, {
    key: getKey,
    from: () => ({opacity: mounted.current ? 0 : 1}),
    enter: {opacity: 1},
    leave: {opacity: 0},
  });

  return props.link ? (
    <Link
      sx={{
        height: 'calc(100% - 8px)',
        color: 'currentColor',
        position: 'relative',
      }}
      to={props.link.to}
      title={props.link.label}
      state={props.link.state}
    >
      {transition((style, element) => (
        <animated.div
          style={style}
          sx={{
            display: 'flex',
            position: 'absolute',
            top: 0,
            width: '100%',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'logo',
          }}
        >
          {element}
        </animated.div>
      ))}
    </Link>
  ) : (
    <Box sx={{height: 'calc(100% - 8px)', position: 'relative'}}>
      {transition((style, element) => (
        <animated.div
          style={style}
          sx={{
            display: 'flex',
            position: 'absolute',
            top: 0,
            width: '100%',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'logo',
          }}
        >
          {element}
        </animated.div>
      ))}
    </Box>
  );
}
