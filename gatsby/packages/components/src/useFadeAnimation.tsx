/** @jsx jsx */
import {useSpring, useTrail, config} from 'react-spring';
import useIntersection from '@hzdg/use-intersection';

//ADD comments and all the good things here if this code lives past this week.

type FadeAnimationProps = {
  initialYPosition?: number;
  finalYPosition?: number;
  threshold?: number;
};

export const useFadeAnimation = ({
  initialYPosition = 40,
  finalYPosition = 0,
  threshold = 0.75,
}: FadeAnimationProps = {}): [
  Record<string, unknown>,
  (node: HTMLElement | null) => void,
] => {
  const [props, set] = useSpring(() => ({
    config: {...config.slow, clamp: true},
    opacity: 0,
    y: initialYPosition,
  }));

  const ref = useIntersection(
    ({isIntersecting, rootBounds, boundingClientRect: rect}) => {
      const intersects = isIntersecting || (rootBounds?.top ?? 0) >= rect.top;

      void set({
        opacity: intersects ? 1 : 0,
        y: intersects ? finalYPosition : initialYPosition,
      });
    },
    {
      threshold,
    },
  );

  return [props, ref];
};

type FadeAnimationTrailProps = {
  numberOfItems: number;
  initialYPosition?: number;
  finalYPosition?: number;
  initialXPosition?: number;
  finalXPosition?: number;
  threshold?: number;
};

export const useFadeAnimationTrail = ({
  numberOfItems = 0,
  initialYPosition = 40,
  finalYPosition = 0,
  initialXPosition = 0,
  finalXPosition = 0,
  threshold = 0.75,
}: FadeAnimationTrailProps): [
  Record<string, unknown>[],
  (node: HTMLElement | null) => void,
] => {
  const [trail, set] = useTrail(numberOfItems, () => ({
    config: {...config.stiff, clamp: true},
    opacity: 0,
    y: initialYPosition,
    x: initialXPosition,
  }));

  const ref = useIntersection(
    ({isIntersecting, rootBounds, boundingClientRect: rect}) => {
      const intersects = isIntersecting || (rootBounds?.top ?? 0) >= rect.top;

      void set({
        opacity: intersects ? 1 : 0,
        y: intersects ? finalYPosition : initialYPosition,
        x: intersects ? finalXPosition : initialXPosition,
      });
    },
    {
      threshold,
    },
  );

  return [trail, ref];
};
