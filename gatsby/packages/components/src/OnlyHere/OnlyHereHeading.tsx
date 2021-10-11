/** @jsx jsx */
import {H} from '@hzdg/sectioning';
import {
  jsx,
  Container,
  Flex,
  Box,
  Text,
  Link,
  fluidFontSize,
} from '@tishman/components';

export interface OnlyHereHeadingProps {
  title: string;
  caption: string;
  link?: {
    url?: string;
    label?: string;
  };
}

export const OnlyHereHeading = ({
  title,
  caption,
  link,
}: OnlyHereHeadingProps): JSX.Element => {
  return (
    <Container sx={{px: [3, 0], maxWidth: 901}}>
      <Flex
        sx={{
          pt: [3, 4, 4, 6],
          pb: [0, null, null, 5],
          px: [3, null, null, 0],
          flexDirection: ['column', 'column', 'column', 'row'],
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
            fontSize: fluidFontSize(['21px', null, null, null, 6]),
            letterSpacing: 0,
            my: [2, 3, null, 0],
            mr: [0, null, null, 6],
          }}
        >
          {title}
        </H>
        <Text
          variant="smallP"
          as="p"
          sx={{
            flex: '1 1 auto',
            letterSpacing: 1,
            opacity: 0.8,
            maxWidth: 570,
          }}
        >
          {caption}
        </Text>
        <Box
          sx={{
            flex: '0 0 auto',
            mt: [2, 3, null, 0],
            ml: [0, null, null, 5],
          }}
        >
          {link?.url && link?.label && (
            <Link
              variant="underline"
              sx={{fontWeight: 'medium'}}
              href={link.url}
            >
              {link.label}
            </Link>
          )}
        </Box>
      </Flex>
    </Container>
  );
};
