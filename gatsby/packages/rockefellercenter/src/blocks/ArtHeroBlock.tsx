/** @jsx jsx */
import {jsx, Section, Container} from '@tishman/components';
import {useStaticQuery, graphql} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import IntroText from '~components/IntroText';
import invariant from 'invariant';

const ART_HERO_QUERY = graphql`
  query ArtHero {
    dataJson(id: {eq: "art"}) {
      artHero {
        title
        bodyCopy
      }
    }
  }
`;

const ArtHeroBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.ArtHeroQuery>(ART_HERO_QUERY);

  invariant(dataJson, 'Art JSON data is required');
  const artHeroProps = useMemo(() => {
    const heroText = {
      title: dataJson.artHero.title,
      caption: dataJson.artHero.bodyCopy,
    };

    return {
      heroText,
    };
  }, [dataJson]);

  return (
    artHeroProps && (
      <Section {...props}>
        <Container
          sx={{
            display: 'flex',
            flexDirection: ['column', null, 'row'],
            justifyContent: 'space-between',
            pt: [5, null, 6],
            pb: [6, null, 64],
            px: [3, 5],
          }}
        >
          <IntroText {...artHeroProps.heroText} />
        </Container>
      </Section>
    )
  );
};

export default ArtHeroBlock;
