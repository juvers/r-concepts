/** @jsx jsx */
import {jsx, Text, Box, SxStyleProp} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {IntrinsicImage} from '~IntrinsicImage';
import {Link} from '~Link';

import type {FluidObject} from 'gatsby-image';

export interface DetailImageCarouselCardProps {
  /** A `FluidObject` value, as created with `GatsbyImageSharpFluid`. */
  fluid: FluidObject;
  /** The alt image text. */
  alt: string;
  /** The card title. */
  title: string;
  /** A plaintext description. */
  description?: string;
  /**
   * An optional link, internal or external. If provided, `label` and `url`
   * are used to to label a button that, when pressed, navigates to the `url`.
   */
  link: {
    url?: string;
    label?: string;
  };
  /**
   * An optional link, internal or external. make the entire card a
   * clickable link
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
  link,
  description,
  alt,
  ratio,
}: {
  fluid: FluidObject;
  title: string;
  link: {
    url?: string;
    label?: string;
  };
  description?: string;
  alt: string;
  ratio: Array<number> | number;
}) => (
  <Box>
    <IntrinsicImage fluid={fluid} ratio={ratio} alt={alt} />
    <Box sx={{mx: 2}}>
      <H
        sx={{
          variant: 'styles.h3',
          fontSize: 5,
          my: 3,
          fontFamily: 'headingSecondary',
        }}
      >
        {title}
      </H>
      {description && (
        <Text variant="smallP" my={2}>
          {description}
        </Text>
      )}
      {link && (
        <Link href={link.url || ''} variant="underline">
          {link.label || 'Explore'}
        </Link>
      )}
    </Box>
  </Box>
);

/**
 * `DetailImageCarouselCard` is a generic card that contains an image, a title,
 * a description and an optional link.
 *
 * @see https://tishman.netlify.app/components/carousel-cards#detailimagecarouselcard
 * @see https://tishman.netlify.app/components/carousel
 */
export function DetailImageCarouselCard({
  fluid,
  title,
  description,
  href,
  link,
  alt,
  sx = {
    width: '100vw',
    maxWidth: '276px',
  },
  ratio = 0.7,
}: DetailImageCarouselCardProps): JSX.Element {
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
            link={link}
            description={description}
            alt={alt}
            ratio={ratio}
          />
        </Link>
      ) : (
        <CardContent
          fluid={fluid}
          title={title}
          link={link}
          description={description}
          alt={alt}
          ratio={ratio}
        />
      )}
    </div>
  );
}
