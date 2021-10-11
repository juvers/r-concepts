import {useState, useLayoutEffect, useCallback, RefObject} from 'react';

type RectResult = {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
};

const getRect = <T extends HTMLElement>(element?: T): RectResult => {
  let rect: RectResult = {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
  };
  if (element) rect = element.getBoundingClientRect();
  return rect;
};

/**
 * Use Rect
 *
 * Pass a reference to the element whose measurements you want
 *
 * This hook will return the bounding client rect and update
 *
 * whenever the window is resized.
 *
 * @param {RefObject} ref element whose bounding client rect you want
 * @return {RectResult} The elements bounding client rect
 */
export function useRect(ref: RefObject<HTMLElement>): RectResult {
  const [rect, setRect] = useState<RectResult>(
    ref && ref.current ? getRect(ref.current) : getRect(),
  );

  const handleResize = useCallback(() => {
    if (!ref.current) return;
    setRect(getRect(ref.current));
  }, [ref]);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize, ref]);

  return rect;
}
