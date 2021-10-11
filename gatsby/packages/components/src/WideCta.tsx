/** @jsx jsx */
import {H} from '@hzdg/sectioning';
import {jsx, Container, Flex, Box, Text, Link} from '@tishman/components';

export interface WideCtaProps {
  title: string;
  caption: string;
  link?: {
    url?: string;
    label?: string;
  };
}

export const WideCta = ({title, caption, link}: WideCtaProps): JSX.Element => {
  return (
    <Container sx={{p: [3, 4]}}>
      <Flex
        sx={{
          py: [3, 4],
          px: [3, null, null, 4],
          border: '1px solid',
          borderColor: 'accent',
          flexDirection: ['column', null, null, 'row'],
          justifyContent: 'space-around',
          alignItems: ['flex-start', 'center'],
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
            maxWidth: '325px',
          }}
        >
          {title}
        </H>
        <Text
          variant="mediumP"
          as="p"
          sx={{
            flex: '1 1 auto',
            py: 2,
            textAlign: ['left', 'center', 'center', 'left'],
            opacity: 0.8,
            maxWidth: 550,
          }}
        >
          {caption}
        </Text>
        <Box
          sx={{
            flex: '0 0 auto',
            mt: [2, null, null, 0],
            mb: [3, null, null, 0],
            ml: [0, null, null, 5],
          }}
        >
          {link?.url && link?.label && (
            <Link variant="underline" href={link.url}>
              {link.label}
            </Link>
          )}
        </Box>
      </Flex>
    </Container>
  );
};
