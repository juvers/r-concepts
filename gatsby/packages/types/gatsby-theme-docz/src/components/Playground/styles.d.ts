declare module 'gatsby-theme-docz/src/components/Playground/styles' {
  // eslint-disable-next-line @tishman/prefer-tishman-components
  import type {ThemeUICSSObject} from 'theme-ui';
  import type {PrismTheme} from 'prism-react-renderer';
  export const editor: (theme: PrismTheme) => ThemeUICSSObject;
  export const wrapper: () => ThemeUICSSObject;
  export const wrapperBorder: (
    content: string,
    showingCode: boolean,
  ) => ThemeUICSSObject;
  export const error: ThemeUICSSObject;
  export const previewWrapper: ThemeUICSSObject;
  export const preview: ThemeUICSSObject;
  export const buttons: ThemeUICSSObject;
  export const button: ThemeUICSSObject;
  export const link: ThemeUICSSObject;
}
