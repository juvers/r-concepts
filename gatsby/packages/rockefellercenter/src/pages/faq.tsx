/** @jsx jsx */
import {Layout} from '~layouts';
import {graphql} from 'gatsby';
import {jsx} from '@tishman/components';
import FaqsBlock from '~blocks/FaqsBlock';
import FaqCrossLinkBlock from '~blocks/FaqCrossLinkBlock';
import FaqIntroBlock from '~blocks/FaqIntroBlock';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  pageName: 'FAQs',
  cta: {to: '/buy-tickets', label: 'Buy Tickets'},
};

export const FaqMetaQuery = graphql`
  query FaqMeta {
    meta: sanityGeneralFaqs {
      seo {
        title: metaTitle
        description: metaDescription
      }
    }
  }
`;

export default function FaqPage(): JSX.Element {
  return (
    <Layout>
      <FaqIntroBlock id="faq-intro" theme="Rock Center" />
      <FaqsBlock id="faq" theme="Rock Center" />
      <FaqCrossLinkBlock id="faq-cross-links" theme="Rock Center Cream" />
    </Layout>
  );
}
