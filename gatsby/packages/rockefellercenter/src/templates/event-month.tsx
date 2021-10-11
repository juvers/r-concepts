/** @jsx jsx */
import {
  jsx,
  Section,
  Box,
  Container,
  Flex,
  Text,
  Divider,
  Select,
} from '@tishman/components';
import {Layout} from '~layouts';
import IntroText from '~components/IntroText';
import {graphql} from 'gatsby';
import {useMemo, Fragment, useState} from 'react';
import {H} from '@hzdg/sectioning';
import EventCrossLinkBlock from '~blocks/EventCrossLinkBlock';
import ShareYourExperienceBlock from '~blocks/ShareYourExperienceBlock';
import IconicExperiencesBlock from '~blocks/IconicExperiencesBlock';
import EventCrossLink2Block from '~blocks/EventCrossLink2Block';
import {getEventDetailUri, getSanityFluidImageProps} from '~blocks/utils';
import EventListItem from '~components/EventListItem';
import EventDot from '~components/EventDot';
import EventMonthArrows from '~components/EventMonthArrows';

import differenceInDays from 'date-fns/differenceInDays';
import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Cream',
  pageName: 'Public Events',
  logo: 'Rockefeller Center',
  cta: {to: '/buy-tickets', label: 'Buy Tickets'},
};

interface EventMonthProps {
  data: GatsbyTypes.EventMonthsQuery;
  pageContext: {
    calendar: string[];
    eventMonth: string[];
    month: string;
    year: string;
  };
}

const EventMonthTemplate = ({
  data,
  pageContext,
}: EventMonthProps): JSX.Element => {
  const eventsProps = useMemo(() => {
    if (!data.allSanityEvent?.nodes)
      throw new Error('Expected valid allSanityEvent data');
    if (!data.allSanityEventTreeLighting?.nodes)
      throw new Error('Expected valid allSanityEventTreeLighting data');
    if (!data.allSanityEventVirtual?.nodes)
      throw new Error('Expected valid allSanityEventVirtual data');

    // Combine list of events with special event
    // types. i.e. tree light event
    const mergedEventTypes = [
      ...data.allSanityEvent?.nodes,
      ...data.allSanityEventTreeLighting?.nodes,
      ...data.allSanityEventVirtual?.nodes,
    ];

    const eventsList = mergedEventTypes.map((event, index) => {
      if (!event.titleAndSlug.slug.current)
        throw new Error(`An event slug is required`);
      if (!event.id) throw new Error(`An event id is required`);
      if (!event.titleAndSlug.title)
        throw new Error(`An event title is required`);
      if (!event.category) throw new Error('Expected valid event category');
      if (!event.admissionType)
        throw new Error('Expected valid event admission type');
      // TODO: come up with better way to get freeEvent boolean
      const freeEvent = event.admissionType.toLowerCase().includes('free');
      if (!event.startEndDateTime)
        throw new Error('Expected valid event startEndDateTime object');
      if (!event?.startEndDateTime?.startDateTime)
        throw new Error('Expected valid event startDateTime');
      if (!event?.startEndDateTime?.endDateTime)
        throw new Error('Expected valid event endDateTime');
      // TODO: come up with better way to get ongoingEvent boolean
      const eventDateSpan = differenceInDays(
        new Date(event.startEndDateTime.endDateTime),
        new Date(event.startEndDateTime.startDateTime),
      );
      const ongoingEvent = eventDateSpan > 0;
      if (!event?.startEndDateTime?.formattedStartTime)
        throw new Error('Expected valid event formattedStartTime');
      if (!event?.startEndDateTime?.formattedEndTime)
        throw new Error('Expected valid event formattedEndTime');
      if (!event?.startEndDateTime?.formattedEndDate)
        throw new Error('Expected valid event formattedEndDate');
      if (!event.excerpt) throw new Error('Expected valid event excerpt');
      if (!event.location?.title)
        throw new Error('Expected valid location title');
      const {fluid, alt} = getSanityFluidImageProps(event.photo);
      return {
        id: event.id,
        url: getEventDetailUri(event),
        index: index,
        title: event.titleAndSlug.title,
        category: event.category,
        freeEvent,
        ongoingEvent,
        startDateTime: event.startEndDateTime.startDateTime,
        endDateTime: event.startEndDateTime.endDateTime,
        formattedStartTime: event.startEndDateTime.formattedStartTime,
        formattedEndTime: event.startEndDateTime.formattedEndTime,
        formattedEndDate: event.startEndDateTime.formattedEndDate,
        excerpt: event.excerpt,
        location: event.location,
        fluid,
        alt,
        showAddToCalendar: event.showAddToCalendar,
        eventCTA: event.eventsCTA,
      };
    });

    const eventLocations = new Set();
    eventsList.forEach((item) => eventLocations.add(item.location.title));

    const eventTypes = new Set();
    eventsList.forEach((item) => eventTypes.add(item.category));

    if (!data.dataJson) throw new Error('Events JSON data is required!');

    return {
      caption: data.dataJson.intro,
      eventsList: eventsList,
      eventLocations: [...eventLocations],
      eventTypes: [...eventTypes],
    };
  }, [data]);

  const [eventLocationFilter, setEventLocationFilter] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('');

  const filteredEvents = eventsProps.eventsList.filter((event) => {
    return (
      (event.location.title.trim() == eventLocationFilter ||
        eventLocationFilter == '') &&
      (event.category.trim() == eventTypeFilter || eventTypeFilter == '')
    );
  });

  return (
    <Layout theme="Rock Center Cream">
      <Section bg="background">
        <Container>
          <IntroText
            center
            caption={eventsProps.caption}
            maxWidth={1100}
            sx={{my: [3, 4]}}
          />
          <Flex sx={{alignItems: 'center', justifyContent: 'space-between'}}>
            <H
              sx={{
                variant: 'text.heroTitle',
                fontFamily: 'headingSecondary',
                textTransform: 'capitalize',
              }}
            >
              {`${pageContext.month} ${pageContext.year}`}
            </H>
            <EventMonthArrows {...pageContext} />
          </Flex>
          <Flex
            sx={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              my: 4,
            }}
          >
            <Box sx={{maxWidth: 250, width: '100%', mr: 5}}>
              <Select
                name="eventType"
                defaultValue={''}
                onChange={(e) => {
                  e.preventDefault();
                  setEventTypeFilter(e.target.value.trim());
                }}
              >
                <option disabled value="">
                  Event Type
                </option>
                <option value="">All Types</option>
                {eventsProps.eventTypes.map((item, index) => {
                  return (
                    <option key={index} value={`${item}`}>{`${item}`}</option>
                  );
                })}
              </Select>
            </Box>
            <Box sx={{maxWidth: 250, width: '100%', mr: 5}}>
              <Select
                name="eventLocation"
                defaultValue={''}
                onChange={(e) => {
                  e.preventDefault();
                  setEventLocationFilter(e.target.value.trim());
                }}
              >
                <option disabled value="">
                  Event Location
                </option>
                <option value="">All Locations</option>
                {eventsProps.eventLocations.map((item, index) => {
                  return (
                    <option key={index} value={`${item}`}>{`${item}`}</option>
                  );
                })}
              </Select>
            </Box>
            <Box sx={{display: ['none', null, 'flex']}}>
              <Text variant="copyright" sx={{position: 'relative', ml: 4}}>
                <EventDot type={'FREE'} /> = Free Event
              </Text>
              <Text variant="copyright" sx={{position: 'relative', ml: 4}}>
                <EventDot type={'ONGOING'} /> = Ongoing Event
              </Text>
            </Box>
          </Flex>
        </Container>
      </Section>
      <Section theme="Rock Center" bg="background">
        <Container pt={6}>
          <ul>
            {filteredEvents.map((event, index) => {
              return (
                <Fragment key={event.id}>
                  <EventListItem {...event} />
                  {index != filteredEvents.length - 1 && (
                    // don't add divider to last item
                    <Divider sx={{my: 6}} />
                  )}
                </Fragment>
              );
            })}
          </ul>
        </Container>
        <Divider sx={{mt: 6, mb: 0}} />
      </Section>
      <EventCrossLinkBlock id="events-cross-link" theme="Rock Center" />
      <IconicExperiencesBlock
        id="events-iconic-experiences"
        theme="Rock Center Black"
      />
      <EventCrossLink2Block id="events-cross-link-2" theme="Rock Center" />
      <ShareYourExperienceBlock
        id="events-share-your-experience"
        theme="Rock Center Cream"
        hashTags={['#RockCenter', '#TopoftheRock', '#RainbowRoom']}
        labels={['rockcenter', 'topoftherock', 'rainbowroom']}
      />
    </Layout>
  );
};

