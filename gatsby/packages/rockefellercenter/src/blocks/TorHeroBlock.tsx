/** @jsx jsx */
import {
  jsx,
  Section,
  Container,
  Box,
  GalleryCarousel,
} from '@tishman/components';
import {useMemo} from 'react';
import {useStaticQuery, graphql} from 'gatsby';
import type {ComponentPropsWithoutRef} from 'react';
import {getSanityGalleryItemProps} from '~blocks/utils';
import IntroText from '~components/IntroText';
import TorHoursAndAddressBlock from '~blocks/TorHoursAndAddressBlock';
import invariant from 'invariant';

const TOR_HERO_QUERY = graphql`
  query TorHero {
    sanityAttractionTor(
      _id: {eq: "topOfTheRock"}
      _type: {eq: "attraction.tor"}
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
    dataJson(id: {eq: "top-of-the-rock-observation-deck"}) {
      hero {
        links {
          label
          url
        }
      }
    }
  }
`;

const TorHeroBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    sanityAttractionTor,
    dataJson,
  } = useStaticQuery<GatsbyTypes.TorHeroQuery>(TOR_HERO_QUERY);

  invariant(dataJson, 'Tor JSON data is required!');

  const torHeroProps = useMemo(() => {
    if (!sanityAttractionTor)
      throw new Error('Expected valid private events sanity data');

    if (!sanityAttractionTor?.gallery)
      throw new Error('Expected valid private events hero gallery data');
    if (
      !sanityAttractionTor?.gallery?.items ||
      sanityAttractionTor?.gallery?.items.length < 1
    )
      throw new Error('Expected valid private events hero gallery items');

    const gallery = sanityAttractionTor?.gallery?.items.map((item) => {
      return getSanityGalleryItemProps(item);
    });

    if (!sanityAttractionTor?.heroCTA)
      throw new Error('Expected valid private events hero text');
    if (!sanityAttractionTor?.heroCTA?.title)
      throw new Error('Expected valid private events hero text title');
    if (!sanityAttractionTor?.heroCTA?.bodyCopy)
      throw new Error('Expected valid private events hero text body copy');

    const heroText = {
      title: sanityAttractionTor.heroCTA.title,
      caption: sanityAttractionTor.heroCTA.bodyCopy,
    };

    return {
      gallery,
      heroText,
      links: dataJson.hero.links && dataJson.hero.links.map((link) => link),
    };
  }, [sanityAttractionTor, dataJson]);

  return (
    torHeroProps && (
      <Section {...props}>
        <Box
          sx={{
            position: 'relative',
            pt: 5,
            zIndex: 'content',
            ':after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              bottom: 0,
              left: 0,
              right: 0,
              bg: 'primary',
              zIndex: 'background',
            },
          }}
        >
          <Container sx={{maxWidth: 1600, pb: 4, px: [0, 3]}}>
            <GalleryCarousel cards={torHeroProps.gallery} />
          </Container>
        </Box>
        <Box bg={'primary'}>
          <Container
            sx={{
              display: 'flex',
              flexDirection: ['column', null, 'row'],
              justifyContent: 'space-between',
              pt: [3, null, 6],
              pb: [6, null, 8],
            }}
          >
            <IntroText {...torHeroProps.heroText} links={torHeroProps.links} />
            <TorHoursAndAddressBlock />
          </Container>
        </Box>
      </Section>
    )
  );
};

export default TorHeroBlock;
