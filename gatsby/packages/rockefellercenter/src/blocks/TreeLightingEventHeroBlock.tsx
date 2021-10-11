/** @jsx jsx */
import {
  jsx,
  Section,
  AnchorSection,
  Container,
  GalleryCarousel,
  Box,
  Link,
  AddToCalendarButton,
  Flex,
} from '@tishman/components';
import invariant from 'invariant';
import {useStaticQuery, graphql} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {
  getHoursProps,
  getSanityGalleryItemProps,
  getLocationProps,
  getContactsInfoProps,
  getEventDetailUri,
} from '~blocks/utils';
import IntroText from '~components/IntroText';
import TreeLightingCountdown from '~components/TreeLightingCountdown';
import TreeLightingEventHoursAndAddress from '~blocks/TreeLightingEventHoursAndAddress';

const TREE_LIGHTING_EVENT_HERO_QUERY = graphql`
  query TreeLightingEventHero {
    dataJson(id: {eq: "rockefeller-center-christmas-tree-lighting"}) {
      hero {
        contactLinkUrl
      }
    }
    treeLightingData: allSanityEventTreeLighting(limit: 1) {
      nodes {
        type: _type
        titleAndSlug {
          title
          slug {
            current
          }
        }
        startEndDateTime {
          startDateTime
          endDateTime
        }
        _rawBody
        photo {
          __typename
          asset {
            fluid(maxWidth: 1600) {
              ...GatsbySanityImageFluid
            }
          }
          alt
          caption
        }
        imageGallery {
          title
          images {
            __typename
            asset {
              fluid(maxWidth: 1600) {
                ...GatsbySanityImageFluid
              }
            }
            caption
            alt
          }
        }
        hour {
          hours {
            day
            opensAt
            closesAt
          }
          hourText
        }
        broadcastInfo
        location {
          title
          address1
          address2
        }
        contactsInfo {
          type
          value
        }
        showAddToCalendar
        eventsCTA {
          url
          caption
        }
        excerpt
      }
    }
  }
`;

const TreeLightingEventHeroBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    dataJson,
    treeLightingData,
  } = useStaticQuery<GatsbyTypes.TreeLightingEventHeroQuery>(
    TREE_LIGHTING_EVENT_HERO_QUERY,
  );

  invariant(dataJson, 'Tree Lighting JSON data is required!');

  const treeLightingHeroProps = useMemo(() => {
    const treeLightingEvent = treeLightingData.nodes[0];
    const upperGalleryItem = getSanityGalleryItemProps(treeLightingEvent.photo);
    const lowerGalleryItems = treeLightingEvent.imageGallery?.images?.map(
      (item) => {
        return getSanityGalleryItemProps(item);
      },
    );

    const hours = treeLightingEvent.hour
      ? getHoursProps(treeLightingEvent.hour)
      : null;

    const location = getLocationProps(treeLightingEvent?.location);

    const contactsInfo = treeLightingEvent?.contactsInfo.map((contact) =>
      getContactsInfoProps(contact),
    );

    return {
      upperGallery: [upperGalleryItem],
      lowerGallery: lowerGalleryItems,
      title: treeLightingEvent.titleAndSlug.title,
      hours,
      broadcastInfo: treeLightingEvent.broadcastInfo,
      location,
      contactsInfo,
      body: treeLightingEvent._rawBody,
      startDateTime: treeLightingEvent.startEndDateTime.startDateTime,
      endDateTime: treeLightingEvent.startEndDateTime.endDateTime,
      contactLinkUrl: dataJson.hero.contactLinkUrl,
      showAddToCalendar: treeLightingEvent.showAddToCalendar,
      eventCTA: treeLightingEvent.eventsCTA,
      excerpt: treeLightingEvent.excerpt,
      url: getEventDetailUri(treeLightingEvent),
    };
  }, [treeLightingData, dataJson]);

  return (
    <Section {...props}>
      <Container sx={{maxWidth: 1600, pt: 5, pb: 4, px: [0, 3]}}>
        <GalleryCarousel cards={treeLightingHeroProps.upperGallery} />
      </Container>
      <AnchorSection id="viewing-details">
        <Container
          sx={{
            display: 'flex',
            flexDirection: ['column', null, 'row'],
            justifyContent: 'space-between',
            pt: [3, null, 8],
            pb: [6, null, 8],
            px: [3, 0, 0],
          }}
        >
          <IntroText
            sx={{
              fontSize: 4,
              maxWidth: 676,
              p: {
                mt: 20,
                mb: 40,
              },
              ul: {
                pl: 0,
                listStylePosition: 'inside',
              },
            }}
            title={treeLightingHeroProps.title}
            captionRichText={treeLightingHeroProps.body}
          />
          <Box>
            <TreeLightingCountdown
              startDateTime={treeLightingHeroProps.startDateTime}
              endDateTime={treeLightingHeroProps.endDateTime}
            />
            <TreeLightingEventHoursAndAddress
              hours={treeLightingHeroProps.hours}
              location={treeLightingHeroProps.location}
              contactsInfo={treeLightingHeroProps.contactsInfo}
              broadcastInfo={treeLightingHeroProps.broadcastInfo}
              contactLinkUrl={treeLightingHeroProps.contactLinkUrl}
            />
            <Flex
              sx={{
                flexDirection: ['column', 'row', 'column'],
                alignItems: ['flex-start', 'center', 'flex-start'],
                flexWrap: 'wrap',
                mb: [2, 4],
              }}
            >
              {treeLightingHeroProps.showAddToCalendar && (
                <AddToCalendarButton
                  {...treeLightingHeroProps}
                  url={treeLightingHeroProps.url}
                  description={treeLightingHeroProps.excerpt}
                  location={treeLightingHeroProps.location?.address1}
                  sx={{mr: 4, mt: 4}}
                />
              )}
              {treeLightingHeroProps.eventCTA &&
                treeLightingHeroProps.eventCTA.caption &&
                treeLightingHeroProps.eventCTA.url && (
                  <Link
                    key={treeLightingHeroProps.eventCTA.caption}
                    variant="button"
                    href={treeLightingHeroProps.eventCTA.url}
                    sx={{
                      mr: 4,
                      mt: [3, 4],
                      border: '1px solid black',
                    }}
                  >
                    {treeLightingHeroProps.eventCTA.caption}
                  </Link>
                )}
            </Flex>
          </Box>
        </Container>
        {treeLightingHeroProps.lowerGallery &&
          treeLightingHeroProps.lowerGallery.length > 0 && (
            <Container sx={{maxWidth: 1600, pt: 5, pb: 4, px: [0, 3]}}>
              <GalleryCarousel cards={treeLightingHeroProps.lowerGallery} />
            </Container>
          )}
      </AnchorSection>
    </Section>
  );
};

export default TreeLightingEventHeroBlock;
