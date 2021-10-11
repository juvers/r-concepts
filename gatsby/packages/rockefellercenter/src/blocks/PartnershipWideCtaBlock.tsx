/**@jsx jsx */
import {jsx, WideCta, Container, Section} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const PARTNERSHIP_WIDE_CTA_QUERY = graphql`
  query PartnershipWideCta {
    dataJson(id: {eq: "partnerships"}) {
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

const PartnershipWideCtaBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.PartnershipWideCtaQuery>(
    PARTNERSHIP_WIDE_CTA_QUERY,
  );

  invariant(dataJson, 'Partnership JSON data is required!');

  const PartnershipWideCtaProps = useMemo(() => {
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
        <WideCta {...PartnershipWideCtaProps} />
      </Container>
    </Section>
  );
};

export default PartnershipWideCtaBlock;
