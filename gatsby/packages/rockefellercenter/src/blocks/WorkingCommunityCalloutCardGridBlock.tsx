/**@jsx jsx */
import {
  jsx,
  Section,
  Container,
  CalloutGrid,
  CalloutGridCard,
  CalloutGridCardProps,
  Box,
  Text,
  Flex,
  Link,
} from '@tishman/components';
import Img from 'gatsby-image';
import {H} from '@hzdg/sectioning';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const WORKING_COMMUNITY_CALLOUT_GRID_QUERY = graphql`
  query WorkingCommunityCalloutGrid {
    dataJson(id: {eq: "working-community"}) {
      workingCommunityCalloutGrid {
        cards {
          title
          caption
          description
          image {
            src {
              fluid(maxWidth: 1200) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
            alt
          }
        }
        appDownloadCard {
          title
          caption
          downloadText
          link {
            url
            label
          }
          appDownloadData {
            appStore {
              link
              image {
                src {
                  fluid {
                    ...GatsbyImageSharpFluid_withWebp
                  }
                }
                alt
              }
            }
            googlePlay {
              link
              image {
                src {
                  fluid {
                    ...GatsbyImageSharpFluid_withWebp
                  }
                }
                alt
              }
            }
          }
        }
      }
    }
  }
`;

const imgStyle = {
  width: ['131px', '181px'],
  height: ['50px', '69px'],
};

const WorkingCommunityCalloutCardGridBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    dataJson,
  } = useStaticQuery<GatsbyTypes.WorkingCommunityCalloutGridQuery>(
    WORKING_COMMUNITY_CALLOUT_GRID_QUERY,
  );

  invariant(dataJson, 'Working Community JSON data is required');

  const workingCommunityCalloutCardGridProps = useMemo(() => {
    const cards = dataJson.workingCommunityCalloutGrid.cards.map(
      (card, index?: number) => {
        return {
          index: index ?? 0,
          title: card.title,
          caption: card.caption,
          description: card.description,
          alt: card.image.alt,
          fluid: card.image.src.fluid,
        };
      },
    );

    return {
      cards,
      appDownloadCard: {
        title: dataJson.workingCommunityCalloutGrid.appDownloadCard.title,
        caption: dataJson.workingCommunityCalloutGrid.appDownloadCard.caption,
        downloadText:
          dataJson.workingCommunityCalloutGrid.appDownloadCard.downloadText,
        link: {
          url: dataJson.workingCommunityCalloutGrid.appDownloadCard.link.url,
          label:
            dataJson.workingCommunityCalloutGrid.appDownloadCard.link.label,
        },
        appStore: {
          link:
            dataJson.workingCommunityCalloutGrid.appDownloadCard.appDownloadData
              .appStore.link,
          image: {
            fluid:
              dataJson.workingCommunityCalloutGrid.appDownloadCard
                .appDownloadData.appStore.image.src.fluid,
            alt:
              dataJson.workingCommunityCalloutGrid.appDownloadCard
                .appDownloadData.appStore.image.alt,
          },
        },
        googlePlay: {
          link:
            dataJson.workingCommunityCalloutGrid.appDownloadCard.appDownloadData
              .googlePlay.link,
          image: {
            fluid:
              dataJson.workingCommunityCalloutGrid.appDownloadCard
                .appDownloadData.googlePlay.image.src.fluid,
            alt:
              dataJson.workingCommunityCalloutGrid.appDownloadCard
                .appDownloadData.googlePlay.image.alt,
          },
        },
      },
    };
  }, [dataJson]);

  return (
    <Section {...props}>
      <Container sx={{py: 4, mb: 0}}>
        <CalloutGrid sx={{mb: [0, null, 0]}}>
          {workingCommunityCalloutCardGridProps.cards.map(
            (card: CalloutGridCardProps): JSX.Element => (
              <CalloutGridCard key={card.index} {...card} />
            ),
          )}
          <Box
            sx={{
              maxWidth: 364,
              mb: 2,
              mx: 'auto',
            }}
          >
            <Box my={[3, 4]} mx={2}>
              <H
                sx={{
                  mb: [2, 3],
                  variant: 'styles.h1',
                  fontFamily: 'headingSecondary',
                  fontSize: [6, 9],
                }}
              >
                {workingCommunityCalloutCardGridProps.appDownloadCard.title}
              </H>
              <Text pb={4}>
                {workingCommunityCalloutCardGridProps.appDownloadCard.caption}
              </Text>
              <Text pb={2} variant="smallP" sx={{fontWeight: 500}}>
                {
                  workingCommunityCalloutCardGridProps.appDownloadCard
                    .downloadText
                }
              </Text>
              <Flex>
                <Link
                  to={
                    workingCommunityCalloutCardGridProps.appDownloadCard
                      .appStore.link
                  }
                  sx={{mr: 4}}
                >
                  <Img
                    sx={imgStyle}
                    key="apple"
                    fluid={
                      workingCommunityCalloutCardGridProps.appDownloadCard
                        .appStore.image.fluid
                    }
                    alt={
                      workingCommunityCalloutCardGridProps.appDownloadCard
                        .appStore.image.alt
                    }
                  />
                </Link>
                <Link
                  to={
                    workingCommunityCalloutCardGridProps.appDownloadCard
                      .googlePlay.link
                  }
                >
                  <Img
                    sx={imgStyle}
                    key="google"
                    fluid={
                      workingCommunityCalloutCardGridProps.appDownloadCard
                        .googlePlay.image.fluid
                    }
                    alt={
                      workingCommunityCalloutCardGridProps.appDownloadCard
                        .googlePlay.image.alt
                    }
                  />
                </Link>
              </Flex>
              <Flex mt={[3, 4]}>
                <Link
                  variant={'underline'}
                  key={
                    workingCommunityCalloutCardGridProps.appDownloadCard.link
                      .url
                  }
                  href={
                    workingCommunityCalloutCardGridProps.appDownloadCard.link
                      .url
                  }
                >
                  {
                    workingCommunityCalloutCardGridProps.appDownloadCard.link
                      .label
                  }
                </Link>
              </Flex>
            </Box>
          </Box>
        </CalloutGrid>
      </Container>
    </Section>
  );
};

export default WorkingCommunityCalloutCardGridBlock;
