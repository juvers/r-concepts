/** @jsx jsx */
import {
  jsx,
  Text,
  Box,
  IntrinsicFlex,
  IntrinsicImage,
  Link,
  Spacer,
} from '@tishman/components';
import {stripTimeFromDates} from '../stripTimeFromDates';
import {Article, H} from '@hzdg/sectioning';
import type {FluidObject} from 'gatsby-image';

export interface EventCarouselCardProps {
  /** A `FluidObject` value, as created with `GatsbyImageSharpFluid`. */
  fluid: FluidObject;
  /** The event tag, i.e., 'Culture'. */
  category: string;
  /** The event title. */
  title: string;
  /** The event date. Could be any string, i.e., 'April 8'.  */
  formattedStartDateTime: string;
  /** An optional event time. Could be any string, i.e., '2pm'. */
  time?: string;
  /** The event location. Could be any string, i.e., 'Top of the Rock'. */
  location: {
    title: string;
  };
  /** The link to the event detail page. */
  url: string;
  /**  A unique id. Helpful when updating the carousel cards */
  id?: string | number;
}

export function EventCarouselCard({
  fluid,
  category,
  title,
  formattedStartDateTime,
  time,
  location,
  url,
}: EventCarouselCardProps): JSX.Element {
  return (
    <IntrinsicFlex
      as={Article}
      ratio={276 / 540}
      sx={{flexDirection: 'column', width: 276}}
    >
      <IntrinsicImage ratio={276 / 388} fluid={fluid} />
      <Box mx={1} mt={3}>
        <Text variant="eyebrow" my={2}>
          {category}
        </Text>
        <Link variant="card" href={url}>
          <H>{title}</H>
        </Link>
        <Text
          variant="eyebrow"
          sx={{mt: 2, display: 'flex', fontWeight: 'light'}}
        >
          <Spacer>{stripTimeFromDates(formattedStartDateTime)}</Spacer>
          {time ? <Spacer>{time}</Spacer> : null}
          <Spacer>{location.title}</Spacer>
        </Text>
      </Box>
    </IntrinsicFlex>
  );
}
