/**@jsx jsx */
import {jsx, FeaturedGallery, Container, Section} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const FILM_PHOTO_FEATURED_GALLERY_QUERY = graphql`
  query FilmPhotoFeaturedGallery {
    dataJson(id: {eq: "film-photo"}) {
      featuredGallery {
        title
        content {
          category
          caption
          image {
            src {
              fluid {
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

const FilmPhotoFeaturedGalleryBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.FilmPhotoFeaturedGalleryQuery>(
    FILM_PHOTO_FEATURED_GALLERY_QUERY,
  );

  invariant(dataJson, 'Film Photo JSON data is required!');

  const filmPhotoFeaturedGalleryProps = useMemo(() => {
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
      <Container sx={{px: [3, 4], py: 8}}>
        <FeaturedGallery
          {...filmPhotoFeaturedGalleryProps}
          getCategories={() =>
            filmPhotoFeaturedGalleryProps.content.map(({category}) => category)
          }
        />
      </Container>
    </Section>
  );
};

export default FilmPhotoFeaturedGalleryBlock;
