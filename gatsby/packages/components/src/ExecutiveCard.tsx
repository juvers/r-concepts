/**@jsx jsx */
import {
  jsx,
  Link,
  IntrinsicImage,
  Text,
  Box,
  SxStyleProp,
} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {FluidObject} from 'gatsby-image';

interface ExecutiveCardProps {
  /** A `FluidObject` value, as created with `GatsbyImageSharpFluid`. */
  fluid: FluidObject;
  /** The alt image text. */
  alt: string;
  /** The card name. */
  name: string;
  /** The card title. */
  title: string;
  /**
   * An optional link, internal or external. If provided, `label` and `url`
   * are used to to label a button that, when pressed, navigates to the `url`.
   */
  link: {
    label: string;
    url: string;
  };
  /** Any overriding styles to change default styling */
  sx?: SxStyleProp;
  /** Some sx props get passed as classNames to components */
  className?: string;
}

export const ExecutiveCard = ({
  fluid,
  name,
  title,
  link,
  alt,
  sx,
  className,
}: ExecutiveCardProps): JSX.Element => {
  return (
    <Box className={className} sx={{maxWidth: 529, ...sx}}>
      <IntrinsicImage fluid={fluid} ratio={[286 / 203, 529 / 360]} alt={alt} />
      <Box sx={{px: [2, 3]}}>
        <H
          sx={{
            variant: 'styles.h2',
            fontFamily: 'headingSecondary',
            letterSpacing: 'normal',
            mt: 4,
          }}
        >
          {name}
        </H>
        <Text sx={{my: 3}}>{title}</Text>
        <Link variant="underline" href={link.url}>
          {link.label}
        </Link>
      </Box>
    </Box>
  );
};
