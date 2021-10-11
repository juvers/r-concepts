/** @jsx jsx */
import {
  jsx,
  Container,
  Grid,
  Box,
  Text,
  IntrinsicImage,
  ArrowLink,
  Spacer,
  SanityRichText,
  AddToCalendarButton,
  Link,
  Flex,
} from '@tishman/components';
import {stripTimeFromDates} from '../../../components/src/stripTimeFromDates';
import {useMemo} from 'react';
import {useLocation} from '@reach/router';
import {H} from '@hzdg/sectioning';
import type {Block} from '@sanity/block-content-to-react';
import {getSanityFluidImageProps, getLocationProps} from '~blocks/utils';
import {eventComponents} from '~components/EventComponents';

const EventDetailHero = ({
  data,
}: {
  data: GatsbyTypes.sanityEventQuery;
}): JSX.Element => {
  const eventHeroProps = useMemo(() => {
    if (!data) throw new Error('Expected event data');
    if (!data.event) throw new Error('Expected valid event data');
    if (!data.event.titleAndSlug?.title)
      throw new Error('Expected valid event title');
    if (!data.event.category) throw new Error('Expected valid event category');
    if (!data.event.admissionType)
      throw new Error('Expected valid event admission type');
    if (!data.event.excerpt) throw new Error('Expected valid event excerpt');
    if (!data.event.startEndDateTime)
      throw new Error('Expected valid event startEndDateTime object');
    if (!data.event.startEndDateTime.startDateTime)
      throw new Error('Expected valid event startDateTime');
    if (!data.event.startEndDateTime.endDateTime)
      throw new Error('Expected valid event endDateTime');
    if (!data.event.startEndDateTime.formattedStartDateTime)
      throw new Error('Expected valid event formattedStartDateTime');
    if (!data.event.startEndDateTime.formattedEndDateTime)
      throw new Error('Expected valid event formattedEndDateTime');
    if (!data.event._rawBody)
      throw new Error('Expected valid event rich text field');
    const location = getLocationProps(data.event.location);
    const {fluid, alt} = getSanityFluidImageProps(data.event.photo);
    return {
      title: data.event.titleAndSlug.title,
      category: data.event.category,
      admissionType: data.event.admissionType,
      excerpt: data.event.excerpt,
      startDateTime: data.event.startEndDateTime.startDateTime,
      endDateTime: data.event.startEndDateTime.endDateTime,
      formattedStartDateTime:
        data.event.startEndDateTime.formattedStartDateTime,

      /*
        new Date(data?.event?.startEndDateTime.startDateTime) < new Date()
          ? 'Today?'
          : data.event.startEndDateTime.formattedStartDateTime,
      */
      formattedEndDateTime: data.event.startEndDateTime.formattedEndDateTime,
      _rawBody: data.event._rawBody,
      location,
      fluid,
      alt,
      showAddToCalendar: data.event.showAddToCalendar,
      eventCTA: data.event.eventsCTA,
    };
  }, [data]);

  const url = useLocation().href;

  return (
    eventHeroProps && (
      <Container>
        <Grid columns={[1, null, 2]} mb={4}>
          <Box mt={5} mr={[0, null, 6]}>
            <ArrowLink
              label={'Back to Event Calendar'}
              href={`/events`}
              reverse={true}
              sx={{mb: 4}}
            />
            <header>
              <Text variant="categoryEyebrow">{eventHeroProps.category}</Text>
              <H sx={{variant: 'styles.h1', fontFamily: 'headingSecondary'}}>
                {eventHeroProps.title}
              </H>
            </header>
            <Text
              variant="eyebrow"
              sx={{
                mt: 2,
                mb: 3,
                display: 'flex',
                flexWrap: 'wrap',
                fontWeight: 'light',
              }}
            >
              <Spacer>
                {stripTimeFromDates(eventHeroProps.formattedStartDateTime)}—
                {stripTimeFromDates(eventHeroProps.formattedEndDateTime)}
              </Spacer>
              {eventHeroProps.location?.title && (
                <Spacer>{eventHeroProps.location.title}</Spacer>
              )}
              <Spacer>{eventHeroProps.admissionType}</Spacer>
            </Text>
            {eventHeroProps._rawBody && (
              <SanityRichText
                blocks={(eventHeroProps._rawBody as unknown) as Block[]}
                components={eventComponents}
              />
            )}
            <Flex
              sx={{
                flexDirection: ['column', 'row'],
                alignItems: ['flex-start', 'center'],
                flexWrap: 'wrap',
                mb: [2, 4],
              }}
            >
              {eventHeroProps.showAddToCalendar && (
                <AddToCalendarButton
                  {...eventHeroProps}
                  url={url}
                  description={eventHeroProps.excerpt}
                  location={eventHeroProps.location?.address1}
                  sx={{mr: 4, mt: 4}}
                />
              )}
              {eventHeroProps.eventCTA &&
                eventHeroProps.eventCTA.caption &&
                eventHeroProps.eventCTA.url && (
                  <Link
                    key={eventHeroProps.eventCTA.caption}
                    variant="button"
                    href={eventHeroProps.eventCTA.url}
                    sx={{
                      mr: 4,
                      mt: [3, 4],
                      border: '1px solid black',
                    }}
                  >
                    {eventHeroProps.eventCTA.caption}
                  </Link>
                )}
            </Flex>
          </Box>
          <Box>
            <IntrinsicImage
              fluid={eventHeroProps.fluid}
              alt={eventHeroProps.alt}
              minWidth={300}
              ratio={540 / 760}
            />
          </Box>
        </Grid>
      </Container>
    )
  );
};

export default EventDetailHero;
