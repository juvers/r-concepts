/**@jsx jsx */
import {
  jsx,
  Section,
  Container,
  CalloutGrid,
  CalloutGridCard,
  CalloutGridCardProps,
  CalloutGridCardFullWidth,
} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';

const ONLY_HERE_CALLOUT_GRID_QUERY = graphql`
  query OnlyHereCalloutGrid {
    allSanityAttractionOnlyHere {
      edges {
        node {
          id
          heroCTA {
            title
            bodyCopy
          }
          calloutGridCardFullWidth1 {
            title
            description
            link {
              url
              caption
            }
            image {
              align
              alt
              asset {
                fluid {
                  ...GatsbySanityImageFluid
                }
              }
            }
          }
          calloutGridCardFullWidth2 {
            title
            description
            image {
              align
              alt
              asset {
                fluid {
                  ...GatsbySanityImageFluid
                }
              }
            }
            link {
              url
              caption
            }
          }
          calloutGridCardFullWidth3 {
            title
            description
            image {
              alt
              align
              asset {
                fluid {
                  ...GatsbySanityImageFluid
                }
              }
            }
            link {
              caption
              url
            }
          }
          calloutGridCards1 {
            title
            description
            image {
              alt
              asset {
                fluid {
                  ...GatsbySanityImageFluid
                }
              }
            }
            link {
              url
              caption
            }
          }
          calloutGridCards2 {
            title
            description
            link {
              url
              caption
            }
            image {
              alt
              asset {
                fluid {
                  ...GatsbySanityImageFluid
                }
              }
            }
          }
          calloutGridCards3 {
            title
            description
            link {
              url
              caption
            }
            image {
              alt
              asset {
                fluid {
                  ...GatsbySanityImageFluid
                }
              }
            }
          }
        }
      }
    }
  }
`;

const OnlyHereCalloutGridBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const data = useStaticQuery(
    // useStaticQuery<GatsbyTypes.OnlyHereQueryONLY_HERE_CALLOUT_GRID_QUERY>(
    ONLY_HERE_CALLOUT_GRID_QUERY,
  );
  const gridData = data.allSanityAttractionOnlyHere.edges[0].node;

  const onlyHereCalloutGridData = useMemo(() => {
    const cardsOne = gridData?.calloutGridCards1?.map(
      (
        card: {
          image: {asset: {fluid: string}; alt: string};
          title: string;
          description: string;
          link: {url: string; caption: string};
        },
        index: number,
      ) => {
        return {
          index: index,
          fluid: card?.image?.asset?.fluid,
          alt: card?.image.alt,
          title: card?.title,
          description: card?.description,
          links: [
            {
              url: card?.link.url,
              label: card?.link.caption,
            },
          ],
        };
      },
    );

    const cardsTwo = gridData?.calloutGridCards2?.map(
      (
        card: {
          image: {asset: {fluid: string}; alt: string};
          title: string;
          description: string;
          link: {url: string; caption: string};
        },
        index: number,
      ) => {
        return {
          index: index,
          fluid: card?.image?.asset?.fluid,
          alt: card?.image.alt,
          title: card?.title,
          description: card?.description,
          links: [
            {
              url: card?.link.url,
              label: card?.link.caption,
            },
          ],
        };
      },
    );

    const cardsThree = gridData?.calloutGridCards3?.map(
      (
        card: {
          image: {asset: {fluid: string}; alt: string};
          title: string;
          description: string;
          link: {url: string; caption: string};
        },
        index: number,
      ) => {
        return {
          index: index,
          fluid: card?.image?.asset?.fluid,
          alt: card?.image.alt,
          title: card?.title,
          description: card?.description,
          links: [
            {
              url: card?.link.url,
              label: card?.link.caption,
            },
          ],
        };
      },
    );

    const fullWidthCard1 = {
      index: 0,
      fluid: gridData?.calloutGridCardFullWidth1?.image?.asset?.fluid,
      alt: gridData.calloutGridCardFullWidth1?.image.alt,
      title: gridData.calloutGridCardFullWidth1?.title,
      description: gridData.calloutGridCardFullWidth1?.description,
      align: gridData?.calloutGridCardFullWidth1?.image?.align,
      links: [
        {
          url: gridData.calloutGridCardFullWidth1?.link.url,
          label: gridData.calloutGridCardFullWidth1?.link.caption,
        },
      ],
    };
    const fullWidthCard2 = {
      index: 1,
      fluid: gridData?.calloutGridCardFullWidth2?.image?.asset?.fluid,
      alt: gridData.calloutGridCardFullWidth2?.image.alt,
      title: gridData.calloutGridCardFullWidth2?.title,
      description: gridData.calloutGridCardFullWidth2?.description,
      align: gridData?.calloutGridCardFullWidth2?.image?.align,
      links: [
        {
          url: gridData.calloutGridCardFullWidth2?.link.url,
          label: gridData.calloutGridCardFullWidth2?.link.caption,
        },
      ],
    };
    const fullWidthCard3 = {
      index: 2,
      fluid: gridData?.calloutGridCardFullWidth3?.image?.asset?.fluid,
      alt: gridData.calloutGridCardFullWidth3?.image.alt,
      title: gridData.calloutGridCardFullWidth3?.title,
      description: gridData.calloutGridCardFullWidth3?.description,
      align: gridData?.calloutGridCardFullWidth3?.image?.align,
      links: [
        {
          url: gridData.calloutGridCardFullWidth3?.link.url,
          label: gridData.calloutGridCardFullWidth3?.link.caption,
        },
      ],
    };

    return {
      cardsOne: cardsOne,
      cardsTwo: cardsTwo,
      cardsThree: cardsThree,
      fullCard1: fullWidthCard1,
      fullCard2: fullWidthCard2,
      fullCard3: fullWidthCard3,
    };
  }, [gridData]);

  return (
    onlyHereCalloutGridData && (
      <Section {...props}>
        <CalloutGridCardFullWidth {...onlyHereCalloutGridData?.fullCard1} />
        <Container
          sx={{pb: ['24px', '24px', '40px'], pt: ['40px', '56px', '72px']}}
        >
          <CalloutGrid>
            {onlyHereCalloutGridData?.cardsOne?.map(
              (card: CalloutGridCardProps): JSX.Element => (
                <CalloutGridCard key={card.index} {...card} />
              ),
            )}
          </CalloutGrid>
        </Container>
        <CalloutGridCardFullWidth {...onlyHereCalloutGridData?.fullCard2} />
        <Container
          sx={{pb: ['24px', '24px', '40px'], pt: ['40px', '56px', '72px']}}
        >
          <CalloutGrid>
            {onlyHereCalloutGridData?.cardsTwo?.map(
              (card: CalloutGridCardProps): JSX.Element => (
                <CalloutGridCard key={card.index} {...card} />
              ),
            )}
          </CalloutGrid>
        </Container>
        <CalloutGridCardFullWidth {...onlyHereCalloutGridData?.fullCard3} />
        <Container
          sx={{pb: ['24px', '24px', '40px'], pt: ['40px', '56px', '72px']}}
        >
          <CalloutGrid>
            {onlyHereCalloutGridData?.cardsThree?.map(
              (card: CalloutGridCardProps): JSX.Element => (
                <CalloutGridCard key={card.index} {...card} />
              ),
            )}
          </CalloutGrid>
        </Container>
      </Section>
    )
  );
};

export default OnlyHereCalloutGridBlock;