export const query = graphql`
  query EventMonths($eventMonth: [String!]) {
    meta: sanityEventLp {
      seo {
        title: metaTitle
        description: metaDescription
      }
    }
    allSanityEvent(filter: {eventMonths: {in: $eventMonth}}) {
      nodes {
        id
        type: _type
        titleAndSlug {
          slug {
            current
          }
          title
        }
        admissionType
        category
        startEndDateTime {
          startDateTime
          endDateTime
          formattedStartTime: startDateTime(formatString: "ha")
          formattedEndTime: endDateTime(formatString: "ha")
          formattedEndDate: endDateTime(formatString: "MM.DD.yyyy")
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
        excerpt
        showAddToCalendar
        eventsCTA {
          caption
          url
        }
      }
    }
    allSanityEventTreeLighting(filter: {eventMonths: {in: $eventMonth}}) {
      nodes {
        id
        type: _type
        titleAndSlug {
          slug {
            current
          }
          title
        }
        admissionType
        category
        startEndDateTime {
          startDateTime
          endDateTime
          formattedStartTime: startDateTime(formatString: "ha")
          formattedEndTime: endDateTime(formatString: "ha")
          formattedEndDate: endDateTime(formatString: "MM.DD.yyyy")
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
        excerpt
        showAddToCalendar
        eventsCTA {
          caption
          url
        }
      }
    }

    allSanityEventVirtual(filter: {eventMonths: {in: $eventMonth}}) {
      nodes {
        id
        type: _type
        titleAndSlug {
          slug {
            current
          }
          title
        }
        admissionType
        category
        startEndDateTime {
          startDateTime
          endDateTime
          formattedStartTime: startDateTime(formatString: "ha")
          formattedEndTime: endDateTime(formatString: "ha")
          formattedEndDate: endDateTime(formatString: "MM.DD.yyyy")
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
        excerpt
        showAddToCalendar
        eventsCTA {
          caption
          url
        }
      }
    }

    dataJson(id: {eq: "event"}) {
      intro
    }
  }
`;

export default EventMonthTemplate;
