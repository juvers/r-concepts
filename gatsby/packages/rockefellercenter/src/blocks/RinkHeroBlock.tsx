/** @jsx jsx */
import {
  jsx,
  Section,
  Box,
  Container,
  GalleryCarousel,
} from '@tishman/components';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {useStaticQuery, graphql} from 'gatsby';
import {getSanityGalleryItemProps} from '~blocks/utils';
import IntroText from '~components/IntroText';
import RinkHoursAndAddressBlock from '~blocks/RinkHoursAndAddressBlock';
import invariant from 'invariant';

const RINK_HERO_QUERY = graphql`
  query RinkHero {
    sanityAttractionRink(_id: {eq: "theRink"}, _type: {eq: "attraction.rink"}) {
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
    dataJson(id: {eq: "the-rink-at-rockefeller-center"}) {
      hero {
        links {
          label
          url
        }
      }
    }
  }
`;

const RinkHeroBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    sanityAttractionRink,
    dataJson,
  } = useStaticQuery<GatsbyTypes.RinkHeroQuery>(RINK_HERO_QUERY);

  invariant(dataJson, 'Rink JSON data is required!');

  const rinkHeroProps = useMemo(() => {
    if (!sanityAttractionRink)
      throw new Error('Expected valid private events sanity data');

    if (!sanityAttractionRink?.gallery)
      throw new Error('Expected valid private events hero gallery data');
    if (
      !sanityAttractionRink?.gallery?.items ||
      sanityAttractionRink?.gallery?.items.length < 1
    )
      throw new Error('Expected valid private events hero gallery items');

    const gallery = sanityAttractionRink?.gallery?.items.map((item) => {
      return getSanityGalleryItemProps(item);
    });

    if (!sanityAttractionRink?.heroCTA)
      throw new Error('Expected valid private events hero text');
    if (!sanityAttractionRink?.heroCTA?.title)
      throw new Error('Expected valid private events hero text title');
    if (!sanityAttractionRink?.heroCTA?.bodyCopy)
      throw new Error('Expected valid private events hero text body copy');

    const heroText = {
      title: sanityAttractionRink.heroCTA.title,
      caption: sanityAttractionRink.heroCTA.bodyCopy,
    };

    return {
      gallery,
      heroText,
      links: dataJson.hero.links && dataJson.hero.links.map((link) => link),
    };
  }, [sanityAttractionRink, dataJson]);

  return (
    rinkHeroProps && (
      <Section {...props}>
        <Box sx={{maxWidth: 1600, pt: 5, pb: 4, mx: 'auto'}}>
          <GalleryCarousel cards={rinkHeroProps.gallery} />
        </Box>
        <Container
          sx={{
            display: 'flex',
            flexDirection: ['column', null, 'row'],
            justifyContent: 'space-between',
            pt: [3, null, 6],
            pb: [6, null, 8],
          }}
        >
          <IntroText {...rinkHeroProps.heroText} links={rinkHeroProps.links} />
          <RinkHoursAndAddressBlock />
        </Container>
      </Section>
    )
  );
};

export default RinkHeroBlock;
