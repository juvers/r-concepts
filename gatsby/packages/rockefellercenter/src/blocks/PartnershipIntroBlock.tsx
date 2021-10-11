/**@jsx jsx */
import {jsx, Section, Container, GalleryCarousel} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import IntroText from '~components/IntroText';
import invariant from 'invariant';

const PARTNERSHIP_INTRO_QUERY = graphql`
  query PartnershipIntro {
    dataJson(id: {eq: "partnerships"}) {
      partnershipIntroText {
        title
        caption
        image {
          src {
            fluid(quality: 100, maxWidth: 2160) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
          alt
        }
      }
    }
  }
`;

const PartnershipIntroBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.PartnershipIntroQuery>(
    PARTNERSHIP_INTRO_QUERY,
  );

  invariant(dataJson, 'Partnership JSON data is required!');

  const partnershipIntroData = useMemo(() => {
    return {
      title: dataJson.partnershipIntroText.title,
      caption: dataJson.partnershipIntroText.caption,
      fluid: dataJson.partnershipIntroText.image.src.fluid,
    };
  }, [dataJson]);

  return (
    partnershipIntroData && (
      <Section {...props}>
        <Container sx={{py: 4, px: [0, 0, 0], maxWidth: 1280}}>
          <IntroText
            title={partnershipIntroData?.title}
            caption={partnershipIntroData?.caption}
            desktopOrientation="row"
            center={true}
            sx={{
              ...{
                'h1, h2, h3, h4, h5, h6': {
                  fontFamily: 'heading',
                  fontSize: [7, 8, 9],
                  flexBasis: '53%',
                },
              },
              p: {
                px: 4,
              },
              fontSize: 3,
              mx: 'auto',
              px: [3, null, 6],
              mb: [4, null, 5],
              mt: [0, null, 5],
            }}
          />
          <GalleryCarousel
            cards={[
              {
                fluid: dataJson.partnershipIntroText.image.src.fluid,
                alt: 'Mock image 2 alt',
              },
            ]}
          />
        </Container>
      </Section>
    )
  );
};

export default PartnershipIntroBlock;
