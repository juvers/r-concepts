/**@jsx jsx */
import {jsx, Section, Container, GalleryCarousel} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import IntroText from '~components/IntroText';
import invariant from 'invariant';

const FILM_PHOTO_HERO_QUERY = graphql`
  query FilmPhotoHero {
    dataJson(id: {eq: "film-photo"}) {
      filmPhotoHero {
        title
        caption
        image {
          src {
            fluid(maxWidth: 1280) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
          alt
        }
      }
    }
  }
`;

const FilmPhotoHeroBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.FilmPhotoHeroQuery>(
    FILM_PHOTO_HERO_QUERY,
  );

  invariant(dataJson, 'Film Photo JSON data is required!');

  const filmPhotoHeroProps = useMemo(() => {
    return {
      title: dataJson.filmPhotoHero.title,
      caption: dataJson.filmPhotoHero.caption,
      fluid: dataJson.filmPhotoHero.image.src.fluid,
      alt: dataJson.filmPhotoHero.image.alt,
    };
  }, [dataJson]);

  return (
    <Section {...props}>
      <Container sx={{py: 4, px: [0, 0, 0], maxWidth: 1280}}>
        <IntroText
          title={filmPhotoHeroProps.title}
          caption={filmPhotoHeroProps.caption}
          desktopOrientation="row"
          center={true}
          sx={{
            ...{
              'h1, h2, h3, h4, h5, h6': {
                fontFamily: 'heading',
                fontSize: [7, 8, 9],
              },
            },
            p: {
              px: 4,
            },
            fontSize: 3,
            mx: 'auto',
            mb: [4, null, 4],
            mt: [0, null, 6],
            px: [3, null, 7],
          }}
        />
        <GalleryCarousel
          cards={[
            {
              fluid: filmPhotoHeroProps.fluid,
              alt: filmPhotoHeroProps.alt,
            },
          ]}
        />
      </Container>
    </Section>
  );
};

export default FilmPhotoHeroBlock;
