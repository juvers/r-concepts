/** @jsx jsx */
import {jsx, Text, Box, Button} from '@tishman/components';
import {Article, H} from '@hzdg/sectioning';
import {IntrinsicFlex} from '~IntrinsicFlex';
import {IntrinsicImage} from '~IntrinsicImage';
import {Link} from '~Link';
import BlockContent from '@sanity/block-content-to-react';

import type {Block} from '@sanity/block-content-to-react';
import type {FluidObject} from 'gatsby-image';

export interface TicketCarouselCardProps {
  /** A `FluidObject` value, as created with `GatsbyImageSharpFluid`. */
  src: FluidObject;
  /** The alt image text. */
  alt?: string;
  /** The ticket or package title. */
  title: string;
  /** A plaintext description of the ticket or package. */
  description?: string | Block | Block[];
  /**
   * An action label for the card. If `href` is provided, this is a button label.
   */
  label?: string;
  /**
   * The price of the ticket or package, formatted in dollars, i.e. '$39'.
   * If no `href` is provided, `price` is ignored.
   */
  price?: string;
  /**
   * An optional link, internal or external. If provided, `label` and `price`
   * are used to to label a button that, when pressed, navigates to the `href`.
   */
  href?: string;
  /**
   * MaxWidth of card
   */
  maxWidth?: Array<string | number> | number | string;
  /**
   * Ratio of card
   */
  ratio?: Array<number> | number;
}

/**
 * `TicketCarouselCard` displays details about a Tishman attraction
 * ticket or package in a 'card' format. It can be used as an item
 * in a Carousel, or by itself.
 *
 * @see https://tishman.netlify.app/components/carousel-cards#ticketcarouselcard
 * @see https://tishman.netlify.app/components/carousel
 */
export function TicketCarouselCard({
  src,
  title,
  description,
  price,
  label,
  alt,
  href,
  ratio = [260 / 434, 323 / 605],
  maxWidth = ['calc(260 / 322 * 100vw)', 320],
}: TicketCarouselCardProps): JSX.Element {
  return (
    <IntrinsicFlex
      as={Article}
      ratio={ratio}
      p={3}
      minWidth={257}
      maxWidth={maxWidth}
      sx={{
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: '1px solid',
        borderColor: 'accent',
      }}
    >
      <Box>
        <IntrinsicImage ratio={[234 / 128, 290 / 262]} fluid={src} alt={alt} />
        <H
          sx={{
            variant: 'styles.h3',
            mx: 2,
            my: 3,
            fontFamily: 'headingSecondary',
          }}
        >
          {title}
        </H>
        <Text variant="smallP" m={2}>
          {typeof description === 'object' ? (
            <BlockContent blocks={description} />
          ) : (
            description
          )}
        </Text>
      </Box>
      {href ? (
        <Link
          href={href}
          variant="button"
          sx={{
            fontWeight: 'regular',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 3,
            px: 2,
          }}
        >
          <Text as="span" variant="ticketButtonLabel">
            {label}
          </Text>
          <Text as="span" variant="ticketPrice" mx={2}>
            {price}
          </Text>
        </Link>
      ) : (
        <Button disabled py="18px">
          {label}
        </Button>
      )}
    </IntrinsicFlex>
  );
}
