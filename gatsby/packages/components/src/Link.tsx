/** @jsx jsx */
import {useRef, useState, useEffect, useCallback} from 'react';
import {jsx, Link as ThemeUiLink} from 'theme-ui';
import {navigate, withPrefix, Link as GatsbyLink} from 'gatsby';
import {useLocation, Link as ReachLink} from '@reach/router';
import {getWindow} from '@hzdg/dom-utils';

import type {MouseEvent, RefObject, ComponentType, ComponentProps} from 'react';
import type {GatsbyLinkProps} from 'gatsby-link';
import type {TishmanVariant} from '~themes';

/**
 * `useInternalLinkComponent` will return a component compatible
 * with @reach/router `Link`.
 *
 * If the component is being used in a Gatsby app, the returned component
 * will be `GatsbyLink`, otherwise, it will be Reach Router `Link`.
 *
 * This is useful for creating links that should work like `GatsbyLink`
 * in a Gatsby app, but like a Reach Router `Link` everywhere else
 * (i.e., in a documentation or testing context).
 */
function useInternalLinkComponent<TState>(
  ref: RefObject<HTMLAnchorElement>,
): ComponentType<Omit<GatsbyLinkProps<TState>, 'ref'>> {
  // Default to using `GatsbyLink`.
  const [LinkComponent, setLinkComponent] = useState<
    ComponentType<Omit<GatsbyLinkProps<TState>, 'ref'>>
  >(GatsbyLink);
  useEffect(() => {
    // As a mount effect, change the link component to `ReachLink`
    // _only_ if we are mounted in a browser-like environment,
    // but _not_ in a Gatsby app. We determine if we're in a Gatsby app
    // by checking for Gatsby's magic global `___navigate` function
    // (which `GatsbyLink` uses instead of Reach `navigate`,
    // and is the reason why we need to do this at all).
    const win = getWindow(ref.current);
    if (win && !('___navigate' in win)) setLinkComponent(ReachLink);
  }, [ref]);
  return LinkComponent;
}

export interface InternalLinkProps<TState>
  extends Omit<GatsbyLinkProps<TState>, 'ref' | 'innerRef'> {
  /** The link style variant to use. */
  variant?: TishmanVariant<'links'>;
}

/**
 * A `GatsbyLink`-compatible component that works like `GatsbyLink`
 * in a Gatsby app, but like a @reach/router `Link` everywhere else.
 */
export function InternalLink<TState>({
  sx,
  variant,
  ...props
}: InternalLinkProps<TState>): JSX.Element {
  const ref = useRef<HTMLAnchorElement>(null);
  const InternalLink = useInternalLinkComponent<TState>(ref);
  return (
    <InternalLink
      innerRef={ref}
      sx={variant ? {...sx, variant: `links.${variant}`} : sx}
      {...props}
    />
  );
}

export interface AnchorLinkProps<TState>
  extends Omit<GatsbyLinkProps<TState>, 'ref' | 'innerRef'> {
  /** The link style variant to use. */
  variant?: TishmanVariant<'links'>;
}

/**
 * A `GatsbyLink`-compatible component that updates the location hash
 * (i.e., `<AnchorLink to="#id">`) rather than navigating to a new location.
 */
export function AnchorLink<TState>({
  to,
  replace,
  state,
  onClick,
  sx,
  variant,
  className,
  style,
  activeStyle,
  activeClassName = 'active',
  ...props
}: AnchorLinkProps<TState>): JSX.Element {
  const {pathname, hash} = useLocation();
  const ref = useRef<HTMLAnchorElement>(null);
  const InternalLink = useInternalLinkComponent<TState>(ref);
  const href = withPrefix(`${pathname}${to}`);
  const active = hash === to;
  /**
   * We have to manually navigate on click to prevent Gatsby from
   * automatically jumping the scroll position to the element.
   */
  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (e.defaultPrevented) return;
      e.preventDefault();
      void navigate(href, {replace, state});
    },
    [href, onClick, replace, state],
  );
  return (
    <InternalLink
      innerRef={ref}
      to={href}
      onClick={handleClick}
      sx={variant ? {...sx, variant: `links.${variant}`} : sx}
      className={
        active && activeClassName
          ? (className?.split(' ') || [])
              .concat(activeClassName)
              .filter(Boolean)
              .join(` `)
          : className
      }
      style={active && activeStyle ? {...style, ...activeStyle} : style}
      {...props}
    />
  );
}

export interface ExternalLinkProps
  extends Omit<
    ComponentProps<typeof ThemeUiLink>,
    'ref' | 'target' | 'rel' | 'variant'
  > {
  /** The link style variant to use. */
  variant?: TishmanVariant<'links'>;
}

/**
 * A component that renders an external link.
 *
 * External links will open in a new window and block
 * cross-origin destinations from accessing the opener window.
 */
export function ExternalLink(props: ExternalLinkProps): JSX.Element {
  return <ThemeUiLink target="_blank" rel="noopener" {...props} />;
}

interface LinkPropsBase<TState>
  extends Omit<GatsbyLinkProps<TState>, 'ref' | 'innerRef' | 'to'> {
  to?: string;
  href?: string;
  /** The link style variant to use. */
  variant?: TishmanVariant<'links'>;
}

export interface LinkPropsWithTo<TState>
  extends Omit<LinkPropsBase<TState>, 'href'> {
  /**
   * The url string to navigate to.
   * Can be internal or external.
   */
  to: string;
}

export interface LinkPropsWithHref<TState>
  extends Omit<LinkPropsBase<TState>, 'to'> {
  /**
   * The url string to navigate to.
   * Can be internal or external.
   */
  href: string;
}

export type LinkProps<TState> =
  | LinkPropsWithTo<TState>
  | LinkPropsWithHref<TState>;

/**
 * A `GatsbyLink`-compatible component that supports internal,
 * external, and anchor urls.
 *
 * If the url is deemed internal (like `"/slug"`), then the standard
 * `GatsbyLink` behavior is used.
 *
 * If the url is an anchor (like `"#id"`), then the location is updated
 * with the new hash, but the standard gatsby scroll updating is aborted
 * (to allow for custom UI updates based on hash, like scroll animations
 * or tabbed view changes, etc.).
 *
 * If the url is external (like `"https://google.com"`), then
 * a new window will be opened (with protection from cross-origin
 * access to the opener window).
 */
export function Link<TState>(props: LinkPropsWithTo<TState>): JSX.Element;
export function Link<TState>(props: LinkPropsWithHref<TState>): JSX.Element;
export function Link<TState>({
  to,
  href = to,
  ...props
}: LinkPropsBase<TState>): JSX.Element {
  // Use Gatsby/Reach Link for internal links.(?!static)

  if (href) {
    //Case for urls that start with a slash /
    if (/^\/(?!\/|static\/)/.test(href)) {
      const url = new URL(href, 'https://www.rockefellercenter.com');
      if (!url.pathname.endsWith('/')) {
        url.pathname = `${url.pathname}/`;
      }
      href = url.toString().replace('https://www.rockefellercenter.com', '');
      return <InternalLink to={href} {...props} />;
    }
    // Second option is href starts with a hash # which means it should
    // be used as an anchor link and will scroll to anchor location
    if (href.startsWith('#')) {
      return <AnchorLink to={href} {...props} />;
    }
  }
  return <ExternalLink href={href} {...props} />;
}
