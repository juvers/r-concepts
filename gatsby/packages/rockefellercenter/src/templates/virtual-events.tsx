/** @jsx jsx */
import {jsx, SecondaryMenuBar} from '@tishman/components';
import {graphql} from 'gatsby';
import {useMemo} from 'react';
import VirtualEventHeroBlock from '~blocks/VirtualEventHeroBlock';
import VirtualEventFaqBlock from '~blocks/VirtualEventFaqBlock';
import VirtualEventPreRecordedBlock from '~blocks/VirtualEventPreRecordedBlock';
import VirtualEventListBlock from '~blocks/VirtualEventListBlock';
import EventCrossLink2Block from '~blocks/EventCrossLink2Block';
import {Layout} from '~layouts';
import type {PageConfig} from '~PageConfig';
import invariant from 'invariant';

export const config: PageConfig = {
  pageName: null,
};

const VirtualEvent = ({
  data,
}: {
  data: GatsbyTypes.SanityEventVirtualQuery;
}): JSX.Element => {
  const {virtualEvent} = data;
  invariant(virtualEvent, `No virtual event data found`);

  const subnavLinks = useMemo(() => {
    if (!virtualEvent.subnavItems) return [];
    return virtualEvent.subnavItems.reduce(
      (final: {url: string; label: string}[], item) => {
        if (!item) return final;
        const id =
          item && item.slug && item.slug.current
            ? item.slug.current.replace('#', '')
            : '';
        return [
          ...final,
          {
            url: `#${id}`,
            label: item.label,
          },
        ];
      },
      [],
    );
  }, [virtualEvent.subnavItems]);

  return (
    <Layout theme="Rock Center">
      {subnavLinks && subnavLinks.length && (
        <SecondaryMenuBar
          sticky
          threshold={0.5}
          title={`Explore ${virtualEvent.titleAndSlug.title}`}
          links={subnavLinks ? subnavLinks : []}
        />
      )}
      <VirtualEventHeroBlock data={data} />
      <VirtualEventListBlock data={data} theme="Rock Center" />
      {((virtualEvent.recordedContent?.items as unknown) as Array<unknown>)
        .length > 0 && (
        <VirtualEventPreRecordedBlock data={data} theme="Rock Center Cream" />
      )}
      {((virtualEvent._rawFaqs as unknown) as Array<unknown>).length > 0 && (
        <VirtualEventFaqBlock id="faqs" data={data} />
      )}
      <EventCrossLink2Block id="event-cross-link-2" />
    </Layout>
  );
};

export const query = graphql`
  query SanityEventVirtual($sanityID: String!) {
    virtualEvent: sanityEventVirtual(id: {eq: $sanityID}) {
      id
      recordedContent {
        title
        items {
          title
          subTitle
          link {
            url
          }
        }
      }
      subnavItems {
        label
        slug {
          current
        }
        targetSection
      }
      titleAndSlug {
        title
      }
      alert {
        title
        description
        link {
          url
          caption
        }
        type
      }
      excerpt
      liveEvents {
        title
        subTitle
        items {
          title
          subTitle
          moreInfo
          link {
            url
            caption
          }
          poster {
            asset {
              fluid {
                ...GatsbySanityImageFluid
              }
            }
          }
        }
      }

      startEndDateTime {
        startDateTime
        endDateTime
      }
      _rawBody
      photo {
        __typename
        asset {
          fluid(maxWidth: 1600) {
            ...GatsbySanityImageFluid
          }
        }
        alt
        caption
      }

      imageGallery {
        title
        images {
          __typename
          asset {
            fluid(maxWidth: 1600) {
              ...GatsbySanityImageFluid
            }
          }
          caption
          alt
        }
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
      _rawFaqs
      hour {
        hours {
          day
          opensAt
          closesAt
        }
        hourText
      }
      admissionType

      featuredStories {
        titleAndSlug {
          slug {
            current
          }
          title
        }
        category
        excerpt

        formattedPublishAt: publishAt(formatString: "MMM D YYYY")
        poster {
          alt
          asset {
            fluid {
              ...GatsbySanityImageFluid
            }
          }
        }
      }
      showAddToCalendar
      eventsCTA {
        caption
        url
      }
    }
  }
`;

export default VirtualEvent;
