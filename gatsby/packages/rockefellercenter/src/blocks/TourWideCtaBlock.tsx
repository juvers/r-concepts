/**@jsx jsx */
import {jsx, WideCta, Container, Section} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const TOUR_WIDE_CTA_QUERY = graphql`
  query TourWideCta {
    dataJson(id: {eq: "rockefeller-center-tour"}) {
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

const RockCenterWideCtaBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.TourWideCtaQuery>(
    TOUR_WIDE_CTA_QUERY,
  );

  invariant(dataJson, 'Tour JSON data is required!');

  const tourWideCtaProps = useMemo(() => {
    return {
      title: dataJson.wideCta.title,
      caption: dataJson.wideCta.caption,
      link: dataJson.wideCta.link,
    };
  }, [dataJson]);

  return (
    tourWideCtaProps && (
      <Section {...props}>
        <Container sx={{pt: 5, pb: 4}}>
          <WideCta {...tourWideCtaProps} />
        </Container>
      </Section>
    )
  );
};

export default RockCenterWideCtaBlock;
