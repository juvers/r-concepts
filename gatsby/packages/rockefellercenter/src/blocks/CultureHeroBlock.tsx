/**@jsx jsx */
import {jsx, Section, Container, GalleryCarousel} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import IntroText from '~components/IntroText';
import invariant from 'invariant';

const CULTURE_HERO_QUERY = graphql`
  query CultureHero {
    dataJson(id: {eq: "culture"}) {
      cultureHero {
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

const CultureHeroBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.CultureHeroQuery>(
    CULTURE_HERO_QUERY,
  );

  invariant(dataJson, 'Culture JSON data is required!');

  const cultureHeroProps = useMemo(() => {
    return {
      title: dataJson.cultureHero.title,
      caption: dataJson.cultureHero.caption,
      fluid: dataJson.cultureHero.image.src.fluid,
      alt: dataJson.cultureHero.image.alt,
    };
  }, [dataJson]);

  return (
    cultureHeroProps && (
      <Section {...props}>
        <Container sx={{py: 4}}>
          <IntroText
            title={cultureHeroProps.title}
            caption={cultureHeroProps.caption}
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
          <GalleryCarousel
            cards={[
              {
                fluid: cultureHeroProps.fluid,
                alt: cultureHeroProps.alt,
              },
            ]}
          />
        </Container>
      </Section>
    )
  );
};

export default CultureHeroBlock;
