/**@jsx jsx */
import {jsx, ImageCallout, Container, AnchorSection} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const RADIO_CITY_MUSIC_HALL_IMAGE_CALLOUT_QUERY = graphql`
  query RadioCityMusicHallImageCallout {
    dataJson(id: {eq: "radio-city-music-hall"}) {
      imageCallout {
        title
        caption
        description
        image {
          src {
            fluid(maxWidth: 700) {
              ...GatsbyImageSharpFluid
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

const RadioCityMusicHallImageCalloutBlock = (
  props: ComponentPropsWithoutRef<typeof AnchorSection>,
): JSX.Element => {
  const {
    dataJson,
  } = useStaticQuery<GatsbyTypes.RadioCityMusicHallImageCalloutQuery>(
    RADIO_CITY_MUSIC_HALL_IMAGE_CALLOUT_QUERY,
  );

  invariant(dataJson, 'RadioCityMusicHall JSON data is required!');

  const radioCityMusicHallImageCalloutProps = useMemo(() => {
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
    radioCityMusicHallImageCalloutProps && (
      <AnchorSection {...props} sx={{py: 8}}>
        <Container>
          <ImageCallout {...radioCityMusicHallImageCalloutProps} />
        </Container>
      </AnchorSection>
    )
  );
};

export default RadioCityMusicHallImageCalloutBlock;
