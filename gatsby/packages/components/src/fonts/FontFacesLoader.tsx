/** @jsx jsx */
import {
  Fragment,
  useMemo,
  useEffect,
  useReducer,
  useLayoutEffect,
  createContext,
  useContext,
} from 'react';
import {Helmet} from 'react-helmet';
import {Global, css, jsx} from '@emotion/core';
import FontFaceObserver from 'fontfaceobserver';
import * as FontFaces from './FontFaces';

import type {ReactNode} from 'react';
import type {FontFace} from './FontFaces';

/**
 * A loader for one or more font faces.
 *
 * This is a wrapper around one or more `FontFaceObservers`.
 *
 * See https://fontfaceobserver.com/
 */
interface FontFaceLoader {
  /**
   * Loads all font faces associated with this loader.
   *
   * @returns a promise that resolves when all associated font faces have loaded.
   */
  load(): Promise<void>;
}

/**
 * A distinct stage of the font loading process.
 *
 * @see getNextStage
 */
type FontLoadStage = 'preloading' | 'preloaded' | 'loaded' | 'disabled';

/**
 * An event that may occur during the font loading process.
 *
 * @see getNextStage
 */
type FontLoadEvent = 'PRELOADED' | 'LOADED' | 'LOAD_FAILED';

const fonts = Object.values(FontFaces);
/** Fonts that should be preloaded (via `<link re="preload">`). */
const fontsToPreload = fonts.filter(({preload}) => preload);
/** Fonts that don't need to be preloaded. */
const fontsToLoad = fonts.filter(({preload}) => !preload);

/** A loader for all fonts that should be preloaded (via `<link re="preload">`). */
const preloader: FontFaceLoader = {
  async load() {
    await Promise.all(
      fontsToPreload.map(({fontFamily}) =>
        new FontFaceObserver(fontFamily).load(),
      ),
    );
  },
};

/** A loader for all fonts that don't need to be preloaded. */
const loader: FontFaceLoader = {
  async load() {
    await Promise.all(
      fontsToLoad.map(({fontFamily}) =>
        new FontFaceObserver(fontFamily).load(),
      ),
    );
  },
};

/**
 * Given the `currentStage` and an `event`,
 * determines what the next stage should be.
 *
 * @see FontFacesLoader
 */
function getNextStage(
  currentStage: FontLoadStage,
  event: FontLoadEvent,
): FontLoadStage {
  switch (event) {
    case 'PRELOADED':
      return currentStage === 'preloading' ? 'preloaded' : currentStage;
    case 'LOADED':
      return 'loaded';
    case 'LOAD_FAILED':
      return 'disabled';
    default:
      return currentStage;
  }
}

const initializeFontFacesStageScript = `(function() { try {
  var fontsLoaded = sessionStorage.getItem('fonts-loaded');
  if (fontsLoaded !== 'true') return;
  document.body.classList.add('fonts-loaded');
} catch (e) {} })();`;

/**
 * Initializes the font faces loading stage before javascript has loaded.
 *
 * This avoids FOUT on subsequent loads by jumping straight to
 * the assumption that fonts are already loaded.
 *
 */
export const InitializeFontFacesStage = (): JSX.Element => (
  <script
    key="font-faces-no-flash"
    dangerouslySetInnerHTML={{__html: initializeFontFacesStageScript}}
  />
);

const FontLoadStageContext = createContext<FontLoadStage>('preloading');
FontLoadStageContext.displayName = 'FontLoadStage';

/** Returns the current font loading stage. */
export const useFontLoadingStage = (): FontLoadStage =>
  useContext(FontLoadStageContext);

export interface FontFacesLoaderProps {
  children?: ReactNode;
}

/**
 * Adds global `@font-face` styles and `<link rel="preload">` links to the head.
 *
 * Also manages `font-<stage>` class names on `body`, where `<stage>`
 * is one of the defined `FontStage` values, according to the following:
 *
 *    fonts-preloading
 *            │
 *            ├─▶ EVENT:PRELOADED ──▶ fonts-preloaded
 *            │                              │
 *            │                              ├─▶ EVENT:LOADED ──▶ fonts-loaded
 *            │                              │
 *            │                              └─▶ EVENT:LOAD_FAILED ──▶ fonts-disabled
 *            │
 *            └─▶ EVENT:LOAD_FAILED ──▶ fonts-disabled
 *
 * This is an implementation of "Critical FOFT with preload",
 * where "FOFT" is "Flash of Faux Text", meaning text is initially rendered
 * with a regular subset of a font and _synthesized_ weight and style
 * variants until the true variants are loaded, and "preload" means
 * the subset fonts are preloaded using `<link rel="preload">`.
 *
 * For a thorough explanation of this scheme,
 * see https://www.zachleat.com/web/comprehensive-webfonts/#critical-foft-with-preload
 *
 * For more on preload,
 * see: https://www.zachleat.com/web/comprehensive-webfonts/#preload
 *
 */
export default function FontFacesLoader({
  children,
}: FontFacesLoaderProps): JSX.Element {
  const [stage, dispatch] = useReducer(getNextStage, 'preloading');

  useEffect(() => {
    if (
      typeof sessionStorage !== 'undefined' &&
      sessionStorage.getItem('fonts-loaded')
    ) {
      dispatch('LOADED');
    } else {
      void (async () => {
        try {
          await preloader.load();
          dispatch('PRELOADED');
          await loader.load();
          dispatch('LOADED');
        } catch (e) {
          dispatch('LOAD_FAILED');
        }
      })();
    }
  }, []);

  useLayoutEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.classList.remove(
      'fonts-preloading',
      'fonts-preloaded',
      'fonts-loaded',
      'fonts-disabled',
    );
    document.body.classList.add(`fonts-${stage}`);
    if (stage === 'loaded' && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('fonts-loaded', 'true');
    }
  }, [stage]);

  return (
    <Fragment>
      <Global
        styles={useMemo(
          () =>
            fonts.map(
              ({fontFamily, fontWeight, fontStyle, fontUrls}: FontFace) => css`
                @font-face {
                  font-family: '${fontFamily}';
                  font-weight: ${fontWeight};
                  font-style: ${fontStyle};
                  src: ${fontUrls
                    .map(
                      (font) => `url("${font.src}") format("${font.format}")`,
                    )
                    .join(', ')};
                }
              `,
            ),
          [],
        )}
      />
      <Helmet>
        {fontsToPreload.map(({fontFamily, fontUrls}: FontFace) => (
          <link
            key={`preload-${fontFamily}`}
            rel="preload"
            href={fontUrls[0].src}
            as="font"
            type={`font/${fontUrls[0].format}`}
            crossOrigin=""
          />
        ))}
      </Helmet>
      <FontLoadStageContext.Provider value={stage}>
        {children}
      </FontLoadStageContext.Provider>
    </Fragment>
  );
}
