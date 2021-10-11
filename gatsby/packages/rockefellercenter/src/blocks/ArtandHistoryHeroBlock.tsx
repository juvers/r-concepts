/** @jsx jsx */
import {
  jsx,
  Section,
  Container,
  // Grid,
  IntrinsicImage,
  Box,
  Flex,
  Text,
  IntrinsicImageProps,
  SxStyleProp,
} from '@tishman/components';
import {useStaticQuery, graphql} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {H} from '@hzdg/sectioning';
import invariant from 'invariant';

export interface CustomImageGridCardProps extends IntrinsicImageProps {
  /** Grid card caption */
  caption?: string;
  /** Grid card alt */
  alt: string;
  /** Any overriding styles to change default styling */
  sx?: SxStyleProp;
  /** Some sx props get passed as classNames to components */
  className?: string;
}

const ART_AND_HISTORY_HERO_QUERY = graphql`
  query ArtandHistoryHero {
    dataJson(id: {eq: "art-and-history"}) {
      artHistoryHero {
        title
        bodyCopy
        cards {
          image {
            src {
              fluid {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
            alt
          }
          caption
        }
      }
    }
  }
`;

const ArtandHistoryHeroBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.ArtandHistoryHeroQuery>(
    ART_AND_HISTORY_HERO_QUERY,
  );

  invariant(dataJson, 'Art & History JSON data is required');

  const artAndHistoryHeroProps = useMemo(() => {
    return {
      title: dataJson.artHistoryHero.title,
      caption: dataJson.artHistoryHero.bodyCopy,
      cards: dataJson.artHistoryHero.cards.map((card) => ({
        fluid: card.image.src.fluid,
        caption: card.caption,
        alt: card.image.alt,
      })),
    };
  }, [dataJson]);

  return (
    <Section {...props}>
      <Container>
        <Box py={4}>
          <Flex
            sx={{
              flexDirection: ['column', 'column', 'column', 'row'],
              justifyContent: 'space-evenly',
            }}
          >
            {artAndHistoryHeroProps.title && (
              <H
                sx={{
                  variant: 'styles.h1',
                  fontFamily: 'heading',
                  fontSize: [6, 7, 9],
                  mb: 3,
                  px: 1,
                  flexBasis: '50%',
                }}
              >
                {artAndHistoryHeroProps.title}
              </H>
            )}
            <Box
              sx={{
                px: 1,
                flexBasis: '50%',
              }}
            >
              <Text
                as="p"
                sx={{
                  fontSize: [2, 4],
                  letterSpacing: [2, 1],
                  opacity: 0.8,
                }}
              >
                {artAndHistoryHeroProps.caption}
              </Text>
            </Box>
          </Flex>
        </Box>
        <Flex
          sx={{
            pt: [4, null, 8],
            pb: [4, null, 8],
            flexDirection: ['column', 'column', 'column', 'row'],
            justifyContent: 'space-evenly',
          }}
        >
          <CustomImageGridCard
            sx={{mx: 'auto', mb: [4, 'none']}}
            maxWidth={['none', 550]}
            fluid={artAndHistoryHeroProps.cards[0]?.fluid}
            alt={artAndHistoryHeroProps.cards[0]?.alt}
            caption={artAndHistoryHeroProps.cards[0]?.caption}
          />
          <CustomImageGridCard
            ratio={[4 / 5, null, 3 / 5]}
            maxWidth={['95%', 365]}
            fluid={artAndHistoryHeroProps.cards[1]?.fluid}
            sx={{
              mx: 'auto',
              my: [null, null, 2, 8],
            }}
            alt={artAndHistoryHeroProps.cards[1]?.alt}
            caption={artAndHistoryHeroProps.cards[1]?.caption}
          />
        </Flex>
      </Container>
    </Section>
  );
};

export default ArtandHistoryHeroBlock;

const CustomImageGridCard = ({
  fluid,
  caption,
  alt,
  ratio = 395 / 565,
  maxWidth = 395,
  className,
  sx,
}: CustomImageGridCardProps): JSX.Element => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: maxWidth,
        position: 'relative',
        ...sx,
      }}
      className={className}
    >
      <IntrinsicImage
        ratio={ratio}
        maxWidth={maxWidth}
        fluid={fluid}
        alt={alt}
      />
      {caption && (
        <Text
          sx={{
            position: 'absolute',
            fontSize: [1, 2],
            fontWeight: 700,
            bottom: [2, 3],
            right: 3,
            color: 'mediaCaption',
          }}
        >
          {caption}
        </Text>
      )}
    </Box>
  );
};
