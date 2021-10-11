/** @jsx jsx */
import {
  jsx,
  Section,
  Container,
  Flex,
  Box,
  Text,
  Link,
  FeaturedGallery,
} from '@tishman/components';
import {useStaticQuery, graphql} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {H} from '@hzdg/sectioning';
import invariant from 'invariant';

const ART_AND_HISTORY_FEATURED_GALLERY_QUERY = graphql`
  query ArtandHistoryFeaturedGallery {
    dataJson(id: {eq: "art-and-history"}) {
      artHistoryFeaturedGallery {
        introHeading
        introCopy
        introLinks {
          url
          label
        }
        title
        content {
          category
          caption
          image {
            src {
              fluid(maxWidth: 2272, maxHeight: 976, cropFocus: CENTER) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
            alt
          }
          links {
            url
            label
          }
        }
      }
    }
  }
`;

const ArtandHistoryFeaturedGalleryBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    dataJson,
  } = useStaticQuery<GatsbyTypes.ArtandHistoryFeaturedGalleryQuery>(
    ART_AND_HISTORY_FEATURED_GALLERY_QUERY,
  );

  invariant(dataJson, 'Art & History JSON data is required!');

  const artAndHistoryFeaturedGalleryProps = useMemo(() => {
    return {
      title: dataJson.artHistoryFeaturedGallery.title,
      introHeading: dataJson.artHistoryFeaturedGallery.introHeading,
      introCopy: dataJson.artHistoryFeaturedGallery.introCopy,
      introLinks: dataJson.artHistoryFeaturedGallery.introLinks?.map(
        (link) => link,
      ),
      content: dataJson.artHistoryFeaturedGallery.content.map((data) => ({
        fluid: data.image.src.fluid,
        alt: data.image.alt,
        category: data.category,
        caption: data.caption,
        links: data.links && data.links.map((link) => link),
      })),
    };
  }, [dataJson]);

  const {
    introHeading,
    introCopy,
    introLinks,
  } = artAndHistoryFeaturedGalleryProps;

  return (
    <Section {...props}>
      <Container pt={[3, 4, 6]} pb={4}>
        <Box py={4}>
          <Flex
            sx={{
              flexDirection: ['column', 'row'],
              justifyContent: 'space-evenly',
            }}
          >
            {introHeading && (
              <H
                sx={{
                  variant: 'styles.h1',
                  fontFamily: 'headingSecondary',
                  mb: 3,
                  px: 1,
                  flexBasis: '50%',
                  maxWidth: '475px',
                }}
              >
                {introHeading}
              </H>
            )}
            <Box
              sx={{
                px: 1,
                flexBasis: '50%',
              }}
            >
              <Text
                as="p"
                sx={{
                  fontSize: [2, 4],
                  letterSpacing: [2, 1],
                  opacity: 0.8,
                  ...(introLinks && {mb: 4}),
                }}
              >
                {introCopy}
              </Text>
              {introLinks && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  {introLinks.map((link) => {
                    return (
                      link?.url && (
                        <Link
                          key={link.label}
                          variant="underline"
                          href={link.url}
                          sx={{mr: 3}}
                        >
                          {link.label}
                        </Link>
                      )
                    );
                  })}
                </Box>
              )}
            </Box>
          </Flex>
        </Box>
        <Box sx={{py: 4, px: [0, 0, 0, 0], maxWidth: '1280px'}}>
          <FeaturedGallery
            {...artAndHistoryFeaturedGalleryProps}
            getCategories={() =>
              artAndHistoryFeaturedGalleryProps.content.map(
                ({category}) => category,
              )
            }
            sx={{
              ...{
                'h1, h2, h3, h4, h5, h6': {
                  flex: ['none', '0 0 35%', '0 0 35%'],
                  fontSize: [5, 7, 7],
                },
                '> div[class*="FeaturedGallery"]': {
                  maxWidth: 1300,
                  mx: 'auto',
                },
              },
            }}
          />
        </Box>
      </Container>
    </Section>
  );
};

export default ArtandHistoryFeaturedGalleryBlock;
