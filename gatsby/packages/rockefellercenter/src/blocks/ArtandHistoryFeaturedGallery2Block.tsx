/** @jsx jsx */
import {
  jsx,
  Section,
  Container,
  Box,
  FeaturedGallery,
} from '@tishman/components';
import {useStaticQuery, graphql} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const ART_AND_HISTORY_FEATURED_GALLERY2_QUERY = graphql`
  query ArtandHistoryFeaturedGallery2 {
    dataJson(id: {eq: "art-and-history"}) {
      featuredGallery {
        title
        content {
          category
          caption
          image {
            src {
              fluid(maxWidth: 1136, maxHeight: 488, cropFocus: CENTER) {
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

const ArtandHistoryFeaturedGallery2Block = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    dataJson,
  } = useStaticQuery<GatsbyTypes.ArtandHistoryFeaturedGallery2Query>(
    ART_AND_HISTORY_FEATURED_GALLERY2_QUERY,
  );

  invariant(dataJson, 'Art & History JSON data is required');

  const artAndHistoryFeaturedGallery2Props = useMemo(() => {
    return {
      title: dataJson.featuredGallery.title,
      content: dataJson.featuredGallery.content.map((data) => ({
        fluid: data.image.src.fluid,
        alt: data.image.alt,
        category: data.category,
        caption: data.caption,
        links: data.links && data.links.map((link) => link),
      })),
    };
  }, [dataJson]);

  return (
    <Section {...props}>
      <Container pt={[3, 6]} pb={[2, 4]}>
        <Box sx={{py: 4}}>
          <FeaturedGallery
            {...artAndHistoryFeaturedGallery2Props}
            getCategories={() =>
              artAndHistoryFeaturedGallery2Props.content.map(
                ({category}) => category,
              )
            }
            sx={{
              ...{
                'h1, h2, h3, h4, h5, h6': {
                  flex: ['none', '0 0 36%', '0 0 36%'],
                  fontSize: [5, 7, 7],
                  maxWidth: 300,
                },
              },
            }}
          />
        </Box>
      </Container>
    </Section>
  );
};

export default ArtandHistoryFeaturedGallery2Block;
