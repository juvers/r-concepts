/**@jsx jsx */
import {jsx, Section, Container, ImageCallout} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const FILM_PHOTO_IMAGE_CALLOUT_QUERY = graphql`
  query FilmPhotoImageCallout {
    dataJson(id: {eq: "film-photo"}) {
      imageCallout {
        title
        caption
        description
        image {
          src {
            fluid(maxWidth: 1280) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
          alt
        }
        link {
          label
          url
        }
      }
    }
  }
`;

const FilmPhotoImageCalloutBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.FilmPhotoImageCalloutQuery>(
    FILM_PHOTO_IMAGE_CALLOUT_QUERY,
  );

  invariant(dataJson, 'Film Photo JSON data is required!');

  const filmPhotoImageCalloutProps = useMemo(() => {
    return {
      fluid: dataJson.imageCallout.image.src.fluid,
      alt: dataJson.imageCallout.image.alt,
      title: dataJson.imageCallout.title,
      caption: dataJson.imageCallout.caption,
      link: dataJson.imageCallout.link,
      description: dataJson.imageCallout.description,
    };
  }, [dataJson]);

  return (
    <Section {...props}>
      <Container sx={{py: [4, 6]}}>
        <ImageCallout {...filmPhotoImageCalloutProps} />
      </Container>
    </Section>
  );
};

export default FilmPhotoImageCalloutBlock;
