/**@jsx jsx */
import {
  jsx,
  Section,
  Container,
  Grid,
  Text,
  IntrinsicImage,
  Box,
} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import IntroText from '~components/IntroText';
import invariant from 'invariant';

const SHOP_DINE_HERO_QUERY = graphql`
  query ShopDineHero {
    dataJson(id: {eq: "shop-and-dine"}) {
      shopAndDineHero {
        title
        caption
      }
      shopAndDineIntroGrid {
        cards {
          caption
          width
          height
          image {
            src {
              fluid(maxWidth: 1130, maxHeight: 1584, cropFocus: CENTER) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
            alt
          }
        }
      }
    }
  }
`;

const ShopDineHeroBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.ShopDineHeroQuery>(
    SHOP_DINE_HERO_QUERY,
  );

  invariant(dataJson, 'Shop and Dine Hero JSON data is required!');

  const shopDineHeroData = useMemo(() => {
    return {
      title: dataJson.shopAndDineHero.title,
      caption: dataJson.shopAndDineHero.caption,
      cards: dataJson.shopAndDineIntroGrid.cards,
    };
  }, [dataJson]);

  return (
    <Section {...props}>
      <Container sx={{py: 4}}>
        <IntroText
          title={shopDineHeroData.title}
          caption={shopDineHeroData.caption}
          desktopOrientation="row"
          center={true}
          sx={{
            ...{
              'h1, h2, h3, h4, h5, h6': {
                fontFamily: 'heading',
                fontSize: [7, 8, 9],
              },
            },
            mx: 'auto',
            mb: [4, null, 9],
            mt: [0, null, 6],
          }}
        />
        <Grid
          sx={{
            mb: [6, 8],
            justifyItems: 'center',
          }}
          columns={[1, 2]}
          gap={0}
        >
          {shopDineHeroData.cards.map((card, ind) => {
            return (
              <Box
                key={card.caption}
                sx={{
                  transform:
                    ind === 1
                      ? ['none', `translateY(50px)`, `translateY(100px)`]
                      : 'none',
                  width: ind === 1 ? ['95%', null, '100%'] : '100%',
                  mb: [5, 0],
                  mx: [2, null, 3],
                  boxSizing: 'border-box',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: ind === 1 ? ['95%', null, '100%'] : '100%',
                    maxWidth: card.width,
                    mx: 'auto',
                  }}
                >
                  <IntrinsicImage
                    fluid={card.image.src.fluid}
                    alt={card.image.alt}
                    maxWidth={card.width}
                    ratio={(card.width ?? 1) / (card.height ?? 1)}
                    sx={{mx: 'auto'}}
                  />
                  <Text
                    sx={{
                      position: 'absolute',
                      fontSize: [1, 2],
                      bottom: [2, null, 3],
                      right: [2, null, 3],
                      color: 'mediaCaption',
                    }}
                  >
                    {card.caption}
                  </Text>
                </Box>
              </Box>
            );
          })}
        </Grid>
      </Container>
    </Section>
  );
};

export default ShopDineHeroBlock;
