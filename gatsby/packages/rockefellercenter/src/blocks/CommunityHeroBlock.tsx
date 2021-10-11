/**@jsx jsx */
import {jsx, Section, Container, GalleryCarousel} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import IntroText from '~components/IntroText';
import invariant from 'invariant';

const COMMUNITY_HERO_QUERY = graphql`
  query CommunityHero {
    dataJson(id: {eq: "community"}) {
      communityHero {
        title
        caption
        image {
          src {
            fluid(maxWidth: 1136, cropFocus: CENTER) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
          alt
        }
      }
    }
  }
`;

const CommunityHeroBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.CommunityHeroQuery>(
    COMMUNITY_HERO_QUERY,
  );

  invariant(dataJson, 'Community JSON data is required!');

  const communityHeroProps = useMemo(() => {
    return {
      title: dataJson.communityHero.title,
      caption: dataJson.communityHero.caption,
      fluid: dataJson.communityHero.image.src.fluid,
      alt: dataJson.communityHero.image.alt,
    };
  }, [dataJson]);

  return (
    communityHeroProps && (
      <Section {...props}>
        <Container sx={{py: 4}}>
          <IntroText
            title={communityHeroProps.title}
            caption={communityHeroProps.caption}
            desktopOrientation="row"
            center={true}
            sx={{
              'h1, h2, h3, h4, h5, h6': {
                fontFamily: 'heading',
                fontSize: [7, 8, 9],
              },
              mx: 'auto',
              mb: [4, null, 9],
              mt: [0, null, 6],
            }}
          />
          <GalleryCarousel
            cards={[
              {
                fluid: communityHeroProps.fluid,
                alt: communityHeroProps.alt,
              },
            ]}
          />
        </Container>
      </Section>
    )
  );
};

export default CommunityHeroBlock;
