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
import {
  getHoursProps,
  getSanityGalleryItemProps,
  getLocationProps,
  getContactsInfoProps,
} from '~blocks/utils';
import IntroText from '~components/IntroText';
import invariant from 'invariant';

const BAR_SIXTY_FIVE_HERO_QUERY = graphql`
  query BarSixtyFiveHero {
    sanityAttractionBar(_id: {eq: "bar65"}, _type: {eq: "attraction.bar"}) {
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
      hour {
        hours {
          day
          opensAt
          closesAt
        }
        hourText
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
    dataJson(id: {eq: "bar-sixtyfive"}) {
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

const BarSixtyFiveHeroBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    sanityAttractionBar,
    dataJson,
  } = useStaticQuery<GatsbyTypes.BarSixtyFiveHeroQuery>(
    BAR_SIXTY_FIVE_HERO_QUERY,
  );

  invariant(dataJson, 'Bar Sixty Five JSON data is required!');

  const barSixtyFiveHeroProps = useMemo(() => {
    if (!sanityAttractionBar)
      throw new Error('Expected valid Bar 65 sanity data');

    if (!sanityAttractionBar?.gallery)
      throw new Error('Expected valid Bar 65 hero gallery data');
    if (
      !sanityAttractionBar?.gallery?.items ||
      sanityAttractionBar?.gallery?.items.length < 1
    )
      throw new Error('Expected valid Bar 65 hero gallery items');

    const gallery = sanityAttractionBar?.gallery?.items.map((item) => {
      return getSanityGalleryItemProps(item);
    });

    if (!sanityAttractionBar?.heroCTA)
      throw new Error('Expected valid Bar 65 hero text');
    if (!sanityAttractionBar?.heroCTA?.title)
      throw new Error('Expected valid Bar 65 hero text title');
    if (!sanityAttractionBar?.heroCTA?.bodyCopy)
      throw new Error('Expected valid Bar 65 hero text body copy');

    const heroText = {
      title: sanityAttractionBar.heroCTA.title,
      caption: sanityAttractionBar.heroCTA.bodyCopy,
    };

    if (!sanityAttractionBar?.hour)
      throw new Error('Expected valid Bar 65 hour data');

    const hours = getHoursProps(sanityAttractionBar.hour);

    const location = getLocationProps(sanityAttractionBar?.location);

    if (!sanityAttractionBar?.contactsInfo)
      throw new Error('Expected Bar 65 contacts info');

    const contactsInfo = sanityAttractionBar?.contactsInfo.map((contact) =>
      getContactsInfoProps(contact),
    );

    return {
      gallery,
      heroText,
      hours,
      location,
      contactsInfo,
      links: dataJson.hero.links && dataJson.hero.links.map((link) => link),
      contactLinkUrl: dataJson.hero.contactLinkUrl,
    };
  }, [sanityAttractionBar, dataJson]);

  return (
    barSixtyFiveHeroProps && (
      <Section {...props}>
        <Box sx={{maxWidth: 1600, pt: 5, pb: 4, mx: 'auto'}}>
          <GalleryCarousel cards={barSixtyFiveHeroProps.gallery} />
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
            {...barSixtyFiveHeroProps.heroText}
            links={barSixtyFiveHeroProps.links}
          />
          <HoursAndAddress
            hours={barSixtyFiveHeroProps.hours}
            location={barSixtyFiveHeroProps.location}
            contactsInfo={barSixtyFiveHeroProps.contactsInfo}
            contactLinkUrl={barSixtyFiveHeroProps.contactLinkUrl}
          />
        </Container>
      </Section>
    )
  );
};

export default BarSixtyFiveHeroBlock;
