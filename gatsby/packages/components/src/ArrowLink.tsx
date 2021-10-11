/** @jsx jsx */
import {jsx, Link, ArrowSvg, SxStyleProp} from '@tishman/components';

import type {LinkPropsWithHref} from '@tishman/components';

export interface ArrowLinkProps<TState> extends LinkPropsWithHref<TState> {
  /** A label for the arrow button. */
  label: string;
  /**
   * Whether to render the arrow before the label,
   * and pointing to the left instead of to the right.
   */
  reverse?: boolean;
  /** Any overriding styles to change default styling */
  sx?: SxStyleProp;
  /** Some sx props get passed as classNames to components */
  className?: string;
}

export function ArrowLink<TState>({
  label,
  reverse,
  className,
  ...other
}: ArrowLinkProps<TState>): JSX.Element {
  return (
    <Link
      aria-label={label}
      variant={reverse ? 'backArrow' : 'arrow'}
      {...other}
      className={className}
    >
      {label}
      <ArrowSvg aria-hidden />
    </Link>
  );
}

export default ArrowLink;
