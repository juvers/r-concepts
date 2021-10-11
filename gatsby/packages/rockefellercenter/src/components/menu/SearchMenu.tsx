/** @jsx jsx */
import {animated} from 'react-spring';
import {
  jsx,
  Box,
  Grid,
  Button,
  RockefellerCenterLogoSvg,
  CloseXSvg,
  usePageTransition,
} from '@tishman/components';
import {SearchForm} from '~components/SearchForm';

import type {SearchFormProps} from '~components/SearchForm';

export interface SearchMenuProps extends SearchFormProps {
  /**
   * Optional callback to call when the search menu close button is pressed.
   */
  onClose?: () => void;
}

export function SearchMenu({
  to,
  suggestions,
  onClose,
}: SearchMenuProps): JSX.Element {
  const bgTransition = usePageTransition({
    enter: {scaleY: 1, config: {tension: 190, friction: 32}},
    leave: {
      scaleY: 0,
      config: {tension: 260, friction: 28, clamp: true},
      delay: 100,
    },
  });
  const opacityTrail = usePageTransition(2, {
    enter: {opacity: 1, config: {tension: 360, friction: 30}, delay: 100},
    leave: {opacity: 0, config: {tension: 720, friction: 30, clamp: true}},
  });
  return (
    <Box sx={{position: 'relative', placeSelf: 'start stretch'}}>
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
      <Grid
        gap={0}
        m="0 auto"
        sx={{
          width: '100%',
          height: '100%',
          minWidth: '320px',
          maxWidth: '1440px',
          position: 'relative',
          placeItems: 'start center',
        }}
      >
        <Grid
          columns="2fr 1fr 2fr"
          gap={0}
          m={[3, null, 4]}
          sx={{
            '::before': {content: '""'},
            '::after': {content: '""'},
          }}
        >
          <animated.div style={opacityTrail[1]}>
            <RockefellerCenterLogoSvg
              sx={{
                color: 'logo',
                maxWidth: 238,
                minWidth: 150,
                width: '100%',
                height: 'auto',
              }}
            />
          </animated.div>
        </Grid>
      </Grid>
      <SearchForm to={to} suggestions={suggestions} />
      <animated.span
        sx={{position: 'absolute', top: [4, null, 5], right: [3, null, 4]}}
        style={opacityTrail[0]}
      >
        <Button
          aria-label="Close search menu"
          variant="iconUnderline"
          onClick={onClose}
        >
          <CloseXSvg aria-hidden />
        </Button>
      </animated.span>
    </Box>
  );
}
