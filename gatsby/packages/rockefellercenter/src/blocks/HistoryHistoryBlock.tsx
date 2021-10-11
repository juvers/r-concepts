/** @jsx jsx */
import {
  jsx,
  Section,
  Container,
  Grid,
  useHistorySectionLine,
  useToggleHistoryCards,
  HistoryCard,
  HISTORY_CARD_TYPES,
} from '@tishman/components';
import {useStaticQuery, graphql} from 'gatsby';
import {useMemo, useRef} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import useSize from '@hzdg/use-size';
import useRefCallback from '@hzdg/use-ref-callback';
import invariant from 'invariant';

const HISTORY_HISTORY_QUERY = graphql`
  query HistoryHistory {
    dataJson(id: {eq: "history"}) {
      history {
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

const HistoryHistoryBlock = (
  props: Omit<ComponentPropsWithoutRef<typeof Section>, 'children'>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.HistoryHistoryQuery>(
    HISTORY_HISTORY_QUERY,
  );

  invariant(dataJson, 'History JSON data is required!');

  const historyProps = useMemo(() => {
    return {
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

  const [
    {
      borderBoxSize: {blockSize: titleHeight},
    },
  ] = useSize();

  // Get width section to be used for useHistoryTitleLine
  // useWindowWidth did not work in docs playground
  const sectionRef = useRef(null);
  const [, setSectionRef] = useRefCallback(null, sectionRef);
  const {width: sectionWidth} = useSize(sectionRef);

  // grid gap values provided to get title card height
  const gridGapHeight = 50;
  const gridGapWidth = 200;
  const titleCardHeight = titleHeight + gridGapHeight;

  // if load more button exists,
  // bottom of historySectionLine line
  // should be top top of button, else draw to bottom of section
  const loadMoreButtonRef = useRef(null);
  const historySectionLine = useHistorySectionLine(loadMoreButtonRef);

  const {cardsToShow} = useToggleHistoryCards({
    allCards: historyProps.cards,
    initialCardsToShow: 25,
    scrollToRef: sectionRef,
  });

  // styling conditional. if even number cards we need to add
  // change bottom padding to match designs
  const evenNumberCards = cardsToShow.length % 2 === 0;

  return (
    <Section ref={setSectionRef} {...props}>
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
            '> div:nth-of-type(odd)': {
              justifySelf: 'flex-end',
              transform: [
                'translateY(0)',
                null,
                `translateY(-${titleCardHeight}px)`,
              ],
            },
          }}
        >
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
        </Grid>
      </Container>
    </Section>
  );
};

export default HistoryHistoryBlock;
