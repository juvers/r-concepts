/** @jsx jsx */
import {
  jsx,
  Section,
  Container,
  Box,
  GalleryCarousel,
  HoursAndAddress,
} from '@tishman/components';
import {useStaticQuery, graphql} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {getLocationProps, getContactsInfoProps} from '~blocks/utils';
import IntroText from '~components/IntroText';
import invariant from 'invariant';

const RADIO_CITY_MUSIC_HALL_HERO_QUERY = graphql`
  query RadioCityMusicHallHero {
    dataJson(id: {eq: "radio-city-music-hall"}) {
      radioCityHero {
        links {
          label
          url
        }
        contactLinkUrl
        image {
          src {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
          alt
        }
      }
      heroCTA {
        title
        bodyCopy
      }
      location {
        title
        address1
        address2
      }
      contactsInfo {
        type
        value
      }
    }
  }
`;

const RadioCityMusicHallHeroBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.RadioCityMusicHallHeroQuery>(
    RADIO_CITY_MUSIC_HALL_HERO_QUERY,
  );

  invariant(dataJson, 'Radio City Music Hall JSON data is required!');
  const radioCityMusicHallHeroProps = useMemo(() => {
    const heroText = {
      title: dataJson.heroCTA.title,
      caption: dataJson.heroCTA.bodyCopy,
    };
    const location = getLocationProps(dataJson.location);
    const contactsInfo = dataJson.contactsInfo.map((contact) =>
      getContactsInfoProps(contact),
    );

    return {
      heroText,
      location,
      contactsInfo,
      fluid: dataJson.radioCityHero.image.src.fluid,
      alt: dataJson.radioCityHero.image.alt,
      links:
        dataJson.radioCityHero.links &&
        dataJson.radioCityHero.links.map((link) => link),
      contactLinkUrl: dataJson.radioCityHero.contactLinkUrl,
    };
  }, [dataJson]);

  return (
    radioCityMusicHallHeroProps && (
      <Section {...props}>
        <Box sx={{maxWidth: 1600, pt: 5, pb: 4, mx: 'auto'}}>
          <GalleryCarousel
            cards={[
              {
                fluid: radioCityMusicHallHeroProps.fluid,
                alt: radioCityMusicHallHeroProps.alt,
              },
            ]}
          />
        </Box>
        <Container
          sx={{
            display: 'flex',
            flexDirection: ['column', null, 'row'],
            justifyContent: 'space-between',
            pt: [5, null, 7],
            pb: [6, null, 8],
            // px: 5 override to match up with gallery above on larger screens
            px: [3, 5],
          }}
        >
          <IntroText
            {...radioCityMusicHallHeroProps.heroText}
            links={radioCityMusicHallHeroProps.links}
          />
          <HoursAndAddress
            location={radioCityMusicHallHeroProps.location}
            contactsInfo={radioCityMusicHallHeroProps.contactsInfo}
            contactLinkUrl={radioCityMusicHallHeroProps.contactLinkUrl}
          />
        </Container>
      </Section>
    )
  );
};

export default RadioCityMusicHallHeroBlock;
