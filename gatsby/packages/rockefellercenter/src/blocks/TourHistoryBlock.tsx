/** @jsx jsx */
import {
  jsx,
  AnchorSection,
  Container,
  Grid,
  Box,
  Text,
  Link,
  useHistorySectionLine,
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

const ROCK_CENTER_TOUR_HISTORY_QUERY = graphql`
  query RockCenterTourHistory {
    dataJson(id: {eq: "rockefeller-center-tour"}) {
      history {
        title
        caption
        cards {
          type
          title
          caption
          image {
            src {
              fluid(maxWidth: 700) {
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

const TourHistoryBlock = (
  props: Omit<ComponentPropsWithoutRef<typeof AnchorSection>, 'children'>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.RockCenterTourHistoryQuery>(
    ROCK_CENTER_TOUR_HISTORY_QUERY,
  );

  invariant(dataJson, 'Tour JSON data is required!');

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
  const [{width: sectionWidth}, sectionRef] = useSize();

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

  return (
    <AnchorSection {...props} ref={sectionRef}>
      <Container>
        <H
          sx={{
            variant: 'text.heroTitleSmall',
            fontFamily: 'headingSecondary',
            mb: 4,
          }}
        >
          On the Tour
        </H>
      </Container>
      <Container
        sx={{
          ...historySectionLine,
          mb: [5, 8],
        }}
      >
        <Grid
          sx={{
            pt: [5, null, 8],
            pb: [6, null, 5],
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
          {historyProps.cards &&
            historyProps.cards.map(
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
          {/*
            Note this is special case for Rock Center Tour Page
            Instead of load more, its a link to another page
          */}
          <Box
            ref={setLoadMoreButtonRef}
            sx={{
              gridColumn: '1 / -1',
              mx: 'auto',
              width: ['calc(100vw - 30px)', null, '30vw'],
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%) !important',
            }}
          >
            <Link
              href={'/buy-tickets/#rockefeller-center-tour'}
              variant="buttonInverted"
              sx={{
                display: 'inline-block',
                textAlign: 'center',
                width: '100%',
                px: 1,
                '&:hover': {
                  bg: 'primary',
                },
              }}
            >
              Buy Tickets to Learn More
            </Link>
          </Box>
        </Grid>
      </Container>
    </AnchorSection>
  );
};

export default TourHistoryBlock;
