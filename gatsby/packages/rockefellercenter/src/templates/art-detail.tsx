/** @jsx jsx */
import {jsx} from '@tishman/components';
import {graphql} from 'gatsby';
import {Layout} from '~layouts';

import ArtDetailHeroBlock from '~blocks/ArtDetailHeroBlock';
import ArtDetailWideCtaBlock from '~blocks/ArtDetailWideCtaBlock';
import ArtDetailImageCalloutBlock from '~blocks/ArtDetailImageCalloutBlock';
import ArtDetailCalloutGridBlock from '~blocks/ArtDetailCalloutGridBlock';
import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Black',
  pageName: 'Art',
  cta: {to: '/buy-tickets', label: 'Buy Tickets'},
};

const ArtDetailTemplate = ({
  data,
}: {
  data: GatsbyTypes.sanityArtQuery;
}): JSX.Element => {
  return (
    <Layout theme="Rock Center Black" sx={{bg: 'background'}}>
      <ArtDetailHeroBlock data={data} />
      <ArtDetailWideCtaBlock theme="Rock Center" />
      <ArtDetailImageCalloutBlock />
      <ArtDetailCalloutGridBlock theme="Rock Center" />
    </Layout>
  );
};

export const query = graphql`
  query sanityArt($sanityID: String!) {
    meta: sanityArt(id: {eq: $sanityID}) {
      seo {
        title: metaTitle
        description: metaDescription
      }
    }
    art: sanityArt(id: {eq: $sanityID}) {
      id
      titleAndSlug {
        slug {
          current
        }
        title
      }
      category
      excerpt
      location {
        title
        address1
        address2
      }
      authors {
        name
        nationality
        birthYear
        deathYear
        countryOfBirth
      }
      poster {
        alt
        caption
        asset {
          fluid {
            ...GatsbySanityImageFluid
          }
        }
      }
      _rawBody
      imageGallery {
        title
        images {
          asset {
            fluid {
              ...GatsbySanityImageFluid
            }
          }
          caption
          alt
        }
      }
    }
  }
`;

export default ArtDetailTemplate;
