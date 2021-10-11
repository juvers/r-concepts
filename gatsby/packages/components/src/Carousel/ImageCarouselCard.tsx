/** @jsx jsx */
import {jsx, Text, Box, SxStyleProp} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {IntrinsicImage} from '~IntrinsicImage';
import {Link} from '~Link';

import type {FluidObject} from 'gatsby-image';

export interface ImageCarouselCardProps {
  /** A `FluidObject` value, as created with `GatsbyImageSharpFluid`. */
  fluid: FluidObject;
  /** The alt image text. */
  alt: string;
  /** The card title. */
  title: string;
  /** A plaintext description. */
  description: string;
  /**
   * An optional link, internal or external. If provided, `label` and `price`
   * are used to to label a button that, when pressed, navigates to the `href`.
   */
  href?: string;
  /**
   * Ratio of card image height to width.
   */
  ratio?: Array<number> | number;
  /**
   * ThemeUI style object
   */
  sx?: SxStyleProp;
  /**  A unique id. Helpful when updating the carousel cards */
  id?: string | number;
}

const CardContent = ({
  fluid,
  title,
  description,
  alt,
  ratio,
}: {
  fluid: FluidObject;
  title: string;
  description: string;
  alt: string;
  ratio: Array<number> | number;
}) => (
  <Box>
    <IntrinsicImage fluid={fluid} ratio={ratio} alt={alt} />
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
      {description}
    </Text>
  </Box>
);

/**
 * `ImageCarouselCard` is a generic card that contains an image, a title,
 * a desription and an optional link.
 *
 * @see https://tishman.netlify.app/components/carousel-cards#imagecarouselcard
 * @see https://tishman.netlify.app/components/carousel
 */
export function ImageCarouselCard({
  fluid,
  title,
  description,
  href,
  alt,
  sx = {
    width: '100vw',
    maxWidth: '276px',
  },
  ratio = 0.7,
}: ImageCarouselCardProps): JSX.Element {
  return (
    <div
      sx={{
        flexDirection: 'column',
        justifyContent: 'space-between',
        ...sx,
      }}
    >
      {href ? (
        <Link
          href={href}
          sx={{
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <CardContent
            fluid={fluid}
            title={title}
            description={description}
            alt={alt}
            ratio={ratio}
          />
        </Link>
      ) : (
        <CardContent
          fluid={fluid}
          title={title}
          description={description}
          alt={alt}
          ratio={ratio}
        />
      )}
    </div>
  );
}
