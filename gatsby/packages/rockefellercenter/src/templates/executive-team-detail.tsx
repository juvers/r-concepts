/** @jsx jsx */
import {jsx} from '@tishman/components';
import {graphql} from 'gatsby';
import {Layout} from '~layouts';
import type {PageConfig} from '~PageConfig';
import ExecutiveCrossLinkBlock from '~blocks/ExecutiveCrossLinkBlock';
import ExecutiveDetailPageBlock from '~blocks/ExecutiveDetailPageBlock';

export const config: PageConfig = {
  theme: 'Rock Center',
  logo: 'Rockefeller Center',
  pageName: null,
  cta: {
    to: '/buy-tickets',
    label: 'Buy Tickets',
  },
};

export default function ExecutiveDetailPage({
  data,
}: {
  data: GatsbyTypes.sanityExecutiveQuery;
}): JSX.Element {
  return (
    <Layout>
      <ExecutiveDetailPageBlock data={data} />
      <ExecutiveCrossLinkBlock theme="Rock Center Cream" />
    </Layout>
  );
}

export const query = graphql`
  query sanityExecutive($sanityID: String!) {
    executive: sanityExecutive(id: {eq: $sanityID}) {
      bio: _rawBio
      title
      name
      image {
        alt
        asset {
          fluid {
            ...GatsbySanityImageFluid
          }
        }
      }
    }
  }
`;
