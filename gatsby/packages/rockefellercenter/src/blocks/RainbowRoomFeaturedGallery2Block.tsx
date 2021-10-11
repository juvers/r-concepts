/**@jsx jsx */
import {jsx, FeaturedGallery, Container, Section} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const RAINBOW_ROOM_FEATURED_GALLERY_2_QUERY = graphql`
  query RainbowRoomFeaturedGallery2 {
    dataJson(id: {eq: "rainbow-room"}) {
      featuredGallery2 {
        title
        content {
          caption
          image {
            src {
              fluid(maxWidth: 1200) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
            alt
          }
          category
          links {
            url
            label
          }
        }
      }
    }
  }
`;

const RainbowRoomFeaturedGallery2Block = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    dataJson,
  } = useStaticQuery<GatsbyTypes.RainbowRoomFeaturedGallery2Query>(
    RAINBOW_ROOM_FEATURED_GALLERY_2_QUERY,
  );

  invariant(dataJson, 'Rainbow Room JSON data is required!');

  const rainbowRoomFeaturedGallery2Props = useMemo(() => {
    return {
      title: dataJson.featuredGallery2.title,
      content: dataJson.featuredGallery2.content.map((data) => ({
        fluid: data.image.src.fluid,
        alt: data.image.alt,
        category: data.category,
        caption: data.caption,
        links: data.links && data.links.map((link) => link),
      })),
    };
  }, [dataJson]);

  return (
    rainbowRoomFeaturedGallery2Props && (
      <Section {...props}>
        <Container sx={{px: [3, 5], py: 4}}>
          <FeaturedGallery
            {...rainbowRoomFeaturedGallery2Props}
            getCategories={() =>
              rainbowRoomFeaturedGallery2Props.content.map(
                ({category}) => category,
              )
            }
          />
        </Container>
      </Section>
    )
  );
};

export default RainbowRoomFeaturedGallery2Block;
