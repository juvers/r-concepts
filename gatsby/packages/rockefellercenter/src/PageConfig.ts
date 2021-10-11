/** @jsx jsx */
import createStore from 'zustand';
import {produce} from 'immer';
import {useEffect} from 'react';
import invariant from 'invariant';

import type {State} from 'zustand';
import type {TishmanThemeName, LinkProps} from '@tishman/components';
import type {LogoType} from '~components/menu';
import type {MetaProps} from '~components/Meta';

/** Props that describe what the logo links to in the `MenuBar`. */
export interface LogoLinkConfig<TState = unknown> {
  /** The path the Logo links to. */
  to: string;
  /** The label for the link (will be a title). */
  label: string;
  /** Optional state to add to location state when the logo is clicked. */
  state?: LinkProps<TState>['state'];
}

/** Props that describe a page-specific CTA, like a 'buy tickets' button. */
export interface PageCtaConfig<TState = unknown> {
  /** The path the CTA links to. */
  to: string;
  /** The label for the CTA. */
  label: string;
  /** Optional state to add to location state when the CTA is clicked. */
  state?: LinkProps<TState>['state'];
}

/** Props that describe a page-specific navigation item, like a 'back' button. */
export interface PageNavProps<TState = unknown> {
  /** The path the Nav item links to. */
  to: string;
  /** The label for the Nav item. */
  label: string;
  /**
   * Optional link variant to use.
   *
   * For a left nav item, the default variant is `'backArrow'`.
   *
   * For a right nav item, the default variant is `'underline'`.
   */
  variant?: LinkProps<TState>['variant'];
  /** Optional state to add to location state when the nav item is clicked. */
  state?: LinkProps<TState>['state'];
}

/**
 * Page-specific config for the App.
 *
 * **Note**: All values are optional, and pages do not have to
 * define any configuration at all, if the defaults are correct.
 */
export interface PageConfig<
  /** State added to location state when the Logo is clicked. */
  LogoLinkState = unknown,
  /** State added to location state when the CTA is clicked. */
  CtaState = unknown,
  /** State added to location state when the right nav item is clicked. */
  RightNavState = unknown,
  /** State added to location state when the left nav item is clicked. */
  LeftNavState = unknown
> {
  /**
   * The theme to apply to the `MenuBar`.
   *
   * The default is `"Rock Center"`.
   */
  theme?: TishmanThemeName;
  /**
   * The logo to show in the `MenuBar`.
   *
   * The default is `"Rockefeller Center"`.
   */
  logo?: LogoType;
  /**
   * Optional link to wrap the logo in.
   * If not provided, it defaults to the Rockefeller Center home page.
   * Set to `null` to make the logo not link to anything.
   */
  logoLink?: LogoLinkConfig<LogoLinkState> | null;
  /**
   * An optional short name for this page, .e.g., 'Home', or 'Bar SixtyFive'.
   * This name will appear underneath the logo, replacing any
   * logo type (like the "Rockefeller Center" type under the default logo)
   * that may be present.
   *
   * Set this to `null` to hide the logo type.
   */
  pageName?: string | null;
  /**
   * Optional navigation item to appear on the left side of the `MenuBar`.
   * By default, this will be a back arrow button, but can be modified
   * by passing a `variant`.
   *
   * Note that, if provided, this will _replace_ the Menu toggle button!
   */
  leftNav?: PageNavProps<LeftNavState>;
  /**
   * Optional navigation item to appear on the right side of the `MenuBar`,
   * _before_ the Search toggle button. By default, this is a text link,
   * but can be modified by passing a `variant`.
   *
   * Note: This will be hidden on small screens!
   */
  rightNav?: PageNavProps<RightNavState>;
  /**
   * Optional navigation item to appear on the right side of the `MenuBar`,
   * _after_ the Search toggle Button. Visually, this is a button.
   *
   * Note: This will become sticky to the bottom of small screens!
   */
  cta?: PageCtaConfig<CtaState>;
  /**
   * Whether or not to hide the search toggle button in the `MenuBar`.
   */
  hideSearchToggleButton?: boolean;
  /**
   * Metadata for the page.
   *
   * Any props for the `Meta` component are valid here.
   *
   * @see ~components/Meta
   *
   * @example
   * {meta: {title: 'Page title', description: 'Page dsescription'}}
   */
  meta?: MetaProps;
  /**
   * The path for the page.
   *
   * This is usually set automatically.
   */
  path?: string;
}

