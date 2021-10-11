import * as React from 'react';
import FontFacesLoader from './src/fonts/FontFacesLoader';
import ResetCss from './ResetCss';
/**
 * @param {import("gatsby").WrapRootElementNodeArgs} context - Gatsby context
 * @param {import("gatsby").PluginOptions} options - Plugin options
 */
export const wrapRootElement = ({element}) => {
  return (
    <React.Fragment>
      <ResetCss />
      <FontFacesLoader>{element}</FontFacesLoader>
    </React.Fragment>
  );
};

/**
 * Don't update scroll position if the navigation is occurring
 * via an 'anchor link', i.e., `<Link to="#id">`.
 *
 * We opt out of automatic scroll updating in this case because
 * `AnchorSection` implements an animated scroll effect for anchor links.
 *
 * @see `AnchorSection` for more.
 *
 * @param {import('gatsby').ShouldUpdateScrollArgs}
 */
export const shouldUpdateScroll = ({prevRouterProps, routerProps}) => {
  if (
    prevRouterProps &&
    prevRouterProps.location.pathname === routerProps.location.pathname &&
    routerProps.location.hash
  ) {
    return false;
  }
};
