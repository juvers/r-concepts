/** @jsx jsx */
import {jsx, Section, Container, GalleryCarousel} from '@tishman/components';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {useStaticQuery, graphql} from 'gatsby';

import {getSanityGalleryItemProps} from '~blocks/utils';
import IntroText from '~components/IntroText';
import RockCenterHoursAndAddressBlock from '~blocks/TourHoursAndAddressBlock';
import invariant from 'invariant';

const TOUR_HERO_QUERY = graphql`
  query TourHero {
    sanityAttractionRc(_id: {eq: "rcTour"}, _type: {eq: "attraction.rc"}) {
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
    dataJson(id: {eq: "rockefeller-center-tour"}) {
      hero {
        links {
          label
          url
        }
      }
    }
  }
`;

const RockCenterHeroBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    sanityAttractionRc,
    dataJson,
  } = useStaticQuery<GatsbyTypes.TourHeroQuery>(TOUR_HERO_QUERY);

  invariant(dataJson, 'Tour JSON data is required!');

  const tourHeroProps = useMemo(() => {
    if (!sanityAttractionRc)
      throw new Error('Expected valid rc tour sanity data');

    if (!sanityAttractionRc?.gallery)
      throw new Error('Expected valid rc tour hero gallery data');
    if (
      !sanityAttractionRc?.gallery?.items ||
      sanityAttractionRc?.gallery?.items.length < 1
    )
      throw new Error('Expected valid rc tour hero gallery items');

    const gallery = sanityAttractionRc?.gallery?.items.map((item) => {
      return getSanityGalleryItemProps(item);
    });

    if (!sanityAttractionRc?.heroCTA)
      throw new Error('Expected valid rc tour hero text');
    if (!sanityAttractionRc?.heroCTA?.title)
      throw new Error('Expected valid rc tour hero text title');
    if (!sanityAttractionRc?.heroCTA?.bodyCopy)
      throw new Error('Expected valid rc tour hero text body copy');

    const heroText = {
      title: sanityAttractionRc.heroCTA.title,
      caption: sanityAttractionRc.heroCTA.bodyCopy,
    };

    return {
      gallery,
      heroText,
      links: dataJson.hero.links && dataJson.hero.links.map((link) => link),
    };
  }, [sanityAttractionRc, dataJson]);

  return (
    tourHeroProps && (
      <Section {...props}>
        <Container sx={{maxWidth: 1600, pt: 5, pb: 4, px: [0, 3]}}>
          <GalleryCarousel cards={tourHeroProps.gallery} />
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
          <IntroText {...tourHeroProps.heroText} links={tourHeroProps.links} />
          <RockCenterHoursAndAddressBlock />
        </Container>
      </Section>
    )
  );
};

export default RockCenterHeroBlock;
