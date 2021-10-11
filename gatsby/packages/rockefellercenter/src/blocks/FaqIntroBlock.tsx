/** @jsx jsx */
import {jsx, Container, Section} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import IntroText from '~components/IntroText';
import invariant from 'invariant';

const FAQ_INTRO_QUERY = graphql`
  query FaqIntro {
    dataJson(id: {eq: "faq"}) {
      faqIntroText {
        title
        caption
      }
    }
  }
`;

const FaqIntroBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.FaqIntroQuery>(FAQ_INTRO_QUERY);

  invariant(dataJson, 'Faq JSON data is required!');

  const faqIntroProps = useMemo(() => {
    return {
      title: dataJson.faqIntroText.title,
      caption: dataJson.faqIntroText.caption,
    };
  }, [dataJson]);

  return (
    <Section {...props}>
      <Container>
        <IntroText
          title={faqIntroProps.title}
          caption={faqIntroProps.caption}
          desktopOrientation="column"
          maxWidth={864}
          center
          sx={{mx: 'auto'}}
        />
      </Container>
    </Section>
  );
};

export default FaqIntroBlock;
