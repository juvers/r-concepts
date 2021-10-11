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
 * @type {string | undefined};
 */
// const GA_ID = process.env.GATSBY_GA_ID;

/**
 * @param {import("gatsby").RouteUpdateArgs & {prevLocation: Location}} args
 */
// export const onRouteUpdate = ({location, prevLocation}) => {
//   const titleTag = document.querySelector('title');
//   window.gtag &&
//     window.gtag('config', GA_ID, {
//       page_path: location.pathname,
//       page_title: titleTag ? titleTag.innerText : null,
//       location: window.location.href,
//     });
//   //Custom route change event
//   if (window.dataLayer) {
//     window.dataLayer.push({
//       event: 'route-change',
//       from: prevLocation ? prevLocation.pathname : null,
//       to: location ? location.pathname : null,
//     });
//   }
// };
