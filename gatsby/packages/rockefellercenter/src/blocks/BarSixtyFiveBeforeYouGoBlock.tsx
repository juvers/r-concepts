/** @jsx jsx */
import {
  jsx,
  Flex,
  Section,
  Container,
  Box,
  Text,
  Link,
} from '@tishman/components';
import {H} from '@hzdg/sectioning';

import type {ComponentPropsWithoutRef} from 'react';
/**
 * NOTE THIS BLOCK IS HARD CODED!!!!!!!!!
 *
 * Since it is using "rich text" without a CMS
 * this was the only way I can display the data
 * to match the design.
 * Other option is replicating sanity data stream as a block
 * and using SanityRichText component to render it, but that would
 * likely be even more confusing to update.
 */
const BarSixtyFiveBeforeYouGoBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  return (
    <Section {...props}>
      <Container sx={{pb: [7], maxWidth: 1300}}>
        <Flex
          sx={{
            py: [3, 4],
            px: [3, 5, 6, 7],
            border: '1px solid',
            borderColor: 'accent',
            flexDirection: ['column', null, null, 'row'],
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            bg: 'background',
          }}
        >
          <H
            sx={{
              variant: 'text.heading',
              fontFamily: 'headingSecondary',
              flex: '0 0 auto',
              fontSize: [6, 7],
              letterSpacing: 0,
              my: [2, null, null, 0],
              mr: [0, null, null, 6],
            }}
          >
            Before you go.
          </H>
          <Box
            sx={{
              flex: '1 1 auto',
              opacity: 0.8,
              maxWidth: 685,
              ml: [0, null, null, 'auto'],
            }}
            variant="text.mediumP"
          >
            <Text as="p" sx={{my: [3, null, 2]}}>
              Enter at 49 West 49th Street and proceed up the escalator to the
              mezzanine level of Rockefeller Plaza.
            </Text>
            <Text as="p" sx={{my: [3, null, 2]}}>
              Please call{' '}
              <Link
                href="tel:+12126325000"
                sx={{color: 'text', fontWeight: 'regular'}}
              >
                212.632.5000
              </Link>{' '}
              for groups of five or more.
            </Text>
            <Text as="p" sx={{my: [3, null, 2]}}>
              Guests must be{' '}
              <Text as="strong" sx={{fontWeight: 'semiBold'}}>
                21 or over
              </Text>{' '}
              to enter.
            </Text>
            <Text as="p" sx={{my: [3, null, 2]}}>
              <Text as="strong" sx={{fontWeight: 'semiBold'}}>
                Dress code:
              </Text>{' '}
              Neat & refined. Jackets welcome. See our{' '}
              <Link href="/faq/" sx={{color: 'text', fontWeight: 'regular'}}>
                FAQs
              </Link>{' '}
              for more information.
            </Text>
            <Text as="p" sx={{my: [3, null, 2]}}>
              <Text as="strong" sx={{fontWeight: 'semiBold'}}>
                It is always best to reserve ahead, as Bar SixtyFive is
                occasionally closed for private events.
              </Text>
            </Text>
          </Box>
        </Flex>
      </Container>
    </Section>
  );
};

export default BarSixtyFiveBeforeYouGoBlock;
