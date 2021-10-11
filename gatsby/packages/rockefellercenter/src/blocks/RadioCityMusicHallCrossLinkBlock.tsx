/** @jsx jsx */
import {jsx, Flex, Section, Container, CrossLink} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const RADIO_CITY_MUSIC_HALL_CROSS_LINK_QUERY = graphql`
  query RadioCityMusicHallCrossLink {
    dataJson(id: {eq: "radio-city-music-hall"}) {
      crossLinks {
        title
        caption
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

const RadioCityMusicHallCrossLinkBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    dataJson,
  } = useStaticQuery<GatsbyTypes.RadioCityMusicHallCrossLinkQuery>(
    RADIO_CITY_MUSIC_HALL_CROSS_LINK_QUERY,
  );

  invariant(dataJson, 'Radio City Music Hall JSON data is required!');

  const radioCityMusicHallCrossLinkProps = useMemo(() => {
    return dataJson.crossLinks.map((crossLink) => ({
      fluid: crossLink.image.src.fluid,
      alt: crossLink.image.alt,
      caption: crossLink.caption,
      title: crossLink.title,
      link: crossLink.link,
    }));
  }, [dataJson]);

  return (
    radioCityMusicHallCrossLinkProps && (
      <Section {...props}>
        <Container sx={{py: [3, 4, 6]}}>
          <Flex
            sx={{
              justifyContent: 'space-between',
              flexDirection: ['column', null, 'row'],
            }}
          >
            {radioCityMusicHallCrossLinkProps.map((crossLink) => (
              <CrossLink key={crossLink.title} {...crossLink} />
            ))}
          </Flex>
        </Container>
      </Section>
    )
  );
};

export default RadioCityMusicHallCrossLinkBlock;
