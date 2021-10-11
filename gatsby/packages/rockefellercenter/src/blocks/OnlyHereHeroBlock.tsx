/**@jsx jsx */
import {jsx, Section, Container} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import IntroText from '~components/IntroText';
import invariant from 'invariant';

const ONLY_HERE_INTRO_TEXT_QUERY = graphql`
  query OnlyHereHero {
    dataJson(id: {eq: "only-here"}) {
      onlyHereHero {
        title
        caption
      }
    }
  }
`;

const OnlyHereHeroBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.OnlyHereHeroQuery>(
    ONLY_HERE_INTRO_TEXT_QUERY,
  );

  invariant(dataJson, 'Only Here Hero JSON data is required!');

  const onlyHereHeroData = useMemo(() => {
    return {
      title: dataJson.onlyHereHero?.title,
      caption: dataJson.onlyHereHero?.caption,
    };
  }, [dataJson]);

  // Responsive

  return (
    onlyHereHeroData && (
      <Section {...props}>
        <Container sx={{py: 4, pb: '24px'}}>
          <IntroText
            title={onlyHereHeroData?.title}
            caption={onlyHereHeroData?.caption}
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
              mb: ['24px', null, '40px'],
              mt: [0, null, 6],
            }}
          />
        </Container>
      </Section>
    )
  );
};

export default OnlyHereHeroBlock;
