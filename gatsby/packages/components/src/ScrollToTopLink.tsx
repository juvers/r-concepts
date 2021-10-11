/** @jsx jsx */
import {jsx, Link, ArrowSvg, useScrollTo} from '@tishman/components';
import {useLocation} from '@reach/router';
import {navigate} from 'gatsby';
import {memo, useRef} from 'react';

import type {MouseEventHandler} from 'react';
import type {LinkProps} from '@tishman/components';

export interface ScrollToTopLinkProps<TState>
  extends Omit<
    LinkProps<TState>,
    'to' | 'href' | 'ref' | 'innerRef' | 'variant'
  > {
  variant?: 'upArrow' | 'upArrowCompressed';
}

/** A dumb link that scrolls to the top of the screen. */
export const ScrollToTopLink = memo(function ScrollToTopLink<TState>({
  children = 'Back to Top',
  variant = 'upArrow',
  onClick,
  ...props
}: ScrollToTopLinkProps<TState>): JSX.Element {
  const onClickCallback = useRef<MouseEventHandler | null | undefined>(onClick);
  onClickCallback.current = onClick;
  const scrollTo = useScrollTo({behavior: 'smooth', forceAnimation: true});
  const {pathname, hash} = useLocation();
  return (
    <Link
      to="#"
      variant={variant}
      onClick={(e) => {
        onClickCallback.current?.(e);
        if (!e.defaultPrevented) {
          e.preventDefault();
          // If a hash is present in the URL, strip it away.
          if (hash) void navigate(pathname);
          scrollTo(0, 0);
        }
      }}
      {...props}
    >
      {children}
      <ArrowSvg aria-hidden />
    </Link>
  );
});
