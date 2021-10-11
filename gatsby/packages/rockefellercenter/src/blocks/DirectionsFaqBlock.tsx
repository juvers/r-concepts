/**@jsx jsx */
import {
  jsx,
  Faqs,
  Flex,
  Box,
  Container,
  Section,
  HoursAndAddress,
} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {getContactsInfoProps} from '~blocks/utils';
import invariant from 'invariant';

import type {Block} from '@sanity/block-content-to-react';

const DIRECTIONS_FAQ_QUERY = graphql`
  query DirectionsFaq {
    dataJson(id: {eq: "directions"}) {
      directionFaqTitle
      directionHero {
        location {
          address1
          address2
        }
        contactsInfo {
          type
          value
        }
        contactLinkUrl
      }
    }
    sanityDirections(_id: {eq: "directions"}, _type: {eq: "directions"}) {
      _rawDirections
    }
  }
`;

const DirectionsFaqBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    dataJson,
    sanityDirections,
  } = useStaticQuery<GatsbyTypes.DirectionsFaqQuery>(DIRECTIONS_FAQ_QUERY);
  invariant(dataJson, 'Directions JSON data is required!');

  const data = useMemo(() => {
    if (!sanityDirections?._rawDirections)
      throw new Error(
        'Expected raw Expected Directions and Map Direction data',
      );
    if (!dataJson?.directionFaqTitle)
      throw new Error('Expected Directions faq title');
    if (!dataJson?.directionHero.contactsInfo)
      throw new Error('Expected Directions hero contacts info');

    const contactsInfo = dataJson.directionHero.contactsInfo.map((contact) =>
      getContactsInfoProps(contact),
    );

    return {
      title: dataJson.directionFaqTitle,
      location: dataJson.directionHero.location,
      contactsInfo,
      contactLinkUrl: dataJson.directionHero.contactLinkUrl,
      directions: sanityDirections._rawDirections,
    };
  }, [dataJson, sanityDirections]);

  return (
    <Section {...props}>
      <Container sx={{px: [3, 5], pt: 2, pb: [4, 8]}}>
        <Flex
          sx={{
            flexDirection: ['column', null, 'row'],
            justifyContent: 'space-between',
          }}
        >
          <Faqs
            title={data.title}
            categories={data.directions}
            faqs={(data.directions as unknown) as Block[]}
          />
          <Box sx={{pt: 3}}>
            <HoursAndAddress
              location={data.location}
              contactsInfo={data.contactsInfo}
              contactLinkUrl={data.contactLinkUrl}
            />
          </Box>
        </Flex>
      </Container>
    </Section>
  );
};

export default DirectionsFaqBlock;
