import * as React from 'react';
import FontFacesLoader, {
  InitializeFontFacesStage,
} from './src/fonts/FontFacesLoader';
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
 * @param {import("gatsby").RenderBodyArgs} context - Gatsby context
 * @param {import("gatsby").PluginOptions} options - Plugin options
 */
export const onRenderBody = ({setPreBodyComponents}) => {
  setPreBodyComponents([
    <InitializeFontFacesStage key="font-faces-no-flash" />,
  ]);
};
