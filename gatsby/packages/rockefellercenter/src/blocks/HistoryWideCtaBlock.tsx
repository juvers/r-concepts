/**@jsx jsx */
import {
  jsx,
  Container,
  Section,
  WideCtaProps,
  Flex,
  Box,
  Text,
  Link,
} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import {H} from '@hzdg/sectioning';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const HISTORY_WIDE_CTA_QUERY = graphql`
  query HistoryWideCta {
    dataJson(id: {eq: "history"}) {
      wideCta {
        title
        caption
        link {
          label
          url
        }
      }
    }
  }
`;

const HistoryWideCtaBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.HistoryWideCtaQuery>(
    HISTORY_WIDE_CTA_QUERY,
  );

  invariant(dataJson, 'History JSON data is required!');

  const historyWideCtaProps = useMemo(() => {
    return {
      title: dataJson.wideCta.title,
      caption: dataJson.wideCta.caption,
      link: dataJson.wideCta.link,
    };
  }, [dataJson]);

  return (
    historyWideCtaProps && (
      <Section {...props}>
        <Container sx={{pb: [0, 7], pr: 0}}>
          <CustomWideCta {...historyWideCtaProps} />
        </Container>
      </Section>
    )
  );
};

export default HistoryWideCtaBlock;

const CustomWideCta = ({title, caption, link}: WideCtaProps): JSX.Element => {
  return (
    <Container sx={{px: [0, 3, 4], pb: [0, 3, 4]}}>
      <Flex
        sx={{
          pt: [3, 4],
          pb: 4,
          px: [3, null, null, 4],
          border: '1px solid',
          borderColor: 'muted',
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
