/** @jsx jsx */
import {
  jsx,
  Flex,
  IntrinsicImage,
  Box,
  Text,
  Button,
  Link,
  Spacer,
  AddToCalendarButton,
} from '@tishman/components';
import {FluidObject} from 'gatsby-image';
import {useState} from 'react';
import EventDot from '~components/EventDot';
import {H} from '@hzdg/sectioning';

interface EventListItemProps {
  freeEvent: boolean;
  ongoingEvent: boolean;
  category: string;
  title: string;
  formattedStartTime: string;
  formattedEndTime: string;
  formattedEndDate: string;
  startDateTime: string;
  endDateTime: string;
  excerpt: string;
  location: {
    title: string;
  };
  fluid: FluidObject;
  alt: string;
  url: string;
  showAddToCalendar?: boolean;
  eventCTA?: {
    caption?: string;
    url?: string;
  };
}

const EventListItem = ({
  freeEvent,
  ongoingEvent,
  category,
  title,
  startDateTime,
  endDateTime,
  formattedStartTime,
  formattedEndTime,
  formattedEndDate,
  excerpt,
  location,
  fluid,
  alt,
  url,
  showAddToCalendar,
  eventCTA,
}: EventListItemProps): JSX.Element => {
  const [isVisible, toggleVisible] = useState<boolean>(false);

  return (
    <Flex
      sx={{
        justifyContent: 'space-between',
        alignItems: ['stretch', 'center'],
        flexDirection: ['column', 'row'],
      }}
    >
      <Flex
        sx={{
          flex: ['1 1 auto', null, '0 0 50%'],
          justifyContent: 'space-between',
          alignItems: ['flex-start', null, 'center'],
          flexDirection: ['column', null, 'row'],
          ml: [3, 0],
        }}
      >
        <Box mr={[0, 4]}>
          <Text
            variant="categoryEyebrow"
            sx={{
              mb: 2,
              position: 'relative',
            }}
          >
            {ongoingEvent && (
              <EventDot
                type={'ONGOING'}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  left: '-16px',
                }}
              />
            )}
            {freeEvent && (
              <EventDot
                type={'FREE'}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  left: ongoingEvent ? '-22px' : '-16px',
                }}
              />
            )}

            {category}
          </Text>
          <H
            sx={{
              variant: 'text.eventListTitle',
              fontFamily: 'headingSecondary',
              mb: 3,
              overflowWrap: 'break-word',
              wordWrap: 'break-word',
            }}
          >
            {title}
          </H>
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
              {ongoingEvent
                ? `Ongoing until ${formattedEndDate}`
                : `${formattedStartTime}—${formattedEndTime}`}
            </Spacer>
            <Spacer>{location.title}</Spacer>
          </Text>
        </Box>
        <IntrinsicImage
          sx={{width: '100%', flexShrink: 0}}
          minWidth={190}
          maxWidth={328}
          ratio={190 / 270}
          fluid={fluid}
          alt={alt}
        />
      </Flex>
      <Box
        sx={{
          flex: ['1 1 auto', '1 1 450px'],
          my: 4,
          ml: [0, 4, 7],
          mr: 3,
        }}
      >
        <Box ml={[3, 0]}>
          <Button
            variant="text"
            sx={{display: ['block', 'none']}}
            onClick={() => toggleVisible(!isVisible)}
          >
            {isVisible ? 'Hide Details -' : 'See Details +'}
          </Button>
          <Text
            sx={{
              variant: 'smallP',
              mb: 4,
              display: [isVisible ? 'block' : 'none', 'block'],
            }}
          >
            {excerpt}
          </Text>
        </Box>
        <Flex
          sx={{
            flexDirection: ['column', 'row'],
            alignItems: ['flex-start', 'center'],
            flexWrap: 'wrap',
          }}
        >
          {showAddToCalendar && (
            <AddToCalendarButton
              title={title}
              startDateTime={startDateTime}
              endDateTime={endDateTime}
              description={excerpt}
              url={url}
              location={location.title}
              sx={{p: 3, mr: 4, mt: 4}}
            />
          )}
          {eventCTA && eventCTA.caption && eventCTA.url && (
            <Link
              key={eventCTA.caption}
              variant="button"
              href={eventCTA.url}
              sx={{p: 3, mr: 4, mt: [3, 4], border: '1px solid black'}}
            >
              {eventCTA.caption}
            </Link>
          )}
          <Link variant="underline" sx={{mt: [3, 4]}} href={url}>
            See Event Page
          </Link>
        </Flex>
      </Box>
    </Flex>
  );
};

export default EventListItem;
