// @ts-check
import * as React from 'react';
import {App} from '~App';

/** @typedef {import('~App').AppProps} AppProps */

/**
 * @param {import("gatsby").WrapPageElementNodeArgs<Record<string, unknown>, AppProps['pageContext']> & {
 *   element: React.ReactElement
 * }} args
 */
export const wrapPageElement = ({element, props}) => {
  return (
    <React.StrictMode>
      <App {...props}>{element}</App>
    </React.StrictMode>
  );
};

/**
 * @type {string};
 */
// const GA_ID = process.env.GATSBY_GA_ID ?? '';

/**
 * @type {string};
 */
// const GTM_ID = process.env.GATSBY_GTM_ID ?? '';
/**
 * @param {import("gatsby").RenderBodyArgs} args
 */
// export const onRenderBody = ({setPreBodyComponents, setHeadComponents}) => {
//   setHeadComponents([
//     <script
//       key="ga-script"
//       async
//       src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
//     />,
//     <script
//       key="ga-pageview"
//       dangerouslySetInnerHTML={{
//         __html: `
//       window.dataLayer = window.dataLayer || [];
//       function gtag(){dataLayer.push(arguments);}
//       gtag('js', new Date());
//       gtag('config', '${GA_ID}', {
//         'send_page_view': false,
//       });
//     `,
//       }}
//     />,
//     <script
//       key="gtm-script"
//       dangerouslySetInnerHTML={{
//         __html: `
//     (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
//     new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
//     j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
//     'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
//     })(window,document,'script','dataLayer','${GTM_ID}');
//     `,
//       }}
//     />,
//   ]);

//   setPreBodyComponents([
//     <noscript key="gtm-noscript">
//       <iframe
//         title="gtm-noscript"
//         src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
//         height="0"
//         width="0"
//         style={{
//           display: 'none',
//           visibility: 'hidden',
//         }}
//       />
//     </noscript>,
//   ]);
// };
