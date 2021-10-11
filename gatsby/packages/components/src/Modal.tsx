/** @jsx jsx */
import {jsx} from '@tishman/components';
import {forwardRef, useCallback, useRef} from 'react';
import FocusScope from '@hzdg/focus-scope';
import {getDocument} from '@hzdg/dom-utils';
import {Overlay} from '@tishman/components';
import {useMergedRef} from '~useMergedRef';
import {PageTransition} from '~PageTransition';

import type {Ref} from 'react';
import type {FocusManager, FocusScopeProps} from '@hzdg/focus-scope';

function shouldHandleEvent(
  event: React.PointerEvent,
  currentTarget: Element | null,
) {
  if (!currentTarget) return false;
  // If the event target is not the current target, ignore the event.
  if (event.target !== currentTarget) return false;
  // If the event's default behavior is prevented, ignore the event.
  if (event.defaultPrevented) return false;
  // If an auxillary mouse button was pressed, ignore the event.
  if (event.button > 0) return false;
  // If the event target is not attached to a DOM, ignore the event.
  const doc = getDocument(event.target as Node)?.documentElement;
  if (!doc || !doc.contains(event.target as Node)) return false;
  return true;
}

export interface ModalProps extends FocusScopeProps<'div'> {
  /** Whether the modal is open. */
  isOpen?: boolean;
  /**
   * A callback that will be called when the Modal detects
   * an Escape key press or a click outside of the Modal content.
   *
   * Note that the Modal won't actually close itself! This callback
   * is the way to implement 'closing' the modal (i.e., by rerendering
   * with `isOpen` set to `false`).
   */
  onClose?: () => void;
  /**
   * A callback that will be called when the Modal and content has
   * finished its closing transition.
   */
  onCloseFinished?: () => void;
}

/**
 * `Modal` covers the viewport with an overlay
 * and displays modal content on top of the overlay
 * with accessible affordances baked in, such as:
 *   - traps focus within the modal content
 *   - automatically focuses on the modal content
 *   - restores focus to the previously focused element on close
 *   - closes when the ESC key is pressed
 *   - closes when a click is detected outside of the modal content
 *
 * It is also controllable via the `isOpen` and `onClose` props.
 */
export const Modal = forwardRef(function Modal(
  {
    isOpen,
    onClose,
    onCloseFinished,
    onKeyPress,
    onPointerDown,
    onPointerUp,
    trap = true,
    autoFocus = true,
    restoreFocus = true,
    children,
    ...props
  }: ModalProps,
  forwardedRef: Ref<HTMLDivElement>,
): JSX.Element | null {
  const closeCallback = useRef(onClose);
  closeCallback.current = onClose;
  const closeFinishedCallback = useRef(onCloseFinished);
  closeFinishedCallback.current = onCloseFinished;
  const close = useCallback(() => closeCallback.current?.(), []);

  const overlayRef = useRef<HTMLElement>(null);
  const ref = useMergedRef(forwardedRef, overlayRef);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent, focusManager: FocusManager) => {
      onKeyPress?.(event, focusManager);
      if (event.defaultPrevented) return;
      if (event.key === 'Escape') {
        close();
        event.preventDefault();
      }
    },
    [close, onKeyPress],
  );

  const isDown = useRef(false);
  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerDown?.(event);
      if (shouldHandleEvent(event, overlayRef.current)) {
        isDown.current = true;
      }
    },
    [onPointerDown],
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerUp?.(event);
      if (isDown.current && shouldHandleEvent(event, overlayRef.current)) {
        close();
        event.preventDefault();
      }
      isDown.current = false;
    },
    [close, onPointerUp],
  );

  const handleTransitionRest = useCallback(() => {
    if (!isOpen) closeFinishedCallback.current?.();
  }, [isOpen]);

  return (
    <PageTransition onRest={handleTransitionRest}>
      {isOpen ? (
        <FocusScope
          key="modal"
          as={Overlay}
          trap={trap}
          autoFocus={autoFocus} // eslint-disable-line jsx-a11y/no-autofocus
          restoreFocus={restoreFocus}
          onKeyPress={handleKeyPress}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          ref={ref}
          {...props}
        >
          {children}
        </FocusScope>
      ) : null}
    </PageTransition>
  );
});
