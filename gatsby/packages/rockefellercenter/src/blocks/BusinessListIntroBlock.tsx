/** @jsx jsx */
import {jsx, Container, Section} from '@tishman/components';
import IntroText from '~components/IntroText';

import type {TishmanThemeName} from '@tishman/components';

interface BusinessIntroTextProps {
  title: string;
  caption: string;
  theme?: TishmanThemeName;
  pt: number;
  pb: number;
}

const BusinessListIntroBlock = ({
  title,
  caption,
  theme,
  pt,
  pb,
}: BusinessIntroTextProps): JSX.Element => {
  return (
    <Section theme={theme} pt={pt} pb={pb}>
      <Container>
        <IntroText title={title} caption={caption} />
      </Container>
    </Section>
  );
};

export default BusinessListIntroBlock;
