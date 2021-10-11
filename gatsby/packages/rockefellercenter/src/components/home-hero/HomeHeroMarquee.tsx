/** @jsx jsx */
import {jsx, Box, antiWidow, fluidFontSize} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {keyframes} from '@emotion/core';

export interface HomeHeroMarqueeProps {
  children: string;
  /**
   * Whether the marquee is hidden.
   *
   * When `true`, the marquee content will not be visible.
   *
   * When not `true`, the content animation will be triggered.
   *
   * This is useful for delaying the animation until the marquee
   * is meant to be visible, in the viewport, or 'revealed' by
   * some preceeding sequence of animation, etc.
   */
  hidden?: boolean;
}

/** Duration of the marquee animation, in ms. */
const MARQUEE_DURATION = 7000;

const MARQUEE = keyframes({
  from: {transform: 'translateX(20%)', opacity: 0},
  // We add a slight delay the opacity animation so the marquee
  // is already in motion as it is revealed.
  '10%': {opacity: 0},
  '20%': {opacity: 1},
  to: {transform: 'translateX(-50%)'},
});

/**
 * Delay before fading out the duplicate marquee content, in ms.
 *
 * Note that this delay is _added_ to `MARQUEE_DURATION`.
 * */
const FADE_DELAY = 250;

const FADE = keyframes({
  from: {opacity: 1},
  to: {opacity: 0},
});

/**
 * `HomeHeroMarquee` is a heading that applies a one-off introductory
 * 'marquee' effect to its content.
 *
 * Think stock ticker, but repeating the same content and then stopping.
 */
export function HomeHeroMarquee({
  children,
  hidden,
}: HomeHeroMarqueeProps): JSX.Element {
  return (
    /**
     * We wrap the `H` in a block container beacuse we want a negative
     * margin collapse to occur between the marquee and the next block
     * of content, but we can't apply the margin directly to the `H`
     * because it is displayed inline-block (so we can precisely measure
     * the width of the content).
     *
     * The negative margin must be proportional to the font size (since
     * it is meant to align the top of the next block with the baseline
     * of the marquee content), so we also hoist the font size up to
     * this block.
     */
    <Box
      sx={{
        width: '100%',
        overflow: 'hidden',
        fontSize: fluidFontSize([6, null, null, null, 10]),
        mb: '-0.4em',
      }}
    >
      <H
        sx={{
          position: 'relative',
          display: 'inline-block',
          variant: 'text.heading',
          lineHeight: 1,
          letterSpacing: -1,
          fontSize: 'inherit',
          /**
           * We offset by 50% of the container,
           * then translate by -50% of the content width
           * to center the marquee on screen,
           */
          left: '50%',
          /** Wrap and center the marquee text on mobile. */
          whiteSpace: ['unset', 'nowrap'],
          textAlign: ['center', 'unset'],
          transform: ['translateX(-50%)', 'unset'],
          /** Animate the marquee offset linearly on desktop. */
          animationName: ['none', MARQUEE.toString()],
          animationTimingFunction: 'linear',
          animationDuration: `${MARQUEE_DURATION / 1000}s`,
          animationFillMode: 'forwards',
          animationPlayState: hidden ? 'paused' : 'running',

          /**
           * Use a pseudoelement to preprend a copy of the marquee content.
           * This copy of the content will be hidden after a delay
           * matching the duration of the marquee animation.
           */
          ':before': {
            /** Don't show the marquee effect on mobile. */
            display: ['none', 'inline'],
            /**
             * This content string looks weird, so here's a bit of explanation:
             *
             * `\\a0` inserts a non-breaking space between
             * this pseudo content and the real content.
             * See: https://stackoverflow.com/a/8595802/356955
             *
             * `/ ""` specifies an empty alt text for this element,
             * which should effectively hide this content from screen readers.
             * See https://stackoverflow.com/a/47451397/356955
             */
            content: `"${children}\\a0${children}\\a0" / ""`,
            /**
             * Take the pseudo content out of the flow,
             * so it doesn't contribute to the width of the element,
             * then position it _before_ the real content.
             */
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'translateX(-100%)',

            /**
             * Animate the pseudo content opacity to 0,
             * but delay it until _after_ the marquee animation.
             */
            animationName: ['none', FADE.toString()],
            animationTimingFunction: 'ease-out',
            animationDuration: '0.5s',
            animationDelay: `${(MARQUEE_DURATION + FADE_DELAY) / 1000}s`,
            animationFillMode: 'forwards',
            animationPlayState: hidden ? 'paused' : 'running',
          },
        }}
      >
        {antiWidow(children)}
      </H>
    </Box>
  );
}
