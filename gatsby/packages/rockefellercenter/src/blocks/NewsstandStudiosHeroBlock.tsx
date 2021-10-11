/** @jsx jsx */
import {GalleryCarousel, jsx, Section, Container} from '@tishman/components';
import IntroText from '~components/IntroText';
import {graphql, useStaticQuery} from 'gatsby';
import invariant from 'invariant';

const NEWSSTAND_STUDIOS_HERO_QUERY = graphql`
  query NewsstandStudiosHero {
    dataJson(id: {eq: "newsstand-studios"}) {
      heroCluster {
        image {
          src {
            fluid {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
          alt
        }
        title
        caption
      }
    }
  }
`;

const NewsstandStudiosHeroBlock = (): JSX.Element => {
  const results = useStaticQuery<GatsbyTypes.NewsstandStudiosHeroQuery>(
    NEWSSTAND_STUDIOS_HERO_QUERY,
  );

  const heroCluster = results?.dataJson?.heroCluster;
  invariant(heroCluster, 'Newsstand Studios hero json data missing');

  return (
    <Section>
      <Container sx={{pt: 3, pb: 2, px: [3, 5, 7, 9], maxWidth: 'content'}}>
        <IntroText
          title={heroCluster.title}
          caption={heroCluster.caption || ''}
          desktopOrientation="row"
          center={true}
          sx={{
            'h1, h2, h3, h4, h5, h6': {
              fontFamily: 'heading',
              fontSize: [7, 8, 9],
            },
            p: {
              fontSize: [2, null, 3],
            },
            mx: 'auto',
            mb: [0, null, 2],
            mt: [0, null, 4],
          }}
        />
      </Container>
      <Container sx={{py: 4, px: [0, 3, 5, 7], maxWidth: 1280}}>
        <GalleryCarousel
          cards={[
            {
              fluid: heroCluster.image.src.fluid,
              alt: heroCluster.image.alt,
            },
          ]}
        />
      </Container>
    </Section>
  );
};

export default NewsstandStudiosHeroBlock;
