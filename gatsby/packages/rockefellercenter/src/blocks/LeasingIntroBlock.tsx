/**@jsx jsx */
import {jsx, Section, Container} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import IntroText from '~components/IntroText';
import invariant from 'invariant';

const LEASING_INTRO_QUERY = graphql`
  query LeasingIntro {
    dataJson(id: {eq: "leasing"}) {
      leasingIntro {
        title
        caption
      }
    }
  }
`;

const LeasingIntroBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.LeasingIntroQuery>(
    LEASING_INTRO_QUERY,
  );

  invariant(dataJson, 'Leasing JSON data is required!');

  const leasingIntroProps = useMemo(() => {
    return {
      title: dataJson.leasingIntro.title,
      caption: dataJson.leasingIntro.caption,
    };
  }, [dataJson]);

  return (
    <Section {...props}>
      <Container sx={{pt: 4, pb: 5, px: [0, 0, 0], maxWidth: 1280}}>
        <IntroText
          title={leasingIntroProps.title}
          caption={leasingIntroProps.caption}
          desktopOrientation="row"
          center={true}
          sx={{
            ...{
              'h1, h2, h3, h4, h5, h6': {
                fontFamily: 'heading',
                fontSize: [7, 8, 9],
                flexBasis: '63%',
              },
            },
            fontSize: 3,
            mx: 'auto',
            mb: [3, null, 2],
            mt: [0, null, 5],
            px: [3, null, 7],
          }}
        />
      </Container>
    </Section>
  );
};

export default LeasingIntroBlock;
