/**@jsx jsx */
import {jsx, Section, Container, GalleryCarousel} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import IntroText from '~components/IntroText';
import invariant from 'invariant';

const WORKING_COMMUNITY_INTRO_QUERY = graphql`
  query WorkingCommunityIntro {
    dataJson(id: {eq: "working-community"}) {
      workingCommunityHero {
        title
        caption
        image {
          src {
            fluid(maxWidth: 1200) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
          alt
        }
      }
    }
  }
`;

const WorkingCommunityIntroBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.WorkingCommunityIntroQuery>(
    WORKING_COMMUNITY_INTRO_QUERY,
  );

  invariant(dataJson, 'Working Community JSON data is required');

  const workingCommunityIntroData = useMemo(() => {
    return {
      title: dataJson.workingCommunityHero.title,
      caption: dataJson.workingCommunityHero.caption,
      fluid: dataJson.workingCommunityHero.image.src.fluid,
      alt: dataJson.workingCommunityHero.image.alt,
    };
  }, [dataJson]);

  return (
    <Section {...props}>
      <Container sx={{pt: 4, pb: [6, 8]}}>
        <IntroText
          title={workingCommunityIntroData.title}
          caption={workingCommunityIntroData.caption}
          desktopOrientation="row"
          center={true}
          sx={{
            ...{
              'h1, h2, h3, h4, h5, h6': {
                fontFamily: 'heading',
                fontSize: [7, 8, 9],
                mb: 3,
              },
            },
            mx: 'auto',
            mb: [4, null, 6],
            mt: [0, null, 6],
          }}
        />
        <GalleryCarousel
          cards={[
            {
              fluid: workingCommunityIntroData.fluid,
              alt: workingCommunityIntroData.alt,
            },
          ]}
        />
      </Container>
    </Section>
  );
};

export default WorkingCommunityIntroBlock;
