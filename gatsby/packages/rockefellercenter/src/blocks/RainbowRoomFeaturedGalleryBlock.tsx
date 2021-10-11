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

const RAINBOW_ROOM_FEATURED_GALLERY_QUERY = graphql`
  query RainbowRoomFeaturedGallery {
    dataJson(id: {eq: "rainbow-room"}) {
      featuredGallery {
        title
        content {
          category
          caption
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

const RainbowRoomFeaturedGalleryBlock = (
  props: ComponentPropsWithoutRef<typeof AnchorSection>,
): JSX.Element => {
  const {
    dataJson,
  } = useStaticQuery<GatsbyTypes.RainbowRoomFeaturedGalleryQuery>(
    RAINBOW_ROOM_FEATURED_GALLERY_QUERY,
  );

  invariant(dataJson, 'Rainbow Room JSON data is required!');

  const rainbowRoomFeaturedGalleryProps = useMemo(() => {
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
    rainbowRoomFeaturedGalleryProps && (
      <AnchorSection {...props}>
        <Container sx={{px: [3, 5], py: 5}}>
          <FeaturedGallery
            {...rainbowRoomFeaturedGalleryProps}
            getCategories={() =>
              rainbowRoomFeaturedGalleryProps.content.map(
                ({category}) => category,
              )
            }
          />
        </Container>
      </AnchorSection>
    )
  );
};

export default RainbowRoomFeaturedGalleryBlock;
