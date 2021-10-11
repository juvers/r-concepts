import {calc} from '@tishman/components';

import type {TishmanTheme, Theme} from '@tishman/components';

export type FontSizesArray = (string | number | null)[];

enum UNIT {
  px = 'px',
  em = 'em',
  rem = 'rem',
  '%' = '%',
}

const isValidUnit = (unit: unknown): unit is UNIT => (unit as string) in UNIT;

const parseUnit = (from: number | string): UNIT => {
  if (typeof from === 'number') return UNIT.px;
  const unit = from.replace(/\d+(.*)/, '$1');
  if (isValidUnit(unit)) return unit;
  return UNIT.px;
};

class FontSize {
  readonly value: number;
  readonly unit: UNIT;
  constructor(from: number | string) {
    this.value = parseFloat(String(from));
    this.unit = parseUnit(from);
  }
  toString(): string {
    return `${this.value}${this.unit}`;
  }
  valueOf(): string {
    return this.toString();
  }
}

/**
 * clamp `value` between `0` and `max`,
 * with bias toward `min` if `value` is `undefined`
 */
const clampMin = (min: number, max: number, value = -Infinity) =>
  Math.min(max, Math.max(min, value));

/**
 * clamp `value` between `min` and `max`,
 * with bias toward `max` if `value` is `undefined`
 */
const clampMax = (min: number, max: number, value = Infinity) =>
  Math.max(min, Math.min(max, value));

/** Pick a linear distribution of `n` number of `values`.  */
const distribute = <T>(values: Iterable<T>, n: number): T[] => {
  const arr = Array.from(values);
  const max = arr.length;
  if (n >= max) return arr;
  const result = [arr.shift() as T];
  const inc = max / n;
  for (let i = inc; i < max; i += inc) {
    result.push(arr[Math.round(i)]);
  }
  return result;
};

function* ranges(fontSizes?: FontSizesArray) {
  const toEmit = [...(fontSizes ?? [])];
  do {
    const nextRange = [];
    if (toEmit.length) nextRange.push(toEmit.shift());
    while (toEmit[0] === null) nextRange.push(toEmit.shift());
    if (toEmit[0] !== null) nextRange.push(toEmit[0]);
    yield nextRange;
  } while (toEmit.length);
}

function* generateFluidFontSizes(
  theme: TishmanTheme,
  fontSizes: FontSizesArray = distribute(
    theme.fontSizes.keys(),
    theme.breakpoints.length,
  ),
) {
  const maxIndex = theme.fontSizes.length - 1;
  const maxBreakpoint = theme.breakpoints.length - 1;
  /** The breakpoint index currently being generated. */
  let breakpoint = 0;

  for (const range of ranges(fontSizes)) {
    const min = range.shift() ?? 0;
    const max = range.pop();

    let fMin: FontSize;
    if (typeof min === 'string') {
      fMin = new FontSize(min);
    } else {
      fMin = new FontSize(theme.fontSizes[clampMin(0, maxIndex, min)]);
    }

    if (breakpoint === 0) {
      yield fMin.toString();
    }

    if (breakpoint >= maxBreakpoint || max == null) {
      yield fMin.toString();
      continue;
    }

    let fMax: FontSize;
    if (typeof max === 'string') {
      fMax = new FontSize(max);
    } else {
      fMax = new FontSize(
        theme.fontSizes[
          clampMax(typeof min === 'number' ? min : 0, maxIndex, max)
        ],
      );
    }

    const wMin = theme.breakpoints[breakpoint];
    breakpoint += range.length + 1;
    const wMax = theme.breakpoints[clampMax(0, maxBreakpoint, breakpoint)];

    yield `calc(${fMin} + (${fMax.value} - ${
      fMin.value
    }) * ((100vw - ${wMin}) / (${parseInt(wMax)} - ${parseInt(wMin)})))`;

    while (range.length) {
      yield range.pop() ?? null;
    }
  }
}

/** A map of theme and font size data to generated fluid font size arrays. */
const memoized = new Map();

/** Generates a string key to identify a theme and set of font sizes. */
const getKey = (theme: TishmanTheme, fontSizes?: FontSizesArray) =>
  [
    theme.fontSizes.join(','),
    theme.breakpoints.join(','),
    fontSizes?.join(','),
  ].join('::');

const memoizedFluidFontSizes = (
  theme: TishmanTheme,
  fontSizes?: FontSizesArray,
): FontSizesArray => {
  const key = getKey(theme, fontSizes);
  if (memoized.has(key)) return memoized.get(key);
  const value = Array.from(generateFluidFontSizes(theme, fontSizes));
  memoized.set(key, value);
  return value;
};

/**
 * `fluidFontSize` works similarly to a responsive value array of font sizes,
 * but linearly interpolates font size between the breakpoints.
 *
 * Returns a ThemeUI value function that generates a responsive value array
 * that clamps to min and max font sizes at the min and max breakpoints,
 * respectively, and linearly interpolates the font size in between.
 *
 * @see https://madebymike.com.au/writing/precise-control-responsive-typography/
 * @see https://theme-ui.com/sx-prop/#functional-values
 *
 * @example
 * <Text sx={{fontSize: fluidFontSize([4, null, 6, null, 10])>
 *   wheeeeee!
 * </Text>
 */
export const fluidFontSize = (
  /**
   * A ThemeUI responsive value array that represents the boundaries
   * of fluid font sizing.
   */
  fontSizes?: FontSizesArray,
): ((theme: Theme) => FontSizesArray) =>
  calc((theme) => memoizedFluidFontSizes(theme, fontSizes));
