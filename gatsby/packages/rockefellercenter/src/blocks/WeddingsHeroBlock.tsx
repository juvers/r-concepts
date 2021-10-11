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

const WEDDING_HERO_QUERY = graphql`
  query WeddingHero {
    sanityAttractionWedding(
      _id: {eq: "wedding"}
      _type: {eq: "attraction.wedding"}
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
    dataJson(id: {eq: "wedding"}) {
      hero {
        links {
          label
          url
        }
      }
    }
  }
`;

const WeddingsHeroBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    sanityAttractionWedding,
    dataJson,
  } = useStaticQuery<GatsbyTypes.WeddingHeroQuery>(WEDDING_HERO_QUERY);

  invariant(dataJson, 'Wedding JSON data is required!');
  invariant(
    sanityAttractionWedding,
    'sanityAttractionWedding data is required!',
  );

  const weddingHeroProps = useMemo(() => {
    if (!sanityAttractionWedding?.gallery)
      throw new Error('Expected valid private events hero gallery data');
    if (
      !sanityAttractionWedding?.gallery?.items ||
      sanityAttractionWedding?.gallery?.items.length < 1
    )
      throw new Error('Expected valid private events hero gallery items');

    const gallery = sanityAttractionWedding?.gallery?.items.map((item) => {
      return getSanityGalleryItemProps(item);
    });

    if (!sanityAttractionWedding?.heroCTA)
      throw new Error('Expected valid private events hero text');
    if (!sanityAttractionWedding?.heroCTA?.title)
      throw new Error('Expected valid private events hero text title');
    if (!sanityAttractionWedding?.heroCTA?.bodyCopy)
      throw new Error('Expected valid private events hero text body copy');

    const heroText = {
      title: sanityAttractionWedding.heroCTA.title,
      caption: sanityAttractionWedding.heroCTA.bodyCopy,
    };

    return {
      gallery,
      heroText,
      links: dataJson.hero.links && dataJson.hero.links.map((link) => link),
    };
  }, [sanityAttractionWedding, dataJson]);

  return (
    weddingHeroProps && (
      <Section {...props}>
        <Box sx={{maxWidth: 1600, pt: 5, pb: 4, mx: 'auto'}}>
          <GalleryCarousel cards={weddingHeroProps.gallery} />
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
            sx={{mx: 'auto'}}
            {...weddingHeroProps.heroText}
            links={weddingHeroProps.links}
          />
        </Container>
      </Section>
    )
  );
};

export default WeddingsHeroBlock;
