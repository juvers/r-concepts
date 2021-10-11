/** @jsx jsx */
import {
  jsx,
  Section,
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

const ART_AND_HISTORY_HISTORY_QUERY = graphql`
  query ArtandHistoryHistory {
    dataJson(id: {eq: "art-and-history"}) {
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

const ArtandHistoryHistoryBlock = (
  props: Omit<ComponentPropsWithoutRef<typeof Section>, 'children'>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.ArtandHistoryHistoryQuery>(
    ART_AND_HISTORY_HISTORY_QUERY,
  );

  invariant(dataJson, 'Art & History JSON data is required');

  const historyProps = useMemo(() => {
    return {
      title: dataJson.history.title,
      caption: dataJson.history.caption,
      cards: dataJson.history.cards.map((card) => {
        return {
          type: card.type as HISTORY_CARD_TYPES,
          title: card.title,
          caption: card.caption,
          fluid: card.image.src.fluid,
          alt: card.image.alt,
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
    <Section {...props} ref={sectionRef}>
      <Container
        sx={{
          ...historySectionLine,
        }}
      >
        <Grid
          sx={{
            pt: [5, null, 8],
            pb: [9, null, 0],
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
            // TODO: Remove this temp hack to to match design of only three history cards
            historyProps.cards.slice(0, 3).map(
              (card, index): JSX.Element => {
                return (
                  <HistoryCard
                    isEven={index % 2 === 0}
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
              bottom: [5, null, 8],
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <Link
              href={'/history'}
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
              Explore RC History
            </Link>
          </Box>
        </Grid>
      </Container>
    </Section>
  );
};

export default ArtandHistoryHistoryBlock;
