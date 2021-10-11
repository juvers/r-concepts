/**@jsx jsx */
import {jsx, WideCta, Container, Section} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const LEASING_WIDE_CTA_QUERY = graphql`
  query LeasingWideCta {
    dataJson(id: {eq: "leasing"}) {
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

const LeasingWideCtaBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.LeasingWideCtaQuery>(
    LEASING_WIDE_CTA_QUERY,
  );

  invariant(dataJson, 'Leasing JSON data is required!');

  const leasingWideCtaProps = useMemo(() => {
    return {
      title: dataJson.wideCta.title,
      caption: dataJson.wideCta.caption,
      link: dataJson.wideCta.link,
    };
  }, [dataJson]);

  return (
    <Section {...props}>
      <Container
        sx={{
          pt: 5,
          pb: 4,
          '> [class*="WideCta"] > [class*="WideCta"]': {
            borderColor: 'initial',
          },
          px: [0, 0, 0, 0],
        }}
      >
        <WideCta {...leasingWideCtaProps} />
      </Container>
    </Section>
  );
};

export default LeasingWideCtaBlock;
