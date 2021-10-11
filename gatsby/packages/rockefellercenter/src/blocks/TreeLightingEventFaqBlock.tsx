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
import {
  getHoursProps,
  getLocationProps,
  getContactsInfoProps,
} from '~blocks/utils';
import TreeLightingEventHoursAndAddress from '~blocks/TreeLightingEventHoursAndAddress';
import type {ComponentPropsWithoutRef} from 'react';
import type {Block} from '@sanity/block-content-to-react';

const TREE_LIGHTING_EVENT_FAQ_QUERY = graphql`
  query TreeLightingFaq {
    treeLightingData: allSanityEventTreeLighting(limit: 1) {
      nodes {
        _rawFaqs
        hour {
          hours {
            day
            opensAt
            closesAt
          }
          hourText
        }
        broadcastInfo
        location {
          title
          address1
          address2
        }
        contactsInfo {
          type
          value
        }
      }
    }
    dataJson(id: {eq: "rockefeller-center-christmas-tree-lighting"}) {
      treeLightingFaqTitle
    }
  }
`;

const TreeLightingFaqBlock = (
  props: ComponentPropsWithoutRef<typeof AnchorSection>,
): JSX.Element => {
  const {
    treeLightingData,
    dataJson,
  } = useStaticQuery<GatsbyTypes.TreeLightingFaqQuery>(
    TREE_LIGHTING_EVENT_FAQ_QUERY,
  );

  const data = useMemo(() => {
    const treeLightingEvent = treeLightingData.nodes[0];
    if (!treeLightingEvent)
      throw new Error('Expected tree lighting Attraction data');
    if (!treeLightingEvent?._rawFaqs)
      throw new Error('Expected raw tree lighting faq data');
    if (!dataJson?.treeLightingFaqTitle)
      throw new Error('Expected tree lighting faq title');

    const hours = treeLightingEvent.hour
      ? getHoursProps(treeLightingEvent.hour)
      : null;

    const location = getLocationProps(treeLightingEvent?.location);

    const contactsInfo = treeLightingEvent?.contactsInfo.map((contact) =>
      getContactsInfoProps(contact),
    );

    return {
      faqs: treeLightingEvent._rawFaqs,
      title: dataJson.treeLightingFaqTitle,
      hours,
      broadcastInfo: treeLightingEvent.broadcastInfo,
      location,
      contactsInfo,
    };
  }, [treeLightingData, dataJson]);

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
            <TreeLightingEventHoursAndAddress
              hours={data.hours}
              location={data.location}
              contactsInfo={data.contactsInfo}
              broadcastInfo={data.broadcastInfo}
            />
          </Box>
        </Flex>
      </Container>
    </AnchorSection>
  );
};

export default TreeLightingFaqBlock;
