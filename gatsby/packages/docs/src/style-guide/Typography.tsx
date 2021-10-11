/* eslint-disable @tishman/prefer-tishman-components */
/** @jsx jsx */
import {jsx, Styled, useThemeUI, Box, Flex, Container} from 'theme-ui';
import {TypeScale, TypeStyle} from '@theme-ui/style-guide';

const Section = ({children}: {children: React.ReactNode}): JSX.Element => (
  <Box
    sx={{
      my: 4,
    }}
  >
    {children}
  </Box>
);

const Row = ({children}: {children: React.ReactNode}): JSX.Element => (
  <Flex
    sx={{
      alignItems: 'baseline',
      flexWrap: 'wrap',
      mx: -3,
      '& > div': {
        px: 3,
      },
    }}
  >
    {children}
  </Flex>
);

export const Typography = (): JSX.Element => {
  const {theme} = useThemeUI();
  if (!theme) throw new Error('A theme is required!');

  const {fonts, fontWeights, lineHeights} = theme;

  return (
    <Container as="section" sx={{my: 4}}>
      <Styled.h2 sx={{mb: 2}}>Typography</Styled.h2>
      {fonts && (
        <Section>
          <Styled.h2 sx={{mb: 2}}>Font Families</Styled.h2>
          <Row>
            {Object.keys(fonts).map((name) => (
              <Box key={name}>
                <TypeStyle fontFamily={name} fontSize={7}>
                  Aa
                </TypeStyle>
                <Styled.code title={(fonts as Record<string, string>)[name]}>
                  {name}
                </Styled.code>
              </Box>
            ))}
          </Row>
        </Section>
      )}
      <Section>
        <Styled.h2>Font Sizes</Styled.h2>
        <TypeScale />
      </Section>
      {fontWeights && (
        <Section>
          <Styled.h2>Font Weights</Styled.h2>
          <Row>
            {Object.keys(fontWeights).map((name) => (
              <Box key={name}>
                <TypeStyle fontSize={7} fontWeight={name}>
                  {(fontWeights as Record<string, string>)[name]}
                </TypeStyle>
                <Styled.code>{name}</Styled.code>
              </Box>
            ))}
          </Row>
        </Section>
      )}
      {lineHeights && (
        <Section>
          <Styled.h2>Line Heights</Styled.h2>
          <Row>
            {Object.keys(lineHeights).map((name) => (
              <Box key={name}>
                <TypeStyle fontSize={7} lineHeight={name}>
                  {(lineHeights as Record<string, string>)[name]}
                </TypeStyle>
                <Styled.code>{name}</Styled.code>
              </Box>
            ))}
          </Row>
        </Section>
      )}
    </Container>
  );
};
