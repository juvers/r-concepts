/** @jsx jsx */
import {jsx, css} from '@tishman/components';
import {ColorModeProvider} from '@theme-ui/color-modes';
import {useMemo} from 'react';
import {CacheProvider, Global} from '@emotion/core';
// eslint-disable-next-line @tishman/avoid-tishman-components-src
import FontFacesLoader from '@tishman/components/src/fonts/FontFacesLoader';
import ResetCss from '@tishman/components/ResetCss';
import createCache from '@emotion/cache';

import type {Interpolation} from '@emotion/core';
// eslint-disable-next-line @tishman/prefer-tishman-components
import type {Theme} from 'theme-ui';
import type {ReactNode} from 'react';
import type {FrameContextProps} from 'react-frame-component';

const useEmotionCache = (container: HTMLElement) => {
  return useMemo(() => createCache({container, key: 'live-preview-css'}), [
    container,
  ]);
};

/** Adapted from https://github.com/system-ui/theme-ui/blob/2c72fa/packages/theme-provider/src/index.ts#L13-L35 */
const BodyStyles = () => (
  <Global
    styles={(theme: Theme) => {
      if (
        theme.useBodyStyles === false ||
        (theme.styles && !theme.styles.root)
      ) {
        return false;
      }
      const boxSizing = theme.useBorderBox === false ? undefined : 'border-box';

      return css({
        '*': {
          boxSizing,
        },
        body: {
          margin: 0,
          variant: 'styles.root',
        },
      })(theme) as Interpolation;
    }}
  />
);

export interface LivePreviewWrapperProps {
  children?: ReactNode;
  iframe: FrameContextProps;
}

export const LivePreviewWrapper = ({
  children,
  iframe,
}: LivePreviewWrapperProps): JSX.Element => {
  return (
    <CacheProvider value={useEmotionCache(iframe.document.head)}>
      <ResetCss />
      <ColorModeProvider>
        <BodyStyles />
        <FontFacesLoader>{children}</FontFacesLoader>
      </ColorModeProvider>
    </CacheProvider>
  );
};
