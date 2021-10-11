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
import RinkHoursAndAddressBlock from '~blocks/RinkHoursAndAddressBlock';
import type {ComponentPropsWithoutRef} from 'react';
import type {Block} from '@sanity/block-content-to-react';

const RINK_FAQ_QUERY = graphql`
  query RinkFaq {
    sanityAttractionRink(_id: {eq: "theRink"}, _type: {eq: "attraction.rink"}) {
      _rawFaqs
    }
    dataJson(id: {eq: "the-rink-at-rockefeller-center"}) {
      faqTitle
    }
  }
`;

const RinkFaqBlock = (
  props: ComponentPropsWithoutRef<typeof AnchorSection>,
): JSX.Element => {
  const {
    sanityAttractionRink,
    dataJson,
  } = useStaticQuery<GatsbyTypes.RinkFaqQuery>(RINK_FAQ_QUERY);

  const data = useMemo(() => {
    if (!sanityAttractionRink) throw new Error('Expected rink Attraction data');
    if (!sanityAttractionRink?._rawFaqs)
      throw new Error('Expected raw rink faq data');
    if (!dataJson?.faqTitle) throw new Error('Expected rink faq title');

    return {
      faqs: sanityAttractionRink._rawFaqs,
      title: dataJson.faqTitle,
    };
  }, [sanityAttractionRink, dataJson]);

  return (
    <AnchorSection {...props}>
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
            <RinkHoursAndAddressBlock />
          </Box>
        </Flex>
      </Container>
    </AnchorSection>
  );
};

export default RinkFaqBlock;
