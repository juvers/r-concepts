/**@jsx jsx */
import {jsx, WideCta, Container, Section} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const TOR_WIDE_CTA_QUERY = graphql`
  query TorWideCta {
    dataJson(id: {eq: "top-of-the-rock-observation-deck"}) {
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

const TorWideCtaBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.TorWideCtaQuery>(
    TOR_WIDE_CTA_QUERY,
  );

  invariant(dataJson, 'Tor JSON data is required!');

  const torWideCtaProps = useMemo(() => {
    return {
      title: dataJson.wideCta.title,
      caption: dataJson.wideCta.caption,
      link: dataJson.wideCta.link,
    };
  }, [dataJson]);

  return (
    torWideCtaProps && (
      <Section {...props}>
        <Container sx={{pt: 5, pb: 4}}>
          <WideCta {...torWideCtaProps} />
        </Container>
      </Section>
    )
  );
};

export default TorWideCtaBlock;
