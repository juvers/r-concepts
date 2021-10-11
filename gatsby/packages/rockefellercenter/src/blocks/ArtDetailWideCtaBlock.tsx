/**@jsx jsx */
import {jsx, WideCta, Container, Section} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const ART_DETAIL_WIDE_CTA_QUERY = graphql`
  query ArtDetailWideCta {
    dataJson(id: {eq: "art-detail"}) {
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

const ArtDetailWideCtaBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.ArtDetailWideCtaQuery>(
    ART_DETAIL_WIDE_CTA_QUERY,
  );

  invariant(dataJson, 'Art detail JSON data is required!');

  const artDetailWideCtaProps = useMemo(() => {
    return {
      title: dataJson.wideCta.title,
      caption: dataJson.wideCta.caption,
      link: dataJson.wideCta.link,
    };
  }, [dataJson]);

  return (
    <Section {...props}>
      <Container sx={{pt: 5, pb: [5, null, 7]}}>
        <WideCta {...artDetailWideCtaProps} />
      </Container>
    </Section>
  );
};

export default ArtDetailWideCtaBlock;
