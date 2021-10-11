/**@jsx jsx */
import {jsx, WideCta, Container, Section} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const ART_AND_HISTORY_WIDE_CTA_QUERY = graphql`
  query ArtandHistoryWideCta {
    dataJson(id: {eq: "art-and-history"}) {
      wideCta {
        caption
        title
        link {
          label
          url
        }
      }
    }
  }
`;

const ArtandHistoryWideCtaBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.ArtandHistoryWideCtaQuery>(
    ART_AND_HISTORY_WIDE_CTA_QUERY,
  );

  invariant(dataJson, 'Art & History JSON data is required');
  const artAndHistoryWideCtaProps = useMemo(() => {
    return {
      title: dataJson.wideCta.title,
      caption: dataJson.wideCta.caption,
      link: dataJson.wideCta.link,
    };
  }, [dataJson]);

  return (
    <Section {...props}>
      <Container sx={{py: [3, 5]}}>
        <WideCta {...artAndHistoryWideCtaProps} />
      </Container>
    </Section>
  );
};

export default ArtandHistoryWideCtaBlock;
