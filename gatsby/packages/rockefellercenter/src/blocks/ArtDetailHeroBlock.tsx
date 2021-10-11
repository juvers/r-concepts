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
  GalleryCarousel,
  Button,
  Section,
  Link,
} from '@tishman/components';
import {useState, useMemo} from 'react';
import {H} from '@hzdg/sectioning';
import type {Block} from '@sanity/block-content-to-react';
import {
  getLocationProps,
  getSanityFluidImageProps,
  getAuthorProps,
} from '~blocks/utils';

const ArtDetailHero = ({
  data,
}: {
  data: GatsbyTypes.sanityArtQuery;
}): JSX.Element => {
  const artDetailHeroProps = useMemo(() => {
    if (!data) throw new Error('Expected art data');
    if (!data.art) throw new Error('Expected valid art data');
    if (!data.art.titleAndSlug?.title)
      throw new Error('Expected valid art title');
    if (!data.art.category) throw new Error('Expected valid art category');
    if (!data.art.excerpt) throw new Error('Expected valid art excerpt');
    if (!data.art._rawBody)
      throw new Error('Expected valid art rich text field');
    const location = getLocationProps(data.art.location);
    const {fluid, alt} = getSanityFluidImageProps(data.art.poster);

    if (!data.art.authors || !data.art.authors.length)
      throw new Error('Expected valid art author(s)');

    const imageGallery =
      data?.art?.imageGallery?.images &&
      data?.art?.imageGallery?.images.map((image) => {
        const fluidImageProps = getSanityFluidImageProps(image);
        return {
          ...fluidImageProps,
          caption: image?.caption,
        };
      });

    const authors = data?.art?.authors.map((author) => {
      const authorProps = getAuthorProps(author);
      return {
        ...authorProps,
      };
    });

    return {
      title: data.art.titleAndSlug.title,
      category: data.art.category,
      excerpt: data.art.excerpt,
      _rawBody: data.art._rawBody,
      location,
      authors: authors,
      fluid,
      alt,
      imageGallery,
    };
  }, [data]);

  let authorName = '';

  let authorDetails = '';

  artDetailHeroProps.authors &&
    artDetailHeroProps.authors.length > 0 &&
    artDetailHeroProps.authors.map((author, index) => {
      authorName +=
        index !== artDetailHeroProps.authors.length - 1
          ? `${author.name}` + ' and '
          : `${author.name}`;
      authorDetails += author?.countryOfBirth
        ? // Check if art author is born in one country
          // and is living / resident of another country

          author?.deathYear
          ? `${author.nationality}, born ${author?.countryOfBirth}. ${author.birthYear} - ${author?.deathYear}`
          : `${author.nationality}, born ${author?.countryOfBirth}. ${author.birthYear} - `
        : author?.deathYear
        ? `${author.nationality}. ${author.birthYear} - ${author?.deathYear}`
        : `${author.nationality}. ${author.birthYear} - `;
      authorDetails +=
        index !== artDetailHeroProps.authors.length - 1 ? ' | ' : '';
    });

  const [isVisible, toggleVisible] = useState<boolean>(false);

  return (
    artDetailHeroProps && (
      <Section bg="background">
        <Container py={[2, 2, 3, 5]} sx={{maxWidth: '1100px'}}>
          <Grid columns={[1, 1, 1, 2]} mb={4}>
            <Box mt={[2, 2, 3, 3]} mr={[0, null, 6]} mb={[3, 2, 1]}>
              <ArrowLink
                label={'Back to Art'}
                href={`/art`}
                reverse={true}
                sx={{mb: [3, 4]}}
              />
              <header>
                <Text variant="categoryEyebrow">
                  {artDetailHeroProps.category}
                </Text>
                <H sx={{variant: 'styles.h1', fontFamily: 'headingSecondary'}}>
                  {artDetailHeroProps.title}
                </H>
                <H
                  sx={{
                    variant: 'styles.h4',
                    fontFamily: 'body',
                    mt: 4,
                    color: 'secondary',
                    lineHeight: [1.5, 1.5, 1.75],
                  }}
                >
                  {authorName}
                </H>
                <H
                  sx={{
                    variant: 'styles.h4',
                    fontFamily: 'body',
                    mb: 4,
                    color: 'secondary',
                    lineHeight: [1.5, 1.5, 1.75],
                  }}
                >
                  {authorDetails}
                </H>
              </header>
              <Text
                variant="body"
                sx={{
                  mt: 2,
                  mb: 3,
                  display: 'flex',
                  flexWrap: 'wrap',
                  color: 'secondary',
                }}
              >
                {artDetailHeroProps.location?.title && (
                  <Spacer>{artDetailHeroProps.location.title}</Spacer>
                )}
              </Text>
              <Button
                sx={{
                  my: [isVisible ? '3' : '4', '3'],
                  display: ['block', 'none'],
                }}
                variant="text"
                onClick={() => toggleVisible(!isVisible)}
              >
                {isVisible ? 'Hide Full Details -' : 'See Full Details +'}
              </Button>
              {artDetailHeroProps._rawBody && (
                <SanityRichText
                  sx={{
                    color: 'secondary',
                    display: [isVisible ? 'block' : 'none', 'block'],
                    py: [isVisible ? '2' : null, null],
                  }}
                  blocks={(artDetailHeroProps._rawBody as unknown) as Block[]}
                />
              )}
            </Box>
            <Box sx={{display: 'grid', alignItems: 'center'}}>
              <IntrinsicImage
                fluid={artDetailHeroProps.fluid}
                alt={artDetailHeroProps.alt}
                minWidth={['none', 300]}
                ratio={[16 / 20, null, 13 / 20]}
              />
            </Box>
          </Grid>
        </Container>
        {artDetailHeroProps?.imageGallery &&
          artDetailHeroProps?.imageGallery.length > 0 && (
            <Container pt={[4, null]} sx={{maxWidth: '1365px'}}>
              <GalleryCarousel cards={artDetailHeroProps.imageGallery} />
              <Box
                sx={{
                  textAlign: 'center',
                  pt: [8, 6, 6],
                  pb: 8,
                  px: [0, null, 6],
                }}
              >
                <Link
                  variant="button"
                  href={`/art`}
                  sx={{
                    background: 'transparent',
                    color: 'currentColor',
                    border: '1px solid',
                  }}
                >
                  See All Art
                </Link>
              </Box>
            </Container>
          )}
      </Section>
    )
  );
};

export default ArtDetailHero;
