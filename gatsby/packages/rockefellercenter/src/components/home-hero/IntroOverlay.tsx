/**@jsx jsx */
import {Box, fluidFontSize, jsx} from '@tishman/components';
import {useEffect, useRef, useState, useMemo} from 'react';
import {H} from '@hzdg/sectioning';
import {useTrail, useSpring, useChain, config, a} from 'react-spring';

import type {SpringValue} from 'react-spring';

/**
 * Interpolates the animated styles for the intro headline.
 *
 * Note: This interpolation _should_ be done automatically by
 * react-spring, but there is a bug with animating string values
 * in with a trail ainimation.
 *
 * @see https://github.com/pmndrs/react-spring/issues/1118
 *
 */
const interpolate = (style: {
  offset: SpringValue<number>;
  opacity: SpringValue<number>;
}) => ({
  opacity: style.opacity,
  transform: style.offset.to((v) => `translateY(${v}%)`),
});

export interface IntroOverlayProps {
  /** Whether or not the intro should play. */
  play?: boolean;
  /** Optional callback to be called when the intro animation enters. */
  onEnter?: () => void;
  /** Optional callback to be called when the intro animation leaves. */
  onLeave?: () => void;
  /** Optional callback to be called when the intro animation finishes. */
  onRest?: () => void;
  /** The text to animate */
  text: string;
}

export const IntroOverlay = ({
  play,
  onEnter,
  onLeave,
  onRest,
  text,
}: IntroOverlayProps): JSX.Element => {
  const [phase, setPhase] = useState<'init' | 'enter' | 'leave'>('init');

  useEffect(() => {
    if (play && phase === 'init') {
      setPhase('enter');
      onEnter?.();
    }
  }, [onEnter, phase, play]);

  const trailsRef = useRef(null);
  // **NOTE:** `offset` is meant to be a percentage transform here,
  // But we can't simply use `y: '10%'` because of bugs.
  // See `interpolate` above for more.
  const trails = useTrail(3, {
    ref: trailsRef,
    from: {offset: 20, opacity: 0},
    to: phase === 'leave' ? {offset: -20, opacity: 0} : {offset: 0, opacity: 1},
    clamp: true,
    config: phase === 'enter' ? {tension: 280, friction: 50} : config.stiff,
    delay: phase === 'enter' ? 600 : 300,
    onStart: phase === 'leave' ? () => onLeave?.() : undefined,
    onRest:
      phase === 'enter'
        ? ({finished}) => finished && setPhase('leave')
        : undefined,
  });

  const revealRef = useRef(null);
  const reveal = useSpring({
    ref: revealRef,
    from: {scaleY: 2},
    to: {scaleY: phase === 'enter' ? 1 : 0},
    clamp: true,
    onRest:
      phase === 'leave' ? ({finished}) => finished && onRest?.() : undefined,
  });

  useChain(
    phase === 'enter'
      ? [revealRef, trailsRef]
      : phase === 'leave'
      ? [trailsRef, revealRef]
      : [],
    phase === 'enter' ? [0.4, 0] : undefined,
  );

  const splitText = useMemo(() => text.split(' '), [text]);
  const lineOne = useMemo(() => splitText.slice(0, 2).join(' '), [splitText]);
  const lineTwo = useMemo(() => splitText[2], [splitText]);
  const lineThree = useMemo(() => splitText.slice(3), [splitText]);

  return (
    <Box
      sx={{
        display: ['none', 'unset'],
        zIndex: 'overlay',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <H
        sx={{
          variant: 'text.heading',
          fontSize: fluidFontSize(['80px', null, null, null, '220px']),
          letterSpacing: 0,
          lineHeight: 0.9,
        }}
      >
        <a.div style={interpolate(trails[0])}>{lineOne}</a.div>
        <a.div style={interpolate(trails[1])}>{lineTwo}</a.div>
        <a.div style={interpolate(trails[2])}>{lineThree}</a.div>
      </H>
      <a.div
        style={reveal}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          bg: 'background',
          zIndex: 'background',
          transformOrigin: 'top center',
        }}
      />
    </Box>
  );
};
