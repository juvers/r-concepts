/** @jsx jsx */
import {useMemo} from 'react';
import {useStaticQuery, graphql} from 'gatsby';
import type {ComponentPropsWithoutRef} from 'react';

import {jsx, Section} from '@tishman/components';
import IntroText from '~components/IntroText';

const CONTACT_PAGE_INTRO_TEXT_QUERY = graphql`
  query ContactPageIntroText {
    dataJson(id: {eq: "contact"}) {
      introTextDataJson: contactPageData {
        intro
      }
    }
  }
`;

const ContactIntroTextBlock = (
  props: Omit<ComponentPropsWithoutRef<typeof Section>, 'children'>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.ContactPageIntroTextQuery>(
    CONTACT_PAGE_INTRO_TEXT_QUERY,
  );

  const introTextDataJson = dataJson?.introTextDataJson;
  const introTextData = useMemo(() => {
    if (!introTextDataJson)
      throw new Error('Expected valid Contact Page Intro Text data');

    if (introTextDataJson && !introTextDataJson.intro)
      throw new Error('Expected valid Contacct Page Intro Text text');
    return {
      intro: introTextDataJson.intro,
    };
  }, [introTextDataJson]);

  return (
    <Section {...props}>
      {introTextData && (
        <IntroText
          center={true}
          desktopOrientation="column"
          maxWidth={730}
          caption={introTextData.intro}
        />
      )}
    </Section>
  );
};

export default ContactIntroTextBlock;
