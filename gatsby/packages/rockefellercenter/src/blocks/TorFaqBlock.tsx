/**@jsx jsx */
import {
  jsx,
  Faqs,
  Flex,
  Box,
  Container,
  AnchorSection,
} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import TorHoursAndAddressBlock from '~blocks/TorHoursAndAddressBlock';
import type {Block} from '@sanity/block-content-to-react';

const TOR_FAQ_QUERY = graphql`
  query TorFaq {
    sanityAttractionTor(
      _id: {eq: "topOfTheRock"}
      _type: {eq: "attraction.tor"}
    ) {
      _rawFaqs
    }
    dataJson(id: {eq: "top-of-the-rock-observation-deck"}) {
      faqTitle
    }
  }
`;

const TorFaqBlock = (
  props: ComponentPropsWithoutRef<typeof AnchorSection>,
): JSX.Element => {
  const {
    sanityAttractionTor,
    dataJson,
  } = useStaticQuery<GatsbyTypes.TorFaqQuery>(TOR_FAQ_QUERY);

  const data = useMemo(() => {
    if (!sanityAttractionTor)
      throw new Error('Expected Top of the Rock Attraction data');
    if (!sanityAttractionTor?._rawFaqs)
      throw new Error('Expected raw Top of the Rock faq data');
    if (!dataJson?.faqTitle)
      throw new Error('Expected Top of the Rock faq title');

    return {
      faqs: sanityAttractionTor._rawFaqs,
      title: dataJson.faqTitle,
    };
  }, [sanityAttractionTor, dataJson]);

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
            <TorHoursAndAddressBlock />
          </Box>
        </Flex>
      </Container>
    </AnchorSection>
  );
};

export default TorFaqBlock;
