/** @jsx jsx */
import {
  jsx,
  AnchorSection,
  Container,
  Grid,
  Box,
  Text,
  Button,
  useHistorySectionLine,
  useToggleHistoryCards,
  HistoryCard,
  HISTORY_CARD_TYPES,
} from '@tishman/components';
import {useStaticQuery, graphql} from 'gatsby';
import {useMemo, useRef} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {H} from '@hzdg/sectioning';
import useSize from '@hzdg/use-size';
import useRefCallback from '@hzdg/use-ref-callback';
import invariant from 'invariant';

const TREE_HISTORY_QUERY = graphql`
  query TreeHistory {
    dataJson(id: {eq: "rockefeller-center-christmas-tree-lighting"}) {
      history {
        title
        caption
        cards {
          type
          title
          caption
          image {
            src {
              fluid {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
            alt
          }
          didYouKnow
        }
      }
    }
  }
`;

const TreeHistoryBlock = (
  props: Omit<ComponentPropsWithoutRef<typeof AnchorSection>, 'children'>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.TreeHistoryQuery>(
    TREE_HISTORY_QUERY,
  );

  invariant(dataJson, 'Tree JSON data is required!');

  const historyProps = useMemo(() => {
    return {
      title: dataJson.history.title,
      caption: dataJson.history.caption,
      cards: dataJson.history.cards.map((card, index) => {
        const isEven = typeof index === 'number' && index % 2 == 0;
        return {
          type: card.type as HISTORY_CARD_TYPES,
          title: card.title,
          caption: card.caption,
          fluid: card.image.src.fluid,
          alt: card.image.alt,
          isEven: isEven,
          didYouKnow: card.didYouKnow,
        };
      }),
    };
  }, [dataJson]);

  // Get height of title/caption box to offset the even history cards
  // to  match design
  const [
    {
      borderBoxSize: {blockSize: titleHeight},
    },
    titleSizeRef,
  ] = useSize();

  // Get width section to be used for useHistoryTitleLine
  // useWindowWidth did not work in docs playground
  const sectionRef = useRef(null);
  const [, setSectionRef] = useRefCallback(null, sectionRef);
  const {width: sectionWidth} = useSize(sectionRef);

  // grid gap values provided to get title card height
  const gridGapHeight = 32;
  const gridGapWidth = 200;
  const titleCardHeight = titleHeight + gridGapHeight;

  // if load more button exists,
  // bottom of historySectionLine line
  // should be top top of button, else draw to bottom of section
  const loadMoreButtonRef = useRef(null);
  const [, setLoadMoreButtonRef] = useRefCallback(null, loadMoreButtonRef);
  const historySectionLine = useHistorySectionLine(loadMoreButtonRef);

  const {cardsToShow, showAllCards, toggleShowAllCards} = useToggleHistoryCards(
    {
      allCards: historyProps.cards,
      initialCardsToShow: 3,
      scrollToRef: sectionRef,
    },
  );

  // styling conditional. if even number cards we need to add
  // change bottom padding to match designs
  const evenNumberCards = cardsToShow.length % 2 === 0;

  return (
    <AnchorSection ref={setSectionRef} {...props}>
      <Container
        sx={{
          ...historySectionLine,
        }}
      >
        <Grid
          sx={{
            pt: [5, null, 8],
            pb: [9, null, evenNumberCards ? 8 : 0],
            px: [4, null, 0],
            gridTemplateColumns: ['1fr', null, 'repeat(2, 1fr)'],
            gridGap: [0, null, `${gridGapHeight}px ${gridGapWidth}px`],
            '> div:nth-of-type(even)': {
              justifySelf: 'flex-end',
              transform: [
                'translateY(0)',
                null,
                `translateY(-${titleCardHeight}px)`,
              ],
            },
          }}
        >
          <Box
            ref={titleSizeRef}
            sx={{gridColumnStart: [1, null, 2], pb: [3, null, 5]}}
          >
            <H
              sx={{
                variant: 'styles.h1',
                fontFamily: 'headingSecondary',
                mb: 3,
              }}
            >
              {historyProps.title}
            </H>
            <Text
              as="p"
              sx={{
                variant: 'text.smallP',
                opacity: 0.8,
              }}
            >
              {historyProps.caption}
            </Text>
          </Box>
          {cardsToShow &&
            cardsToShow.map(
              (card): JSX.Element => {
                return (
                  <HistoryCard
                    key={card.title}
                    {...card}
                    sectionWidth={sectionWidth}
                  />
                );
              },
            )}
          <Button
            ref={setLoadMoreButtonRef}
            sx={{
              variant: 'buttons.inverted',
              gridColumn: '1 / -1',
              mx: 'auto',
              width: ['calc(100vw - 30px)', null, '30vw'],
              position: 'absolute',
              bottom: [5, null, evenNumberCards ? 5 : 8],
              left: '50%',
              transform: 'translateX(-50%)',
            }}
            onClick={toggleShowAllCards}
          >
            {showAllCards ? 'Close' : 'See More'}
          </Button>
        </Grid>
      </Container>
    </AnchorSection>
  );
};

export default TreeHistoryBlock;
