/** @jsx jsx */
import {
  jsx,
  Text,
  Box,
  Button,
  IntrinsicFlex,
  IntrinsicImage,
  Link,
  TicketFeatures,
  TicketFeaturesDescriptions,
  TicketFeaturesList,
} from '@tishman/components';
import {Article, H} from '@hzdg/sectioning';
import type {FluidObject} from 'gatsby-image';

export interface TicketComparisonCardProps {
  /** A `FluidObject` value, as created with `GatsbyImageSharpFluid`. */
  src: FluidObject;
  /** The alt image text. */
  alt: string;
  /** The ticket or package title. */
  title: string;
  /** A plaintext description of the ticket or package. */
  description?: string;
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
  /**
   * list of features
   */
  ticketFeatures: TicketFeatures;
  /**
   * full list of features
   */
  featureList?: TicketFeaturesDescriptions;
}

/**
 * `TicketComparisonCard` displays details about a Tishman attraction
 * ticket or package in a 'card' format. It can be used as an item
 * in a Carousel, or by itself.
 *
 * @see https://tishman.netlify.app/components/carousel-cards#ticketComparisonCard
 * @see https://tishman.netlify.app/components/carousel
 */
export function TicketComparisonCard({
  src,
  title,
  description,
  price,
  label,
  alt,
  ticketFeatures,
  featureList,
  href,
  ratio = [260 / 434, 323 / 605],
  maxWidth = ['calc(260 / 322 * 100vw)', 320],
}: TicketComparisonCardProps): JSX.Element {
  return (
    <IntrinsicFlex
      as={Article}
      ratio={ratio}
      py={2}
      px={[0, 3]}
      pr={[3, 0]}
      minWidth={[259, 348]}
      maxWidth={maxWidth}
      sx={{
        flexDirection: 'column',
        justifyContent: 'space-between',
        scrollSnapAlign: 'start',
      }}
    >
      <Box>
        <H
          sx={{
            variant: 'styles.h2',
            mb: 4,
            fontFamily: 'headingSecondary',
          }}
        >
          {title}
        </H>
        <IntrinsicImage ratio={[238 / 160, 316 / 212]} fluid={src} alt={alt} />
        {description && (
          <Text variant="smallP" m={2}>
            {description}
          </Text>
        )}
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
            bg: 'accent',
            color: 'text',
            p: 3,
            my: 3,
            '&:hover': {
              bg: 'text',
              color: 'accent',
            },
          }}
        >
          <Text as="span" mx={2}>
            {label}
          </Text>
          <Text as="span" variant="ticketPrice" mx={2}>
            {price}
          </Text>
        </Link>
      ) : (
        <Button disabled py="18px" my={3}>
          {label}
        </Button>
      )}
      {featureList && (
        <TicketFeaturesList
          ticketTitle={title}
          ticketFeatures={ticketFeatures}
          featureList={featureList}
        />
      )}
    </IntrinsicFlex>
  );
}
