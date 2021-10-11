/** @jsx jsx */
import {
  jsx,
  Section,
  GalleryCarousel,
  GalleryCarouselCardProps,
  Container,
  Flex,
  Text,
} from '@tishman/components';
import type {ComponentPropsWithoutRef} from 'react';
import {useMemo} from 'react';
import {graphql, useStaticQuery} from 'gatsby';
import {getSanityGalleryItemProps} from './utils';

export const GESSO_HERO_QUERY = graphql`
  query GessoHero {
    sanityGessoAudioTour {
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
      heroCTA {
        title
        bodyCopy
      }
    }
  }
`;

const GessoHeroBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {sanityGessoAudioTour} = useStaticQuery<GatsbyTypes.GessoHeroQuery>(
    GESSO_HERO_QUERY,
  );

  const gessoHeroProps = useMemo(() => {
    return {
      title: sanityGessoAudioTour?.heroCTA.title,
      bodyCopy: sanityGessoAudioTour?.heroCTA.bodyCopy,
      galleryItems: sanityGessoAudioTour?.imageGallery?.images?.map((item) => {
        return getSanityGalleryItemProps(item);
      }) as GalleryCarouselCardProps[],
    };
  }, [sanityGessoAudioTour]);

  return (
    <Section {...props}>
      <Container sx={{maxWidth: 1380, pt: 5, pb: 4}}>
        {gessoHeroProps.galleryItems && (
          <GalleryCarousel cards={gessoHeroProps.galleryItems} />
        )}
        <Flex
          sx={{
            alignItems: 'center',
            flexDirection: 'column',
            mt: [75, 75, 95],
            mb: [19, 19, 54],
          }}
        >
          <Text
            variant="mediumPrivateEventSpec"
            sx={{fontSize: [30, 30, 46], textAlign: 'center', lineHeight: 1}}
          >
            {gessoHeroProps.title}
          </Text>
          <Text
            sx={{
              fontSize: [18, 18, 21],
              mt: 17,
              maxWidth: ['100%', 850],
              textAlign: 'center',
            }}
          >
            {gessoHeroProps.bodyCopy}
          </Text>
        </Flex>
      </Container>
    </Section>
  );
};

export default GessoHeroBlock;
