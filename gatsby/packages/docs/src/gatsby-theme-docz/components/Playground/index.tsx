/** @jsx jsx */
import {jsx} from '@tishman/components';
import {useState, useCallback, useRef, useEffect} from 'react';
import {LiveProvider, LiveError, LivePreview, LiveEditor} from 'react-live';
import Iframe, {FrameContextConsumer} from 'react-frame-component';
import {Resizable} from 're-resizable';
import copy from 'copy-text-to-clipboard';
import useSize from '@hzdg/use-size';
import {usePrismTheme} from 'gatsby-theme-docz/src/utils/theme';
import * as styles from 'gatsby-theme-docz/src/components/Playground/styles';
import * as Icons from 'gatsby-theme-docz/src/components/Icons';
import {LivePreviewWrapper} from './LivePreviewWrapper';

import type {Size} from '@hzdg/use-size';
import type {RefObject, ComponentProps} from 'react';

const getResizableProps = (
  width: string | number,
  setWidth: (v: string | number) => void,
  previewHeight: string | number,
) => ({
  minWidth: 260,
  maxWidth: '100%',
  size: {
    width: width,
    height: 'auto',
  },
  minHeight: previewHeight,
  style: {
    margin: 0,
    marginRight: 'auto',
    marginBottom: 75,
  },
  enable: {
    top: false,
    right: true,
    bottom: false,
    left: false,
    topRight: false,
    bottomRight: false,
    bottomLeft: false,
    topLeft: false,
  },
  onResizeStop: (_: unknown, __: unknown, ref: HTMLElement) => {
    setWidth(ref.style.width);
  },
});

const transformCode = (code: string) => {
  if (code.startsWith('()') || code.startsWith('class')) return code;
  return `<React.Fragment>${code}</React.Fragment>`;
};

const CLEAR_PADDING = `<style> body { padding: 0; margin: 0; overflow-y: hidden; }  </style>`;
const INITIAL_IFRAME_CONTENT = `<!DOCTYPE html><html><head> ${CLEAR_PADDING} </head><body><div></div></body></html>`;

const useMountedRef = (): RefObject<boolean> => {
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  return mounted;
};

export type PlaygroundProps = Pick<
  ComponentProps<typeof LiveProvider>,
  'code' | 'scope' | 'language'
>;

export const Playground = ({
  code,
  scope,
  language,
}: PlaygroundProps): JSX.Element => {
  // Makes sure scope is only given on mount to avoid infinite re-render on hot reloads
  const [scopeOnMount] = useState(scope);
  const [showingCode, setShowingCode] = useState(false);
  const [width, setWidth] = useState<string | number>('100%');
  const [previewHeight, setPreviewHeight] = useState<'auto' | number>('auto');

  const mounted = useMountedRef();

  const copyCode = useCallback(() => code && copy(code), [code]);
  const toggleCode = useCallback(() => setShowingCode((s) => !s), []);
  const handlePreviewResize = useCallback(
    ({height}: Size) => mounted.current && setPreviewHeight(height),
    [mounted],
  );

  const sizeRef = useSize<HTMLDivElement>(handlePreviewResize);
  const prismTheme = usePrismTheme();
  const resizableProps = getResizableProps(width, setWidth, previewHeight);

  return (
    <Resizable {...resizableProps} data-testid="playground">
      <LiveProvider
        code={code}
        scope={scopeOnMount}
        transformCode={transformCode}
        language={language}
        theme={prismTheme}
      >
        <div sx={styles.previewWrapper}>
          <Iframe
            initialContent={INITIAL_IFRAME_CONTENT}
            sx={{
              ...styles.wrapper(),
              ...styles.wrapperBorder('preview', showingCode),
              height: previewHeight,
            }}
          >
            <FrameContextConsumer>
              {(ctx) => (
                <LivePreviewWrapper iframe={ctx}>
                  <div ref={sizeRef}>
                    <LivePreview
                      sx={styles.preview}
                      data-testid="live-preview"
                    />
                  </div>
                </LivePreviewWrapper>
              )}
            </FrameContextConsumer>
          </Iframe>

          <div sx={styles.buttons}>
            <button sx={{...styles.button, color: 'accent'}} onClick={copyCode}>
              <Icons.Clipboard size={12} />
            </button>
            <button
              sx={{...styles.button, color: 'accent'}}
              onClick={toggleCode}
            >
              <Icons.Code size={12} />
            </button>
          </div>
        </div>
        {showingCode && (
          <div
            sx={{
              ...styles.wrapper(),
              ...styles.wrapperBorder('editor', showingCode),
              ...styles.editor(prismTheme),
            }}
          >
            <LiveEditor data-testid="live-editor" />
          </div>
        )}
        <LiveError sx={styles.error} data-testid="live-error" />
      </LiveProvider>
    </Resizable>
  );
};
