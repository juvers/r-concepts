import LandmarkInlineWoffSrc from './Landmark-Inline.woff';
import LandmarkInlineWoff2Src from './Landmark-Inline.woff2';
import CentraNo2LightWoffSrc from './CentraNo2-Light.woff';
import CentraNo2LightWoff2Src from './CentraNo2-Light.woff2';
import CentraNo2LightItalicWoffSrc from './CentraNo2-LightItalic.woff';
import CentraNo2LightItalicWoff2Src from './CentraNo2-LightItalic.woff2';
import CentraNo2BookWoffSrc from './CentraNo2-Book.woff';
import CentraNo2BookWoff2Src from './CentraNo2-Book.woff2';
import CentraNo2BookItalicWoffSrc from './CentraNo2-BookItalic.woff';
import CentraNo2BookItalicWoff2Src from './CentraNo2-BookItalic.woff2';
import CentraNo2MediumWoffSrc from './CentraNo2-Medium.woff';
import CentraNo2MediumWoff2Src from './CentraNo2-Medium.woff2';
import CentraNo2MediumItalicWoffSrc from './CentraNo2-MediumItalic.woff';
import CentraNo2MediumItalicWoff2Src from './CentraNo2-MediumItalic.woff2';
import CentraNo2BoldWoffSrc from './CentraNo2-Bold.woff';
import CentraNo2BoldWoff2Src from './CentraNo2-Bold.woff2';
import CentraNo2BoldItalicWoffSrc from './CentraNo2-BoldItalic.woff';
import CentraNo2BoldItalicWoff2Src from './CentraNo2-BoldItalic.woff2';

interface FontFaceOptions {
  fontFamily: string;
  fontWeight: string | number;
  fontStyle: string;
  fallback: string;
  fontUrls: {
    src: string;
    format: string;
  }[];
  preload?: boolean;
}

/**
 * Describes a @font-face web font.
 *
 * Stringified, it can be used as a `font-family` value,
 * i.e.,
 *
 *     css`font-family: ${String(fontface)}`
 */
export interface FontFace extends FontFaceOptions {
  toString(): string;
}

function createFontFace(options: FontFaceOptions): FontFace {
  return Object.assign({}, options, {
    toString() {
      return `${options.fontFamily}, ${options.fallback}`;
    },
  });
}

/**
 * `LandmarkInline` family. normal style, 500 weight.
 */
export const LandmarkInline = createFontFace({
  fontFamily: 'Landmark',
  fontWeight: 500,
  fontStyle: 'normal',
  fallback: 'sans-serif',
  fontUrls: [
    {src: LandmarkInlineWoff2Src, format: 'woff2'},
    {src: LandmarkInlineWoffSrc, format: 'woff'},
  ],
  preload: true,
});

/**
 * `CentraNo2` family, normal style, 300 weight.
 */
export const CentraNo2Light = createFontFace({
  fontFamily: 'CentraNo2',
  fontWeight: 300,
  fontStyle: 'normal',
  fallback: 'sans-serif',
  fontUrls: [
    {src: CentraNo2LightWoff2Src, format: 'woff2'},
    {src: CentraNo2LightWoffSrc, format: 'woff'},
  ],
});

/**
 * `CentraNo2` family, italic style, 300 weight.
 */
export const CentraNo2LightItalic = createFontFace({
  fontFamily: 'CentraNo2',
  fontWeight: 300,
  fontStyle: 'italic',
  fallback: 'sans-serif',
  fontUrls: [
    {src: CentraNo2LightItalicWoff2Src, format: 'woff2'},
    {src: CentraNo2LightItalicWoffSrc, format: 'woff'},
  ],
});

/**
 * `CentraNo2` family, normal style, 400 weight.
 */
export const CentraNo2Book = createFontFace({
  fontFamily: 'CentraNo2',
  fontWeight: 400,
  fontStyle: 'normal',
  fallback: 'sans-serif',
  fontUrls: [
    {src: CentraNo2BookWoff2Src, format: 'woff2'},
    {src: CentraNo2BookWoffSrc, format: 'woff'},
  ],
  preload: true,
});

/**
 * `CentraNo2` family, italic style, 400 weight.
 */
export const CentraNo2BookItalic = createFontFace({
  fontFamily: 'CentraNo2',
  fontWeight: 400,
  fontStyle: 'italic',
  fallback: 'sans-serif',
  fontUrls: [
    {src: CentraNo2BookItalicWoff2Src, format: 'woff2'},
    {src: CentraNo2BookItalicWoffSrc, format: 'woff'},
  ],
});

/**
 * `CentraNo2` family, normal style, 500 weight.
 */
export const CentraNo2Medium = createFontFace({
  fontFamily: 'CentraNo2',
  fontWeight: 500,
  fontStyle: 'normal',
  fallback: 'sans-serif',
  fontUrls: [
    {src: CentraNo2MediumWoff2Src, format: 'woff2'},
    {src: CentraNo2MediumWoffSrc, format: 'woff'},
  ],
});

/**
 * `CentraNo2` family, italic style, 500 weight.
 */
export const CentraNo2MediumItalic = createFontFace({
  fontFamily: 'CentraNo2',
  fontWeight: 500,
  fontStyle: 'italic',
  fallback: 'sans-serif',
  fontUrls: [
    {src: CentraNo2MediumItalicWoff2Src, format: 'woff2'},
    {src: CentraNo2MediumItalicWoffSrc, format: 'woff'},
  ],
});

/**
 * `CentraNo2` family, normal style, 600 weight.
 */
export const CentraNo2Bold = createFontFace({
  fontFamily: 'CentraNo2',
  fontWeight: 600,
  fontStyle: 'normal',
  fallback: 'sans-serif',
  fontUrls: [
    {src: CentraNo2BoldWoff2Src, format: 'woff2'},
    {src: CentraNo2BoldWoffSrc, format: 'woff'},
  ],
});

/**
 * `CentraNo2` family, italic style, 600 weight.
 */
export const CentraNo2BoldItalic = createFontFace({
  fontFamily: 'CentraNo2',
  fontWeight: 600,
  fontStyle: 'italic',
  fallback: 'sans-serif',
  fontUrls: [
    {src: CentraNo2BoldItalicWoff2Src, format: 'woff2'},
    {src: CentraNo2BoldItalicWoffSrc, format: 'woff'},
  ],
});
