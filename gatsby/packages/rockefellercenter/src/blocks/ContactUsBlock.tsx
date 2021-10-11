/** @jsx jsx */
import {jsx, Container, Box, Grid, Flex, Section} from '@tishman/components';
import ContactIntroTextBlock from '~blocks/forms/ContactIntroTextBlock';
import ContactNavigationBlock from '~blocks/forms/ContactNavigationBlock';
import ContactThankYouBlock from '~blocks/forms/ContactThankYouBlock';

import type {PropsWithoutRef} from 'react';
import type {FluidObject} from 'gatsby-image';
import type {BoxProps} from '@tishman/components';

export interface ContactUsBlockProps extends PropsWithoutRef<BoxProps> {
  slug: string;
  description: {
    text: readonly string[];
    image: {
      fluid: FluidObject;
    };
  };
  thankYouMessage: {
    title: string;
    caption: string;
    links: readonly {url: string; label: string}[];
  };
  showThankYou: boolean;
}

export default function ContactUsBlock({
  slug,
  description,
  thankYouMessage,
  showThankYou,
  id,
  ...props
}: ContactUsBlockProps): JSX.Element {
  return (
    <Section
      theme="Rock Center Black"
      sx={{
        display: 'flex',
        flexDirection: ['column', null, 'row'],
        justifyContent: 'space-between',
        py: [6, null, 7],
      }}
    >
      <Container>
        <Flex sx={{justifyContent: 'center', mb: [5, null, 9]}}>
          <ContactIntroTextBlock />
        </Flex>
        <Grid
          sx={{
            gridTemplateColumns: ['1fr', null, '346px 1fr'],
            gridGap: [0, null, 5, 7, 8],
          }}
        >
          <ContactNavigationBlock slug={slug} {...description} />
          {showThankYou ? (
            <ContactThankYouBlock {...thankYouMessage} id={id} />
          ) : (
            <Box {...props} />
          )}
        </Grid>
      </Container>
    </Section>
  );
}