type JsonScalar = string | number | boolean | null;
type JsonObject = {
  [key: string]: JsonScalar | JsonObject | JsonArray;
};
type JsonArray = (JsonScalar | JsonObject | JsonArray)[];
type Json = JsonScalar | JsonObject | JsonArray;

export type PageContext<C extends PageConfig = PageConfig> = C & {
  path: string;
  data?: {meta?: Json};
};

const usePageConfigStore = createStore<PageConfig & State>(() => ({}));

// TODO: Add more MetaProps to extract.
/** The Meta props to extract from page data. */
const extactableMetaKeys = ['title', 'description', 'source'] as const;

type ExtractableMeta = Pick<MetaProps, typeof extactableMetaKeys[number]>;

/**
 * Extracts `Meta` props from the given page data.
 *
 * If the data has a `meta` field with an object value, that object
 * will be walked, looking for keys that match extractable props.
 * Once it has found values for all of the extractable `Meta` props,
 * _or_ it has walked all of the `meta` data, it returns the extracted props.
 */
function extractMeta(data?: {meta?: Json}): ExtractableMeta {
  const extracted: ExtractableMeta = {};
  if (data?.meta && typeof data.meta === 'object') {
    const keysToExtract = new Set(extactableMetaKeys);
    const nodesToCheck: (JsonObject | JsonArray)[] = [data.meta];
    while (nodesToCheck.length && keysToExtract.size) {
      const node = nodesToCheck.pop();
      if (Array.isArray(node)) {
        node.forEach((v) => v && typeof v === 'object' && nodesToCheck.push(v));
      } else if (node && typeof node === 'object') {
        Object.entries(node).forEach(([key, value]) => {
          if (value && keysToExtract.has(key as keyof ExtractableMeta)) {
            invariant(
              typeof value === 'string',
              `invalid meta data type ${typeof value}`,
            );
            extracted[key as keyof ExtractableMeta] = value;
            keysToExtract.delete(key as keyof ExtractableMeta);
          } else if (value && typeof value === 'object') {
            nodesToCheck.push(value);
          }
        });
      }
    }
  }
  return extracted;
}

/**
 * Merges Gatsby page context and data into the current page config.
 *
 * Note that this function treats the config as _immutable_,
 * so if any of the page config values change,
 * a _new_ page config object will be returned.
 */
function mergeContext<
  T extends PageConfig = PageConfig,
  C extends PageContext = PageContext<T>
>(context: C, config: T): T {
  const {path, data, ...withConfig} = context;
  return produce(config, (draft) => {
    const extractedMeta = extractMeta(data);
    if (path === draft.path) {
      // we are updating
      Object.assign(draft, withConfig);
      if (extractedMeta) {
        if (draft.meta) Object.assign(draft.meta, extractedMeta);
        else draft.meta = extractedMeta;
      }
    } else {
      // we are replacing
      const newConfig = {path, ...withConfig};
      if (extractedMeta) newConfig.meta = extractedMeta;
      return newConfig;
    }
  }) as T;
}

/**
 * A Zustand state hook for using the `PageConfig` anywhere!
 */
export function usePageConfig<T extends PageConfig = PageConfig>(): T;
/**
 * A Zustand state hook for using the `PageConfig` anywhere!
 *
 * Pass a selector function to select some page config.
 */
export function usePageConfig<U, T extends PageConfig = PageConfig>(
  selector: (state: T) => U,
): U;
/**
 * A Zustand state hook for using the `PageConfig` anywhere!
 *
 * Pass a `context` object to reset the page config.
 * This is normally only used at the `App` level.
 */
export function usePageConfig<
  T extends PageConfig = PageConfig,
  C extends PageContext = PageContext<T>
>(context: C): T;
/** @internal */
export function usePageConfig<
  U,
  T extends PageConfig = PageConfig,
  C extends PageContext = PageContext<T>
>(contextOrSelector?: C | ((state: T) => U)): T | U {
  let context: C | undefined;
  let selector: ((state: T) => U) | undefined;
  let state = usePageConfigStore();
  if (contextOrSelector) {
    if (typeof contextOrSelector === 'function') {
      selector = contextOrSelector;
    } else {
      context = contextOrSelector;
      state = mergeContext(context, state);
    }
  }
  useEffect(() => usePageConfigStore.setState(state, true), [state]);
  return selector?.(state as T) ?? (state as T);
}
