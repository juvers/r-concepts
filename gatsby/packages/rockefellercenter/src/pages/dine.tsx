/** @jsx jsx */
import {jsx} from '@tishman/components';
import {Fragment, useMemo} from 'react';
import {graphql} from 'gatsby';
import invariant from 'invariant';
import BusinessDetailWideCtaBlock from '~blocks/BusinessDetailWideCtaBlock';
import BusinessDetailCalloutGridBlock from '~blocks/BusinessDetailCalloutGridBlock';
import BusinessDetailFeaturedStoriesBlock from '~blocks/BusinessDetailFeaturedStoriesBlock';
import BusinessListIntroBlock from '~blocks/BusinessListIntroBlock';
import {BusinessListBlock} from '~blocks/BusinessListBlock';
import {getLocationProps, getSanityFluidImageProps} from '~blocks/utils';
import DineFeaturedEventsBlock from '~blocks/DineFeaturedEventsBlock';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Cream',
  pageName: 'Dining',
  cta: {to: '/buy-tickets', label: 'Buy Tickets'},
};

const DineIndex = ({
  data: {business, dataJson, meta},
}: {
  data: GatsbyTypes.SanityDineIndexQuery;
}): JSX.Element => {
  invariant(dataJson, 'Shops data is required');
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
            url: `/dine/${slug}`,
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
        title={dataJson.dineIntroText.title}
        caption={dataJson.dineIntroText.caption}
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
      <BusinessDetailFeaturedStoriesBlock
        id="business-detail-featured-stories-block"
        theme="Rock Center Green"
      />
      <DineFeaturedEventsBlock
        id="business-detail-featured-events-block"
        theme="Rock Center"
      />
    </Fragment>
  );
};

export const query = graphql`
  query SanityDineIndex {
    dataJson(id: {eq: "business-list"}) {
      dineIntroText {
        caption
        title
      }
    }
    meta: sanityBusinessDirectoryPage(_id: {eq: "dineDirectoryPage"}) {
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
    business: allSanityBusiness(filter: {category: {category: {eq: "dine"}}}) {
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
export default DineIndex;
