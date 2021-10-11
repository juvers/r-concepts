/** @jsx jsx */
import {
  jsx,
  Section,
  Container,
  Box,
  GalleryCarousel,
  HoursAndAddress,
} from '@tishman/components';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {useStaticQuery, graphql} from 'gatsby';
import {
  getSanityGalleryItemProps,
  getLocationProps,
  getContactsInfoProps,
} from '~blocks/utils';
import IntroText from '~components/IntroText';
import invariant from 'invariant';

const RAINBOW_ROOM_HERO_QUERY = graphql`
  query RainbowRoomHero {
    sanityAttractionRainbow(
      _id: {eq: "rainbowRoom"}
      _type: {eq: "attraction.rainbow"}
    ) {
      gallery {
        items {
          __typename
          ... on SanityImageType {
            asset {
              fluid(maxWidth: 1600) {
                ...GatsbySanityImageFluid
              }
            }
            alt
            caption
          }
          ... on SanityAmbientVideoType {
            videoFile {
              asset {
                url
              }
            }
          }
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
    dataJson(id: {eq: "rainbow-room"}) {
      hero {
        links {
          label
          url
        }
        contactLinkUrl
      }
    }
  }
`;

const RainbowRoomHeroBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    sanityAttractionRainbow,
    dataJson,
  } = useStaticQuery<GatsbyTypes.RainbowRoomHeroQuery>(RAINBOW_ROOM_HERO_QUERY);

  invariant(dataJson, 'Rainbow Room JSON data is required!');

  const rainbowRoomHeroProps = useMemo(() => {
    if (!sanityAttractionRainbow)
      throw new Error('Expected valid rainbow room sanity data');

    if (!sanityAttractionRainbow?.gallery)
      throw new Error('Expected valid rainbow room hero gallery data');
    if (
      !sanityAttractionRainbow?.gallery?.items ||
      sanityAttractionRainbow?.gallery?.items.length < 1
    )
      throw new Error('Expected valid rainbow room hero gallery items');

    const gallery = sanityAttractionRainbow?.gallery?.items.map((item) => {
      return getSanityGalleryItemProps(item);
    });

    if (!sanityAttractionRainbow?.heroCTA)
      throw new Error('Expected valid rainbow room hero text');
    if (!sanityAttractionRainbow?.heroCTA?.title)
      throw new Error('Expected valid rainbow room hero text title');
    if (!sanityAttractionRainbow?.heroCTA?.bodyCopy)
      throw new Error('Expected valid rainbow room hero text body copy');

    const heroText = {
      title: sanityAttractionRainbow.heroCTA.title,
      caption: sanityAttractionRainbow.heroCTA.bodyCopy,
    };

    const location = getLocationProps(sanityAttractionRainbow?.location);

    if (!sanityAttractionRainbow?.contactsInfo)
      throw new Error('Expected rainbow room contacts info');

    const contactsInfo = sanityAttractionRainbow?.contactsInfo.map((contact) =>
      getContactsInfoProps(contact),
    );

    if (!dataJson?.hero?.links)
      throw new Error('Expected valid rainbow room static data');

    return {
      gallery,
      heroText,
      location,
      contactsInfo,
      links: dataJson.hero.links.map((link) => link),
      contactLinkUrl: dataJson.hero.contactLinkUrl,
    };
  }, [sanityAttractionRainbow, dataJson]);

  return (
    rainbowRoomHeroProps && (
      <Section {...props}>
        <Box sx={{maxWidth: 1600, pt: 5, pb: 4, mx: 'auto'}}>
          <GalleryCarousel cards={rainbowRoomHeroProps.gallery} />
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
            {...rainbowRoomHeroProps.heroText}
            links={rainbowRoomHeroProps.links}
          />
          <HoursAndAddress
            location={rainbowRoomHeroProps.location}
            contactsInfo={rainbowRoomHeroProps.contactsInfo}
            contactLinkUrl={rainbowRoomHeroProps.contactLinkUrl}
          />
        </Container>
      </Section>
    )
  );
};

export default RainbowRoomHeroBlock;
