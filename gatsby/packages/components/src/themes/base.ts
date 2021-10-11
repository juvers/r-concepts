import {alpha} from '@theme-ui/color';
import * as FontFaces from '../fonts/FontFaces';
import * as colors from './colors';
import * as styles from './styles';
import * as buttons from './variants/buttons';
import * as forms from './variants/forms';
import * as layout from './variants/layout';
import * as links from './variants/links';
import * as text from './variants/text';

/**
 * The base Tishman theme.
 *
 * This theme is used at the root of all tishman apps.
 * Individual pages and components should use any of the
 * attraction-specific themes in the exported `themes` object.
 */
export default {
  // We aren't using color modes, so we disable the local storage
  // mechanism, which only helps optimize color mode
  // loading when the color mode is user-chosen.
  useLocalStorage: false,

  colors: {
    text: colors.BLACK,
    textInverted: colors.WHITE,
    textDisabled: colors.BLACK,
    background: colors.WHITE,
    backgroundDisabled: colors.GRAY,
    backgroundOverlay: alpha(colors.BLACK, 0.5)({}),
    primary: colors.NAVY,
    secondary: colors.GREEN,
    accent: colors.TUSSOCK,
    accentSecondary: colors.ROMAN_COFFEE,
    muted: colors.CONCRETE,
    mediaCaption: colors.WHITE,
    logo: colors.BLACK,
    pageName: colors.CONCRETE,
    heroBackground: colors.CREAM,
    error: colors.RED,
  },

  fonts: {
    heading: String(FontFaces.LandmarkInline),
    headingSecondary: String(FontFaces.CentraNo2Book),
    body: String(FontFaces.CentraNo2Book),
    button: String(FontFaces.CentraNo2Book),
    link: String(FontFaces.CentraNo2Book),
  },

  //         [ 0   1   2   3   4   5   6   7   8   9  10]
  fontSizes: [12, 14, 16, 18, 21, 24, 30, 46, 60, 72, 80],

  fontWeights: {
    body: 300,
    heading: 500,
    light: 300,
    book: 300,
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 600,
  },

  lineHeights: {
    body: 1.5,
    headingPlus: 1.25,
    heading: 1.125,
    footer: 1.875,
  },

  letterSpacings: [-1, -0.5, -0.25, 0, 1, 2],

  //     [0  1  2   3   4   5   6   7    8    9]
  space: [0, 4, 8, 16, 32, 48, 64, 88, 104, 128],

  sizes: {
    // The margin of the filter bar on mobile, for pages that have it.
    filterMargin: 40,
    // The height of the filter bar on mobile, for pages that have it.
    filterBarMobile: 65,
    // The height of the filter bar, for pages that have it.
    filterBar: 80,
    // The height of the CTA fixed to the bottom on mobile, for pages that have it.
    ctaMobile: 65,
    // Need to update this number with design.
    // NOTE: If this changes, the corresponding breakpoint must change, too.
    container: 1200,
  },

  // copy of default breakpoints so it comes up in useThemeUi
  // plus a breakpoint to match layout.container.maxWidth
  //           [0         1       2         3         4]
  breakpoints: ['640px', '832px', '1024px', '1200px', '1400px'],

  radii: {
    square: 0,
    radius: 4,
    rounded: 10,
  },

  zIndices: {
    background: -1,
    content: 0,
    sticky: 1,
    fixed: 2,
    overlay: 3,
  },

  styles,
  buttons,
  forms,
  layout,
  links,
  text,
} as const;
