/** @jsx jsx */
import {jsx} from '@tishman/components';
import {Fragment, useMemo} from 'react';
import {graphql} from 'gatsby';
import invariant from 'invariant';
import BusinessDetailWideCtaBlock from '~blocks/BusinessDetailWideCtaBlock';
import BusinessDetailCalloutGridBlock from '~blocks/BusinessDetailCalloutGridBlock';
import BusinessListIntroBlock from '~blocks/BusinessListIntroBlock';
import {BusinessListBlock} from '~blocks/BusinessListBlock';
import {getLocationProps, getSanityFluidImageProps} from '~blocks/utils';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Navy',
  pageName: 'Amenities & Services',
  cta: {to: '/buy-tickets', label: 'Buy Tickets'},
};

const AmenityIndex = ({
  data: {business, dataJson, meta},
}: {
  data: GatsbyTypes.sanityAmenityIndexQuery;
}): JSX.Element => {
  invariant(dataJson, 'Amenities data is required');
  const items = useMemo(
    () =>
      business.nodes.map(
        ({id, category, excerpt, location, poster, titleAndSlug}, index) => {
          const slug = titleAndSlug.slug.current;
          invariant(slug, `A business slug is required`);
          return {
            index,
            slug,
            id,
            category,
            excerpt,
            url: `/amenities/${slug}`,
            title: titleAndSlug.title,
            location: getLocationProps(location),
            poster: getSanityFluidImageProps(poster),
          };
        },
      ),
    [business],
  );

  const retailData = meta?.featuredRetailers;
  const featuredRetailerData = useMemo(() => {
    if (!retailData) return undefined;

    return {
      title: retailData.title,
      retailers:
        retailData.retailers && retailData.retailers.length
          ? retailData.retailers
          : undefined,
    };
  }, [retailData]);

  return (
    <Fragment>
      <BusinessListIntroBlock
        title={dataJson.amenityIntroText.title}
        caption={dataJson.amenityIntroText.caption}
        pt={6}
        pb={64}
      />
      <BusinessListBlock
        items={items}
        filterBy={{Type: 'category.subCategory', name: 'title'}}
        groupBy="title"
        cta={config.cta}
        featuredRetailers={featuredRetailerData}
      />
      <BusinessDetailWideCtaBlock
        id="business-detail-wide-cta"
        theme="Rock Center"
      />
      <BusinessDetailCalloutGridBlock
        id="business-detail-callout-grid"
        theme="Rock Center"
      />
    </Fragment>
  );
};

export const query = graphql`
  query sanityAmenityIndex {
    dataJson(id: {eq: "business-list"}) {
      amenityIntroText {
        caption
        title
      }
    }
    meta: sanityBusinessDirectoryPage(_id: {eq: "amenityDirectoryPage"}) {
      seo {
        title: metaTitle
        description: metaDescription
      }
      featuredRetailers {
        title
        retailers {
          eyebrow
          title
          link {
            caption
            url
          }
          poster {
            alt
            asset {
              fluid {
                ...GatsbySanityImageFluid
              }
            }
          }
        }
      }
    }
    business: allSanityBusiness(
      filter: {category: {category: {eq: "amenity"}}}
    ) {
      nodes {
        id
        category {
          category
          subCategory
        }
        contactsInfo {
          value
        }
        excerpt
        location {
          title
          address1
          address2
        }
        poster {
          alt
          asset {
            fluid {
              ...GatsbySanityImageFluid
            }
          }
        }
        titleAndSlug {
          title
          slug {
            current
          }
        }
      }
    }
  }
`;

export default AmenityIndex;
