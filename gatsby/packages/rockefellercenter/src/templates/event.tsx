/** @jsx jsx */
import {jsx} from '@tishman/components';
import {graphql} from 'gatsby';
import {Layout} from '~layouts';

import EventHeroBlock from '~blocks/EventHeroBlock';
import EventPodcastBlock from '~blocks/EventPodcastBlock';
import EventSponsorBlock from '~blocks/EventSponsorBlock';
import EventGalleryCarouselBlock from '~blocks/EventGalleryCarouselBlock';
import EventCrossLinkBlock from '~blocks/EventCrossLinkBlock';
import ShareYourExperienceBlock from '~blocks/ShareYourExperienceBlock';
import IconicExperiencesBlock from '~blocks/IconicExperiencesBlock';
import EventCrossLink2Block from '~blocks/EventCrossLink2Block';
import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center',
  pageName: null,
  cta: {to: '/buy-tickets', label: 'Buy Tickets'},
};

const EventTemplate = ({
  data,
}: {
  data: GatsbyTypes.sanityEventQuery;
}): JSX.Element => {
  return (
    <Layout theme="Rock Center">
      <EventHeroBlock data={data} />
      <EventPodcastBlock data={data} />
      <EventSponsorBlock data={data} />
      <EventGalleryCarouselBlock data={data} />
      <ShareYourExperienceBlock
        id="share-your-experience"
        theme="Rock Center Cream"
        hashTags={[
          '#rockefellercenter',
          '#rockcenter',
          '#rockefellerplaza',
          '#topoftherock',
        ]}
        labels={[
          'rockefellercenter',
          'rockcenter',
          'rockefellerplaza',
          'topoftherock',
        ]}
      />
      <EventCrossLinkBlock id="event-cross-link" />
      <IconicExperiencesBlock
        id="iconic-experiences"
        theme="Rock Center Black"
      />
      <EventCrossLink2Block id="event-cross-link-2" />
    </Layout>
  );
};

export const query = graphql`
  query sanityEvent($sanityID: String!) {
    meta: sanityEvent(id: {eq: $sanityID}) {
      seo {
        title: metaTitle
        description: metaDescription
      }
    }
    event: sanityEvent(id: {eq: $sanityID}) {
      id
      titleAndSlug {
        slug {
          current
        }
        title
      }
      admissionType
      category
      excerpt
      startEndDateTime {
        startDateTime
        endDateTime
        formattedStartDateTime: startDateTime(formatString: "MMM D ha")
        formattedEndDateTime: endDateTime(formatString: "MMM D ha")
      }
      location {
        title
        address1
        address2
      }
      photo {
        asset {
          fluid {
            ...GatsbySanityImageFluid
          }
        }
        alt
        caption
      }
      showAddToCalendar
      eventsCTA {
        caption
        url
      }
      _rawBody
      sponsor {
        primary {
          alt
          asset {
            fluid {
              ...GatsbySanityImageFluid
            }
          }
        }
        secondary {
          alt
          asset {
            fluid {
              ...GatsbySanityImageFluid
            }
          }
        }
      }
      podcast {
        titleAndSlug {
          title
          slug {
            current
          }
        }
        authors
        category
        excerpt
        poster {
          alt
          caption
          asset {
            fluid {
              ...GatsbySanityImageFluid
            }
          }
        }
        podcastSource {
          apple
          audible
          spotify
        }
      }
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

export default EventTemplate;
