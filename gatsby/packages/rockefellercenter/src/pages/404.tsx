/** @jsx jsx */
import {jsx} from '@tishman/components';
import {graphql} from 'gatsby';
import {useEffect} from 'react';
import {Layout} from '~layouts';
import type {PageConfig} from '~PageConfig';
import ErrorHeroBlock from '~blocks/ErrorHeroBlock';
import ErrorCrossLinkBlock from '~blocks/ErrorCrossLinkBlock';
import {useLocation} from '@reach/router';
export const config: PageConfig = {
  theme: 'Rock Center',
  logo: 'Rockefeller Center',
  pageName: 'Rockefeller Center',
  cta: {
    to: '/buy-tickets',
    label: 'Buy Tickets',
  },
};

export const query = graphql`
  query ErrorMeta {
    meta: dataJson(id: {eq: "404"}) {
      meta {
        title
        description
      }
    }
  }
`;

export default function ErrorPage(): JSX.Element {
  const location = useLocation();
  useEffect(() => {
    typeof window !== undefined &&
      window.dataLayer &&
      window.dataLayer.push({
        event: 'Page Load Error',
        Step: '404',
        Referrer: document.referrer || null,
        PageName: location.pathname,
        UTC: new Date().toUTCString(),
        Error: 'Page Load Error',
        FromStep: document.referrer || null,
      });
  }, [location.pathname]);

  return (
    <Layout>
      <ErrorHeroBlock id="error-hero" />
      <ErrorCrossLinkBlock id="error-crosslink" theme="Rock Center Cream" />
    </Layout>
  );
}
