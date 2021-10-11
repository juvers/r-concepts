import {RefObject} from 'react';
import {useThemeUI, SxStyleProp} from '@tishman/components';

import {useRect} from './useRect';

interface MobileValues {
  mobileWidthAry: number[];
  mobileLeftAry: number[];
}

interface DesktopValues {
  desktopWidth: number;
  desktopLeft: number;
}

/**
 * Use Gutter
 *
 * Get array of gutter value based on theme spaces array
 *
 * This is the space between the viewport and section line
 * 
 * This hook is used as future proofing incase the 
 * theme.space ary ever gets updated, it will also update here
 * 
 * [3, 4] matches the gutter of mobile designs
 * theme.spaces[3] = 16
 * theme.spaces[4] = 32
 
 * @return {number[]} An array of theme space values or
 */
const useGutter = (): number[] => {
  const {theme} = useThemeUI();
  const getGutterValue = (index: number, fallback: number): number => {
    if (
      Array.isArray(theme?.space) &&
      typeof theme?.space?.[index] === 'number'
    ) {
      return Number(theme.space[index]);
    }
    return fallback;
  };

  return [getGutterValue(3, 16), getGutterValue(4, 32)];
};

/**
 * Get Mobile Values
 *
 * Get mobile values for history line
 *
 * Since Section Line is left aligned on mobile
 *
 * We must draw line from title to the section line
 *
 * @param {number} left - left position of title element
 * @param {number} gutter - Gutter distance (space between viewport and section line)
 * @return {MobileValues} the width and Left position of the history line on mobile
 */
const getMobileValues = (left: number, gutterAry: number[]): MobileValues => {
  const extraPadding = 10;
  return {
    mobileWidthAry: gutterAry.map((gutter) => left - gutter - extraPadding),
    mobileLeftAry: gutterAry.map((gutter) => -left + gutter),
  };
};

/**
 * Get Desktop Values
 *
 * Get desktop values for history line
 *
 * Since Section Line is center aligned on desktop
 *
 * We must draw line from title to the section line
 *
 * We must take into account line is also on right side
 *
 * @param {number} sectionWidth - width of viewport
 * @param {number} left - left position of title element
 * @param {number} right - right position of title element
 * @return {DesktopValues} the width and Left position of the history line on desktop
 */
const getDesktopValues = (
  sectionWidth: number,
  left: number,
  right: number,
): DesktopValues => {
  const centerOfWindow = sectionWidth / 2;
  if (left > centerOfWindow) {
    // item on right side
    const linePadding = 20; // shorter line per design
    return {
      desktopWidth: left - centerOfWindow - linePadding,
      desktopLeft: centerOfWindow - left,
    };
  } else {
    const linePadding = 5;
    return {
      desktopWidth: centerOfWindow - right - linePadding,
      desktopLeft: right - left + linePadding,
    };
  }
};

/**
 * Use History Section Line
 *
 * hook to create the history section line pseudo element
 * based on designs
 *
 * Note: both history section line and  history title line
 * use the same gutterAry to ensure they always match
 *
 * @param {RefObject<HTMLElement>} loadMoreButtonRef - ref of load more button
 * @return {SxStyleProp} The History Section line
 */
export const useHistorySectionLine = (
  loadMoreButtonRef?: RefObject<HTMLElement>,
): SxStyleProp => {
  const gutterAry = useGutter();
  const offsetTop = loadMoreButtonRef?.current?.offsetTop;
  return {
    position: 'relative',
    '::after': {
      position: 'absolute',
      content: '""',
      // if loadMoreButtonRef, set height should to top of button
      // else to bottom of section
      height: offsetTop ? offsetTop : '100%',
      width: 1,
      bg: 'muted',
      left: [...gutterAry, '50%'],
      transform: 'translateX(-50%)',
      top: 0,
    },
  };
};

/**
 * Use History Title Line
 *
 * Hook to create the history title line pseudo element
 * based on designs
 *
 * This line connects the image card titles element to the
 * history section line
 *
 *
 * Note: both history section line and  history title line
 * use the same gutterAry to ensure they always match
 *
 * @param {RefObject<HTMLElement>} titleRef - ref of title element
 * @return {SxStyleProp} The History Section line
 */
export const useHistoryTitleLine = (
  titleRef: RefObject<HTMLElement>,
  sectionWidth?: number,
): SxStyleProp => {
  const {left, right} = useRect(titleRef);

  const gutterAry = useGutter();

  const {mobileWidthAry, mobileLeftAry} = getMobileValues(left, gutterAry);

  const {desktopWidth, desktopLeft} = getDesktopValues(
    sectionWidth || 0,
    left,
    right,
  );

  return {
    '::after': {
      position: 'absolute',
      content: '""',
      height: 1,
      width: [...mobileWidthAry, desktopWidth],
      left: [...mobileLeftAry, desktopLeft],
      top: '50%',
      bg: 'muted',
    },
  };
};
