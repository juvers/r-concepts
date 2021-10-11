/**@jsx jsx */
import {jsx, WideCta, Container, Section} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const FILM_PHOTO_WIDE_CTA_QUERY = graphql`
  query FilmPhotoWideCta {
    dataJson(id: {eq: "film-photo"}) {
      wideCta {
        title
        caption
        link {
          label
          url
        }
      }
    }
  }
`;

const FilmPhotoWideCtaBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.FilmPhotoWideCtaQuery>(
    FILM_PHOTO_WIDE_CTA_QUERY,
  );

  invariant(dataJson, 'Film and Photo JSON data is required!');

  const FilmPhotoWideCtaProps = useMemo(() => {
    return {
      title: dataJson.wideCta.title,
      caption: dataJson.wideCta.caption,
      link: dataJson.wideCta.link,
    };
  }, [dataJson]);

  return (
    <Section {...props}>
      <Container
        sx={{
          pt: 5,
          pb: 4,
          '> [class*="WideCta"] > [class*="WideCta"]': {
            borderColor: 'initial',
          },
          px: [0, 0, 0, 0],
        }}
      >
        <WideCta {...FilmPhotoWideCtaProps} />
      </Container>
    </Section>
  );
};

export default FilmPhotoWideCtaBlock;
