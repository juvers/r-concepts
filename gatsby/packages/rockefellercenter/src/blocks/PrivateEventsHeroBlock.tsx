/** @jsx jsx */
import {
  jsx,
  Section,
  Container,
  Box,
  GalleryCarousel,
} from '@tishman/components';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {useStaticQuery, graphql} from 'gatsby';
import {getSanityGalleryItemProps} from '~blocks/utils';
import IntroText from '~components/IntroText';
import invariant from 'invariant';

const PRIVATE_EVENTS_HERO_QUERY = graphql`
  query PrivateEventsHero {
    sanityAttractionEvent(
      _id: {eq: "privateEvent"}
      _type: {eq: "attraction.event"}
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
    }
    dataJson(id: {eq: "private-events"}) {
      hero {
        links {
          label
          url
        }
      }
    }
  }
`;

const PrivateEventsHeroBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    sanityAttractionEvent,
    dataJson,
  } = useStaticQuery<GatsbyTypes.PrivateEventsHeroQuery>(
    PRIVATE_EVENTS_HERO_QUERY,
  );

  invariant(dataJson, 'Private events JSON data is required!');

  const privateEventsHeroProps = useMemo(() => {
    if (!sanityAttractionEvent)
      throw new Error('Expected valid private events sanity data');

    if (!sanityAttractionEvent?.gallery)
      throw new Error('Expected valid private events hero gallery data');
    if (
      !sanityAttractionEvent?.gallery?.items ||
      sanityAttractionEvent?.gallery?.items.length < 1
    )
      throw new Error('Expected valid private events hero gallery items');

    const gallery = sanityAttractionEvent?.gallery?.items.map((item) => {
      return getSanityGalleryItemProps(item);
    });

    if (!sanityAttractionEvent?.heroCTA)
      throw new Error('Expected valid private events hero text');
    if (!sanityAttractionEvent?.heroCTA?.title)
      throw new Error('Expected valid private events hero text title');
    if (!sanityAttractionEvent?.heroCTA?.bodyCopy)
      throw new Error('Expected valid private events hero text body copy');

    const heroText = {
      title: sanityAttractionEvent.heroCTA.title,
      caption: sanityAttractionEvent.heroCTA.bodyCopy,
    };

    return {
      gallery,
      heroText,
      links: dataJson.hero.links && dataJson.hero.links.map((link) => link),
    };
  }, [sanityAttractionEvent, dataJson]);

  return (
    privateEventsHeroProps && (
      <Section {...props}>
        <Box sx={{maxWidth: 1600, pt: 5, pb: 4, mx: 'auto'}}>
          <GalleryCarousel cards={privateEventsHeroProps.gallery} />
        </Box>
        <Container
          sx={{
            display: 'flex',
            flexDirection: ['column', null, 'row'],
            justifyContent: 'space-between',
            py: [5, null, 6],
            // px: 5 override to match up with gallery above on larger screens
            px: [3, 5],
          }}
        >
          <IntroText
            center={true}
            maxWidth={775}
            sx={{mx: 'auto'}}
            {...privateEventsHeroProps.heroText}
            links={privateEventsHeroProps.links}
          />
        </Container>
      </Section>
    )
  );
};

export default PrivateEventsHeroBlock;
