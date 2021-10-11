/** @jsx jsx */
import {graphql} from 'gatsby';
import invariant from 'invariant';
import {jsx} from '@tishman/components';
import {Layout} from '~layouts';
import PrivateEventsVenueHeroBlock from '~blocks/PrivateEventsVenueHeroBlock';
import PrivateEventsVenueTabMenuBlock from '~blocks/PrivateEventsVenueTabMenuBlock';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Black',
  pageName: null,
  cta: {to: '/contact/private-events/', label: 'Plan an Event'},
};

export default function TheGalleryPage({
  data,
}: {
  data: GatsbyTypes.sanityGalleryVenueQuery;
}): JSX.Element {
  const {dataJson} = data;

  invariant(dataJson, 'Private Events data is required!');

  return (
    <Layout theme="Rock Center">
      <PrivateEventsVenueHeroBlock
        theme="Rock Center Black"
        title="Private Events at The Gallery"
        backLink={{
          url: '/private-events',
          label: 'Back to Private Events',
        }}
        tabs={dataJson.subNavigationTabs}
        initialHash="#photo-gallery"
      />
      <PrivateEventsVenueTabMenuBlock
        initialHash="#photo-gallery"
        data={data}
      />
    </Layout>
  );
}

export const query = graphql`
  query sanityGalleryVenue {
    meta: privateEventVenuesJson(id: {eq: "the-gallery"}) {
      meta {
        title
        description
      }
      link {
        url
        label
      }
    }
    sanityAttractionEventVenue(
      _id: {eq: "theGalleryVenue"}
      _type: {eq: "attraction.event.venue"}
    ) {
      floorPlan {
        ceilings
        dimensions
        info
        squareFeet
        capacity {
          capacityType
          value
        }
        photo {
          asset {
            fluid {
              ...GatsbySanityImageFluid
            }
          }
          alt
        }
      }
      sampleMenu {
        pdf {
          asset {
            url
          }
        }
        menuPhotos {
          asset {
            fluid {
              ...GatsbySanityImageFluid
            }
          }
          alt
        }
        gallery {
          images {
            alt
            asset {
              fluid {
                ...GatsbySanityImageFluid
              }
            }
            caption
          }
        }
      }
      imageGallery {
        images {
          caption
          asset {
            fluid {
              ...GatsbySanityImageFluid
            }
          }
          alt
        }
      }
      vendor {
        vendorListPdf {
          asset {
            url
          }
        }
        vendorListImages {
          asset {
            fluid {
              ...GatsbySanityImageFluid
            }
          }
          alt
        }
      }
    }
    allSanityAttractionEventVenue {
      nodes {
        floorPlan {
          dimensions
          ceilings
          squareFeet
        }
        id: _id
      }
    }
    dataJson(id: {eq: "private-events"}) {
      capacity {
        title
        capacities {
          label
          value
        }
      }
      subNavigationTabs {
        label
        slug
      }
    }
  }
`;
