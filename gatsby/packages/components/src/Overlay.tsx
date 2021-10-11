/** @jsx jsx */
import {jsx, useThemeUI} from '@tishman/components';
import {forwardRef, useRef} from 'react';
import {animated} from 'react-spring';
import {useLocation} from '@reach/router';
import {useMergedRef} from '~useMergedRef';
import {useBlockedDocument} from '~useBlockedDocument';
import {usePageTransition} from '~PageTransition';

import type {ComponentPropsWithRef} from 'react';

export interface OverlayProps extends ComponentPropsWithRef<'div'> {
  /**
   * By default, the overlay will block pointer events and scrolling
   * for elements visually 'underneath' the overlay. Set this to `true`
   * to allow those pointer events.
   */
  allowPointerEvents?: boolean;
}

/**
 * `Overlay` covers the viewport with a dark, semi-transparent color
 * and displays its content on top of the background. It also
 * blocks scrolling and pointer events for the content underneath,
 * unless `allowPointerEvents` is `true`.
 */
export const Overlay = forwardRef(function Overlay(
  {allowPointerEvents = false, children, style, sx, ...props}: OverlayProps,
  forwardedRef: OverlayProps['ref'],
): JSX.Element {
  const location = useLocation();
  const {theme} = useThemeUI();
  const enterLocation = useRef(location);
  const blockedDocRef = useBlockedDocument(!allowPointerEvents);
  const setRef = useMergedRef(forwardedRef, blockedDocRef);
  const transition = usePageTransition({
    enter: () => {
      enterLocation.current = location;
      return {backgroundColor: theme.colors.backgroundOverlay};
    },
    leave: () => ({
      backgroundColor: 'rgba(0, 0, 0, 0)',
      delay: 250,
      immediate: enterLocation.current !== location,
    }),
  });
  return (
    <animated.div
      {...props}
      sx={{variant: 'layout.overlay', ...sx}}
      style={{
        // Note: We _invert_ the pointer event behavior on the overlay itself.
        // This is so that, when `allowPointerEvents` is true, the overlay
        // itself will not capture any pointer events, and when it is `false`,
        // the overlay becomes interactive (i.e., for clicking the overlay
        // to close it).
        pointerEvents: allowPointerEvents ? 'none' : 'auto',
        ...transition,
        ...style,
      }}
      ref={setRef}
    >
      {children}
    </animated.div>
  );
});
