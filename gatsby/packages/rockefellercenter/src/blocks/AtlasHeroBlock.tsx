/** @jsx jsx */
import {jsx, Section, Container} from '@tishman/components';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {useStaticQuery, graphql} from 'gatsby';
import IntroText from '~components/IntroText';
import invariant from 'invariant';

const ATLAS_HERO_QUERY = graphql`
  query AtlasHero {
    dataJson(id: {eq: "atlas"}) {
      intro
    }
  }
`;

const AtlasHeroBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.AtlasHeroQuery>(
    ATLAS_HERO_QUERY,
  );

  invariant(dataJson, 'Atlas JSON data is required!');

  const atlasHeroProps = useMemo(() => {
    return {caption: dataJson.intro};
  }, [dataJson]);

  return (
    atlasHeroProps && (
      <Section {...props}>
        <Container pt={[3, 4]}>
          <IntroText center={true} sx={{mx: 'auto'}} {...atlasHeroProps} />
        </Container>
      </Section>
    )
  );
};

export default AtlasHeroBlock;
