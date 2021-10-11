/**@jsx jsx */
import {
  jsx,
  FeaturedGallery,
  Container,
  AnchorSection,
} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const TOR_FEATURED_GALLERY_QUERY = graphql`
  query TorFeaturedGallery {
    dataJson(id: {eq: "top-of-the-rock-observation-deck"}) {
      featuredGallery {
        title
        content {
          caption
          category
          image {
            src {
              fluid(maxWidth: 1200) {
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

const TorFeaturedGalleryBlock = (
  props: ComponentPropsWithoutRef<typeof AnchorSection>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.TorFeaturedGalleryQuery>(
    TOR_FEATURED_GALLERY_QUERY,
  );

  invariant(dataJson, 'Tor JSON data is required!');

  const torFeaturedGalleryProps = useMemo(() => {
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
    torFeaturedGalleryProps && (
      <AnchorSection {...props}>
        <Container sx={{px: [3, 5], py: 4}}>
          <FeaturedGallery
            {...torFeaturedGalleryProps}
            getCategories={() =>
              torFeaturedGalleryProps.content.map(({category}) => category)
            }
          />
        </Container>
      </AnchorSection>
    )
  );
};

export default TorFeaturedGalleryBlock;
