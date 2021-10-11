/** @jsx jsx */
import {jsx, Section, Container} from '@tishman/components';
import IntroText from '~components/IntroText';
import {graphql, useStaticQuery} from 'gatsby';
import invariant from 'invariant';

const NEWS_AND_UPDATES_HERO_QUERY = graphql`
  query NewsAndUpdatesHero {
    dataJson(id: {eq: "news-and-updates"}) {
      heroText
    }
  }
`;

const NewsAndUpdatesHeroBlock = (): JSX.Element => {
  const results = useStaticQuery<GatsbyTypes.NewsAndUpdatesHeroQuery>(
    NEWS_AND_UPDATES_HERO_QUERY,
  );

  const heroText = results?.dataJson?.heroText;
  invariant(heroText, 'Newsstand Studios hero json data missing');

  return (
    <Section>
      <Container sx={{py: 0, px: [3, 5, 7, 9], maxWidth: 'content'}}>
        <IntroText
          caption={heroText}
          center={true}
          sx={{
            p: {
              fontSize: [2, null, 3],
            },
            mx: 'auto',
            mb: [0, null, 4],
            mt: [0, null, 2],
          }}
        />
      </Container>
    </Section>
  );
};

export default NewsAndUpdatesHeroBlock;
