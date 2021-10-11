/**@jsx jsx */
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import {
  jsx,
  Faqs,
  Flex,
  Box,
  Container,
  AnchorSection,
} from '@tishman/components';
import RockCenterHoursAndAddressBlock from '~blocks/TourHoursAndAddressBlock';
import type {Block} from '@sanity/block-content-to-react';

const TOUR_FAQ_QUERY = graphql`
  query TourFaq {
    sanityAttractionRc(_id: {eq: "rcTour"}, _type: {eq: "attraction.rc"}) {
      _rawFaqs
    }
    dataJson(id: {eq: "rockefeller-center-tour"}) {
      faqTitle
    }
  }
`;

const RockCenterFaqBlock = ({id}: {id: string}): JSX.Element => {
  const {
    sanityAttractionRc,
    dataJson,
  } = useStaticQuery<GatsbyTypes.TourFaqQuery>(TOUR_FAQ_QUERY);

  const data = useMemo(() => {
    if (!sanityAttractionRc)
      throw new Error('Expected Rock Center Attraction data');
    if (!sanityAttractionRc?._rawFaqs)
      throw new Error('Expected raw Rock Center faq data');
    if (!dataJson?.faqTitle) throw new Error('Expected Rock Center faq title');

    return {
      faqs: sanityAttractionRc._rawFaqs,
      title: dataJson.faqTitle,
    };
  }, [sanityAttractionRc, dataJson]);

  return (
    <AnchorSection id={id} theme="Rock Center Black">
      <Container sx={{px: [3, 5], py: 8}}>
        <Flex
          sx={{
            flexDirection: ['column', null, 'row'],
            justifyContent: 'space-between',
          }}
        >
          <Faqs
            title={data.title}
            faqs={(data.faqs as unknown) as Block[]}
            categories={data.faqs}
          />
          <Box sx={{pt: 3}}>
            <RockCenterHoursAndAddressBlock />
          </Box>
        </Flex>
      </Container>
    </AnchorSection>
  );
};

export default RockCenterFaqBlock;
