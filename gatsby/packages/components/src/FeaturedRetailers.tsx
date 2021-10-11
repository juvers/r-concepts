/**@jsx jsx */
import {
  jsx,
  Section,
  Link,
  Container,
  Box,
  Grid,
  Text,
  IntrinsicImage,
} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {FluidObject} from 'gatsby-image';

export interface FeaturedRetailersProps {
  title?: string;
  retailers?: Retailer[];
}

interface Retailer {
  eyebrow: string;
  title: string;
  link: {
    url: string;
    caption: string;
  };
  poster: {
    alt: string;
    asset: {
      fluid: FluidObject;
    };
  };
}

const FeaturedRetailerCard = ({
  eyebrow,
  title,
  link,
  poster,
}: Retailer): JSX.Element => {
  return (
    <Box sx={{maxWidth: 489, width: '100%'}}>
      <IntrinsicImage alt={poster.alt} fluid={poster.asset.fluid} />
      <Text
        variant="eyebrow"
        sx={{
          mt: 4,
          mb: 2,
        }}
      >
        {eyebrow}
      </Text>
      <Text
        sx={{
          variant: 'styles.h3',
          fontFamily: 'headingSecondary',
          letterSpacing: 'normal',
          mb: 3,
        }}
      >
        {title}
      </Text>
      <Link href={link.url} variant="underline">
        {link.caption}
      </Link>
    </Box>
  );
};

export const FeaturedRetailers = ({
  title,
  retailers,
}: FeaturedRetailersProps): JSX.Element => {
  return (
    <Section theme="Rock Center" sx={{pt: 6, mt: 4}}>
      <Container
        sx={{
          borderBottom: '1px solid rgba(178, 178, 178, 0.4)',
          pb: 6,
          px: [3, null, null, null, 0],
        }}
      >
        <H sx={{variant: 'styles.h2', fontFamily: 'headingSecondary'}}>
          {title}
        </H>
        <Grid
          sx={{
            mt: 4,
            pt: 2,
            columnGap: [6, 7, null, null, 9],
            rowGap: 6,
            justifyItems: ['center', 'start'],
            gridTemplateColumns: ['1fr', '1fr 1fr', '1fr 1fr'],
          }}
        >
          {retailers?.length &&
            retailers.map((item) => (
              <FeaturedRetailerCard key={item.title} {...item} />
            ))}
        </Grid>
      </Container>
    </Section>
  );
};
