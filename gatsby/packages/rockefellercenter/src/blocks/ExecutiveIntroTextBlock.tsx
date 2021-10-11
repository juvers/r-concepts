/**@jsx jsx */
import {jsx, Section, Container} from '@tishman/components';
import invariant from 'invariant';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import IntroText from '~components/IntroText';

import type {ComponentPropsWithoutRef} from 'react';

const EXECUTIVE_INTRO_TEXT_QUERY = graphql`
  query ExecutiveIntroText {
    dataJson(id: {eq: "executive"}) {
      introText {
        title
        caption
      }
    }
  }
`;

const ExecutiveIntroTextBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.ExecutiveIntroTextQuery>(
    EXECUTIVE_INTRO_TEXT_QUERY,
  );

  invariant(dataJson, 'Executive data is required!');

  const intro = useMemo(
    () => ({
      title: dataJson.introText.title,
      caption: dataJson.introText.caption,
    }),
    [dataJson],
  );

  return (
    <Section {...props}>
      <Container>
        <IntroText center maxWidth={750} sx={{mx: 'auto', mt: 5}} {...intro} />
      </Container>
    </Section>
  );
};

export default ExecutiveIntroTextBlock;
