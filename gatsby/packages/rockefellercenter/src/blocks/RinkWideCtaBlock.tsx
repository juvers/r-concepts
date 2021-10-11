/**@jsx jsx */
import {jsx, WideCta, Container, Section} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const RINK_WIDE_CTA_QUERY = graphql`
  query RinkWideCta {
    dataJson(id: {eq: "the-rink-at-rockefeller-center"}) {
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

const RinkWideCtaBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.RinkWideCtaQuery>(
    RINK_WIDE_CTA_QUERY,
  );

  invariant(dataJson, 'Rink JSON data is required!');

  const rinkWideCtaProps = useMemo(() => {
    return {
      title: dataJson.wideCta.title,
      caption: dataJson.wideCta.caption,
      link: dataJson.wideCta.link,
    };
  }, [dataJson]);

  return (
    rinkWideCtaProps && (
      <Section {...props}>
        <Container sx={{pt: 5, pb: 4}}>
          <WideCta {...rinkWideCtaProps} />
        </Container>
      </Section>
    )
  );
};

export default RinkWideCtaBlock;
