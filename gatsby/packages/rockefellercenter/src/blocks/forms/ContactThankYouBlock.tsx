/** @jsx jsx */
import {jsx, Section, Box, Flex, Link, Text} from '@tishman/components';
import {H} from '@hzdg/sectioning';

import type {SectionProps} from '@tishman/components';

export interface ContactThankYouBlockProps extends SectionProps {
  title: string;
  caption: string;
  links: readonly {url: string; label: string}[];
}

const ContactThankYouBlock = ({
  title,
  caption,
  links,
  ...props
}: ContactThankYouBlockProps): JSX.Element => {
  return (
    <Section {...props}>
      <Box>
        <H sx={{variant: 'styles.h1', fontFamily: 'headingSecondary', mb: 4}}>
          {title}
        </H>
        <Text sx={{mb: 5}} variant="largeP">
          {caption}
        </Text>
        <Flex>
          {links.map(({url, label}) => (
            <Link key={label} variant="underline" href={url} sx={{mr: 3}}>
              {label}
            </Link>
          ))}
        </Flex>
      </Box>
    </Section>
  );
};

export default ContactThankYouBlock;
