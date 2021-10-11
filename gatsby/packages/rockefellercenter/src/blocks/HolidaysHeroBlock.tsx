/** @jsx jsx */
import {
  jsx,
  Section,
  Container,
  GalleryCarousel,
  HoursAndAddress,
  Box,
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
import TreeLightingCountdown from '~components/TreeLightingCountdown';
import invariant from 'invariant';

const HOLIDAYS_HERO_QUERY = graphql`
  query HolidayHero {
    sanityAttractionHoliday(
      _id: {eq: "theHolidays"}
      _type: {eq: "attraction.holiday"}
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
    dataJson(id: {eq: "holidays"}) {
      hero {
        contactLinkUrl
      }
    }
    treeLightingData: allSanityEventTreeLighting(limit: 1) {
      nodes {
        startEndDateTime {
          startDateTime
          endDateTime
        }
      }
    }
  }
`;

const HolidaysHeroBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    sanityAttractionHoliday,
    dataJson,
    treeLightingData,
  } = useStaticQuery<GatsbyTypes.HolidayHeroQuery>(HOLIDAYS_HERO_QUERY);

  invariant(dataJson, 'Holidays JSON data is required!');

  const holidaysHeroProps = useMemo(() => {
    if (!sanityAttractionHoliday)
      throw new Error('Expected valid Holidays sanity data');

    if (!sanityAttractionHoliday?.gallery)
      throw new Error('Expected valid Holidays hero gallery data');
    if (
      !sanityAttractionHoliday?.gallery?.items ||
      sanityAttractionHoliday?.gallery?.items.length < 1
    )
      throw new Error('Expected valid Holidays hero gallery items');

    const gallery = sanityAttractionHoliday?.gallery?.items.map((item) => {
      return getSanityGalleryItemProps(item);
    });

    if (!sanityAttractionHoliday?.heroCTA)
      throw new Error('Expected valid Holidays hero text');
    if (!sanityAttractionHoliday?.heroCTA?.title)
      throw new Error('Expected valid Holidays hero text title');
    if (!sanityAttractionHoliday?.heroCTA?.bodyCopy)
      throw new Error('Expected valid Holidays hero text body copy');

    const heroText = {
      title: sanityAttractionHoliday.heroCTA.title,
      caption: sanityAttractionHoliday.heroCTA.bodyCopy,
    };

    if (!sanityAttractionHoliday?.hour)
      throw new Error('Expected valid Holidays hour data');

    const hours = getHoursProps(sanityAttractionHoliday.hour);

    const location = getLocationProps(sanityAttractionHoliday?.location);

    if (!sanityAttractionHoliday?.contactsInfo)
      throw new Error('Expected Holidays contacts info');

    const contactsInfo = sanityAttractionHoliday?.contactsInfo.map((contact) =>
      getContactsInfoProps(contact),
    );

    return {
      gallery,
      heroText,
      hours,
      location,
      contactsInfo,
      contactLinkUrl: dataJson.hero.contactLinkUrl,
      startDateTime: treeLightingData.nodes[0].startEndDateTime.startDateTime,
      endDateTime: treeLightingData.nodes[0].startEndDateTime.endDateTime,
    };
  }, [sanityAttractionHoliday, dataJson, treeLightingData]);

  return (
    holidaysHeroProps && (
      <Section {...props}>
        <Container sx={{maxWidth: 1600, pt: 5, pb: 4, px: [0, 3]}}>
          <GalleryCarousel cards={holidaysHeroProps.gallery} />
        </Container>
        <Container
          sx={{
            display: 'flex',
            flexDirection: ['column', null, 'row'],
            justifyContent: 'space-between',
            pt: [3, null, 6],
            pb: [6, null, 8],
          }}
        >
          <IntroText sx={{mb: 4}} {...holidaysHeroProps.heroText} />
          <Box>
            <TreeLightingCountdown
              startDateTime={holidaysHeroProps.startDateTime}
              endDateTime={holidaysHeroProps.endDateTime}
            />
            <HoursAndAddress
              hours={holidaysHeroProps.hours}
              location={holidaysHeroProps.location}
              contactsInfo={holidaysHeroProps.contactsInfo}
              contactLinkUrl={holidaysHeroProps.contactLinkUrl}
            />
          </Box>
        </Container>
      </Section>
    )
  );
};

export default HolidaysHeroBlock;
