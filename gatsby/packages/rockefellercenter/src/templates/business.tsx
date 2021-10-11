/** @jsx jsx */
import {jsx} from '@tishman/components';
import {graphql} from 'gatsby';
import {Layout} from '~layouts';
import BusinessDetailWideCtaBlock from '~blocks/BusinessDetailWideCtaBlock';
import BusinessDetailCalloutGridBlock from '~blocks/BusinessDetailCalloutGridBlock';
import BusinessDetailFeaturedStoriesBlock from '~blocks/BusinessDetailFeaturedStoriesBlock';
import BusinessDetailHeroBlock from '~blocks/BusinessDetailHeroBlock';
import BusinessDetailGalleryCarouselBlock from '~blocks/BusinessDetailGalleryCarouselBlock';

const BusinessTemplate = ({
  data,
}: {
  data: GatsbyTypes.sanityBusinessQuery;
}): JSX.Element => {
  return (
    <Layout>
      <BusinessDetailHeroBlock data={data} />
      <BusinessDetailGalleryCarouselBlock data={data} />
      <BusinessDetailWideCtaBlock
        id="business-detail-wide-cta"
        theme="Rock Center"
      />
      <BusinessDetailCalloutGridBlock
        id="business-detail-callout-grid"
        theme="Rock Center"
      />
      <BusinessDetailFeaturedStoriesBlock
        id="atlas"
        theme="Rock Center Green"
      />
    </Layout>
  );
};

export const query = graphql`
  query sanityBusiness($sanityID: String!) {
    meta: sanityBusiness(id: {eq: $sanityID}) {
      seo {
        title: metaTitle
        description: metaDescription
      }
    }
    business: sanityBusiness(id: {eq: $sanityID}) {
      id
      _rawBody
      titleAndSlug {
        title
        slug {
          current
        }
      }
      poster {
        caption
        alt
        asset {
          fluid {
            ...GatsbySanityImageFluid
          }
        }
      }
      imageGallery {
        images {
          asset {
            fluid {
              ...GatsbySanityImageFluid
            }
          }
          alt
        }
      }
      hours {
        opensAt
        day
        closesAt
      }
      location {
        title
        address1
        address2
      }
      contactsInfo {
        type
        value
      }
      orderNow {
        caption
        url
      }
      reservation {
        url
        type
      }
      category {
        category
      }
      website {
        url
        caption
      }
    }
  }
`;

export default BusinessTemplate;
