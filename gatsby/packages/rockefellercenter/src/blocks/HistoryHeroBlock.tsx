/**@jsx jsx */
import {jsx, Section, Container, GalleryCarousel} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import IntroText from '~components/IntroText';
import invariant from 'invariant';

const HISTORY_HERO_QUERY = graphql`
  query HistoryHero {
    dataJson(id: {eq: "history"}) {
      historyHero {
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
      }
    }
  }
`;

const HistoryHeroBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.HistoryHeroQuery>(
    HISTORY_HERO_QUERY,
  );

  invariant(dataJson, 'History JSON data is required!');

  const historyHeroProps = useMemo(() => {
    return {
      title: dataJson.historyHero.title,
      caption: dataJson.historyHero.caption,
      fluid: dataJson.historyHero.image.src.fluid,
      alt: dataJson.historyHero.image.alt,
    };
  }, [dataJson]);

  return (
    historyHeroProps && (
      <Section {...props}>
        <Container sx={{py: 4}}>
          <IntroText
            title={historyHeroProps.title}
            caption={historyHeroProps.caption}
            desktopOrientation="row"
            center={false}
            sx={{
              ...{
                'h1, h2, h3, h4, h5, h6': {
                  fontFamily: 'heading',
                  fontSize: [7, 8, 9],
                  maxWidth: '450px',
                  mb: [null, 0],
                },
              },
              ...{
                p: {
                  pt: [1, null, 2],
                },
              },
              mx: 'auto',
              mb: [4, null, 6],
              mt: [0, null, 4],
            }}
          />
          <GalleryCarousel
            cards={[
              {
                fluid: historyHeroProps.fluid,
                alt: historyHeroProps.alt,
              },
            ]}
          />
        </Container>
      </Section>
    )
  );
};

export default HistoryHeroBlock;
