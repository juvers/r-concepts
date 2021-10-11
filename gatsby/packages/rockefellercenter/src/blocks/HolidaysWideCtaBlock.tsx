/**@jsx jsx */
import {jsx, WideCta, Container, AnchorSection} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const HOLIDAYS_WIDE_CTA_QUERY = graphql`
  query HolidaysWideCta {
    dataJson(id: {eq: "holidays"}) {
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

const HolidaysWideCtaBlock = (
  props: ComponentPropsWithoutRef<typeof AnchorSection>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.HolidaysWideCtaQuery>(
    HOLIDAYS_WIDE_CTA_QUERY,
  );

  invariant(dataJson, 'Holidays JSON data is required!');

  const holidaysWideCtaProps = useMemo(() => {
    return {
      title: dataJson.wideCta.title,
      caption: dataJson.wideCta.caption,
      link: dataJson.wideCta.link,
    };
  }, [dataJson]);

  return (
    holidaysWideCtaProps && (
      <AnchorSection {...props}>
        <Container sx={{pt: 5, pb: 4}}>
          <WideCta {...holidaysWideCtaProps} />
        </Container>
      </AnchorSection>
    )
  );
};

export default HolidaysWideCtaBlock;
