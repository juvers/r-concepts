/** @jsx jsx */
import * as React from 'react';
import {
  jsx,
  Section,
  Container,
  Box,
  Text,
  CarouselContextProvider,
  IntrinsicImage,
  Grid,
  CarouselList,
  Link,
} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {useStaticQuery, graphql} from 'gatsby';
import {FluidObject} from 'gatsby-image';
import invariant from 'invariant';
import ThreeColMobileItem from '../components/ThreeColMobileBlock/ThreeColMobileItem';

const PARTNERSHIP_THREE_COL_GRID_QUERY = graphql`
  query PartnershipThreeColGrid {
    dataJson(id: {eq: "partnerships"}) {
      partnershipThreeColGrid {
        rows {
          cards {
            cardType
            title
            caption
            links {
              url
              label
            }
            image {
              alt
              src {
                fluid {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
            imageHeight
            imageWidth
          }
        }
      }
    }
  }
`;

interface TextCardProps {
  title: string;
  caption: string;
  area: string | number;
  cardType: string;
  links: readonly {
    label: string;
    url: string;
  }[];
}

const textCardTitle = (title: string) => (
  <H
    sx={{
      variant: 'styles.h1',
      fontFamily: 'headingSecondary',
      fontSize: [6, 7],
      mb: [1, 4],
      maxWidth: ['unset', 300],
    }}
  >
    {title}
  </H>
);

const textCardCaption = (caption: string) => (
  <Text
    sx={{
      mb: 4,
      mt: 1,
      maxWidth: ['unset', 300],
    }}
  >
    {caption}
  </Text>
);

const isTextCard = (
  card: Partial<ImageCardProps & TextCardProps>,
): card is TextCardProps => card.cardType === 'text';

const TextCard = (card: TextCardProps) => {
  return (
    <Box
      sx={{
        gridArea: card.area,
        mb: [2, 4],
      }}
    >
      {textCardTitle(card.title)}
      {textCardCaption(card.caption)}

      {card.links &&
        card.links.map(({url, label}) => (
          <Link
            variant={'underline'}
            sx={{
              ':first-of-type': {
                mr: card.links.length > 1 ? 3 : 0,
                mt: [2, 3, 3],
                display: 'inline-block',
              },
            }}
            key={url}
            href={url}
          >
            {label}
          </Link>
        ))}
    </Box>
  );
};

interface ImageCardProps {
  cardType: string;
  imageHeight?: number;
  imageWidth?: number;
  area: string | number;
  image: {
    alt: string;
    src: {
      fluid: FluidObject;
    };
  };
}

const isImageCard = (
  card: Partial<ImageCardProps & TextCardProps>,
): card is ImageCardProps => card.cardType === 'image';

const ImageCard = (card: ImageCardProps) => {
  return (
    <Box
      sx={{
        width: ['93%', '100%'],
        gridArea: card.area,
      }}
    >
      <IntrinsicImage
        ratio={(card.imageWidth ?? 1) / (card.imageHeight ?? 1)}
        sx={{mx: 'auto', width: '100%'}}
        alt={card.image.alt}
        maxWidth={['100%', '80%', '70%', card.imageWidth]}
        fluid={card.image.src.fluid}
      />
    </Box>
  );
};

const PartnershipThreeColGridBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.PartnershipThreeColGridQuery>(
    PARTNERSHIP_THREE_COL_GRID_QUERY,
  );

  invariant(dataJson, 'Partnership JSON data is required!');

  const rows = useMemo(() => {
    return dataJson.partnershipThreeColGrid.rows.map((row) => {
      let gridOrder = '';
      const cards = row.cards.map((card, index) => {
        gridOrder = gridOrder.concat(`${index} `);
        return card;
      });

      return {
        cards,
        gridOrder,
      };
    });
  }, [dataJson]);

  const renderDesktop = (
    cards: Partial<ImageCardProps & TextCardProps>[],
    order: number,
  ) => {
    return (
      <React.Fragment key={`${order}-row`}>
        {cards.map(
          (card: Partial<ImageCardProps & TextCardProps>, index: number) => {
            if (isTextCard(card)) {
              return <TextCard {...card} key={index} area={index} />;
            }
            if (isImageCard(card)) {
              return <ImageCard {...card} key={index} area={index} />;
            }
          },
        )}
      </React.Fragment>
    );
  };

  const renderMobile = (
    cards: Partial<ImageCardProps & TextCardProps>[],
    order: number,
  ) => {
    const textCards: Array<TextCardProps> = [];
    const imageCards: Array<ImageCardProps> = [];
    cards.map((card: Partial<ImageCardProps & TextCardProps>) => {
      if (isTextCard(card)) {
        textCards.push(card);
      }
      if (isImageCard(card)) {
        imageCards.push(card);
      }
    });

    return (
      <React.Fragment key={`${order}-row`}>
        {textCards && textCards.length > 0 && (
          <ThreeColMobileItem
            title={textCards[0].title as string}
            showDefault={order == 0}
          >
            {textCardCaption(textCards[0].caption as string)}
            <CarouselContextProvider>
              <CarouselList autoSize="65%" gap={0} initialPage={0}>
                {imageCards.map((card, index: number) => (
                  <ImageCard {...card} key={index} area={index} />
                ))}
              </CarouselList>
            </CarouselContextProvider>
          </ThreeColMobileItem>
        )}
      </React.Fragment>
    );
  };

  return (
    <Section {...props}>
      <Container py={[5, 7]}>
        {rows.map((row, index) => {
          return (
            <React.Fragment key={index}>
              <Box
                sx={{
                  display: ['inline-block', 'none'],
                }}
                key={`${index}-row`}
              >
                {renderMobile(row.cards, index)}
              </Box>
              <Grid
                key={`${index}-row`}
                sx={{
                  gridTemplateColumns: [
                    'repeat(1, 1fr)',
                    'repeat(2, 1fr)',
                    null,
                    'repeat(3, 1fr)',
                  ],
                  gridGap: [3, 4],
                  gridTemplateAreas: `"${row.gridOrder}"`,
                  gridAutoFlow: 'dense',
                  alignItems: 'center',
                  mb: [0, null, null, 8],
                  display: ['none', 'grid'],
                }}
              >
                {renderDesktop(row.cards, index)}
              </Grid>
            </React.Fragment>
          );
        })}
      </Container>
    </Section>
  );
};

export default PartnershipThreeColGridBlock;
