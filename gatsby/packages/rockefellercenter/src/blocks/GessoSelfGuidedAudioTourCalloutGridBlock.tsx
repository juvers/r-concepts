/** @jsx jsx */
import {
  jsx,
  AnchorSection,
  Section,
  Container,
  CalloutGridCardFull,
  CalloutGrid,
  CalloutGridCard,
  Flex,
  FooterAppDownload,
} from '@tishman/components';
import type {ComponentPropsWithoutRef} from 'react';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';

const GESSO_CALLOUT_GRID_QUERY = graphql`
  query gessoCalloutGrid {
    sanityGessoAudioTour {
      ctaCard {
        title
        description
        link1 {
          url
          label: caption
        }
        link2 {
          url
          label: caption
        }
        photo {
          asset {
            fluid(maxWidth: 700) {
              ...GatsbySanityImageFluid
            }
          }
          alt
          caption
        }
      }
      ctaCards {
        title
        description
        photo {
          asset {
            fluid {
              ...GatsbySanityImageFluid
            }
          }
          alt
          caption
        }
        link1 {
          url
          label: caption
        }
        link2 {
          url
          label: caption
        }
      }
    }
    dataJson(id: {eq: "gesso"}) {
      footerAppDownloadData {
        appStore {
          link
          image {
            fluid {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
        googlePlay {
          link
          image {
            fluid {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }
    }
  }
`;

const GessoSelfGuidedAudioTourCalloutGridBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    sanityGessoAudioTour,
    dataJson,
  } = useStaticQuery<GatsbyTypes.gessoCalloutGridQuery>(
    GESSO_CALLOUT_GRID_QUERY,
  );

  const gessoCalloutGridProps = useMemo(() => {
    if (!dataJson)
      throw new Error('Gesso callout grid full card data is required!');
    return {
      fullCard: {
        index: 0,
        fluid: sanityGessoAudioTour?.ctaCard?.photo?.asset?.fluid,
        alt: sanityGessoAudioTour?.ctaCard?.photo?.alt as string,
        caption: sanityGessoAudioTour?.ctaCard?.photo?.caption,
        title: sanityGessoAudioTour?.ctaCard?.title as string,
        description: sanityGessoAudioTour?.ctaCard?.description as string,
        links: [
          sanityGessoAudioTour?.ctaCard?.link1,
          sanityGessoAudioTour?.ctaCard?.link2,
        ].map((link, index) =>
          link?.url !== null
            ? ((link as unknown) as {url: string; label: string})
            : {url: index + '', label: ''},
        ),
      },
      cards: sanityGessoAudioTour?.ctaCards?.map((card, index) => ({
        index: index,
        fluid: card?.photo?.asset?.fluid,
        alt: card?.photo?.alt as string,
        title: card?.title as string,
        caption: card?.photo?.caption,
        description: card?.description as string,
        links: [card?.link1, card?.link2].map((link) =>
          link?.url !== null
            ? ((link as unknown) as {url: string; label: string})
            : {url: index + '', label: ''},
        ),
      })),
      appStore: {
        link: dataJson?.footerAppDownloadData.appStore.link,
        image: dataJson?.footerAppDownloadData.appStore.image.fluid,
      },
      googlePlay: {
        link: dataJson?.footerAppDownloadData.googlePlay.link,
        image: dataJson?.footerAppDownloadData.googlePlay.image.fluid,
      },
    };
  }, [dataJson, sanityGessoAudioTour]);

  return (
    <Section {...props}>
      <Container sx={{py: 7}}>
        <AnchorSection id="self-guided-audio-tour">
          {gessoCalloutGridProps.fullCard && (
            <CalloutGridCardFull
              {...gessoCalloutGridProps.fullCard}
              sx={{mb: [-5, -4]}}
            />
          )}
          <Flex sx={{justifyContent: ['center', 'flex-start', 'flex-end']}}>
            <Flex
              sx={{
                justifyContent: ['center', 'flex-start', 'flex-start'],
                flex: [null, '0 0 50%'],
                pl: [0, 16],
              }}
            >
              <FooterAppDownload
                appStore={gessoCalloutGridProps.appStore}
                googlePlay={gessoCalloutGridProps.googlePlay}
              />
            </Flex>
          </Flex>
        </AnchorSection>
        <AnchorSection id="redevelopment-and-retail">
          {gessoCalloutGridProps.cards && (
            <CalloutGrid
              hideOffset
              sx={{
                '> div:nth-of-type(even)': {
                  mb: 150,
                },
                mb: [0, null, 0],
                mt: [54, 70],
              }}
            >
              {gessoCalloutGridProps.cards.map((card) => (
                <CalloutGridCard key={card.index} {...card} />
              ))}
            </CalloutGrid>
          )}
        </AnchorSection>
      </Container>
    </Section>
  );
};

export default GessoSelfGuidedAudioTourCalloutGridBlock;
