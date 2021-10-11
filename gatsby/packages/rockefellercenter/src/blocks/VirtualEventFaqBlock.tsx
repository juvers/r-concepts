/**@jsx jsx */
import {useMemo} from 'react';
import {
  jsx,
  Faqs,
  Flex,
  Box,
  Container,
  AnchorSection,
  AddToCalendarButton,
} from '@tishman/components';
import {
  getHoursProps,
  getLocationProps,
  getContactsInfoProps,
} from '~blocks/utils';
import {useLocation} from '@reach/router';
import VirtualEventHoursAndAddress from '~blocks/VirtualEventHoursAndAddress';
import invariant from 'invariant';
import type {ComponentPropsWithoutRef} from 'react';
import type {Block} from '@sanity/block-content-to-react';

const VirtualEventFaqBlock = (
  props: {data: GatsbyTypes.SanityEventVirtualQuery} & ComponentPropsWithoutRef<
    typeof AnchorSection
  >,
): JSX.Element => {
  const {data} = props;
  const thisURL = useLocation().href;
  const virtualEventFaqBlockProps = useMemo(() => {
    const virtualEvent = data.virtualEvent;
    invariant(data.virtualEvent, 'Expected virtual event data');
    if (!virtualEvent?._rawFaqs)
      throw new Error('Expected raw virtual event faq data');

    const hours = virtualEvent.hour ? getHoursProps(virtualEvent.hour) : null;

    const location = getLocationProps(virtualEvent?.location);

    const contactsInfo = virtualEvent?.contactsInfo.map((contact) =>
      getContactsInfoProps(contact),
    );

    return {
      faqs: data.virtualEvent?._rawFaqs,
      hours,
      location,
      contactsInfo,
      title: virtualEvent.titleAndSlug.title,
      admissionType: data.virtualEvent.admissionType,
      startDateTime: data.virtualEvent.startEndDateTime.startDateTime,
      endDateTime: data.virtualEvent.startEndDateTime.endDateTime,
      excerpt: data.virtualEvent.excerpt,
    };
  }, [data]);

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
            title={`${virtualEventFaqBlockProps.title} FAQs`}
            faqs={(virtualEventFaqBlockProps.faqs as unknown) as Block[]}
            categories={virtualEventFaqBlockProps.faqs}
          />
          <Box sx={{pt: 3}}>
            <VirtualEventHoursAndAddress
              hours={virtualEventFaqBlockProps.hours}
              location={virtualEventFaqBlockProps.location}
              contactsInfo={virtualEventFaqBlockProps.contactsInfo}
              startDateTime={virtualEventFaqBlockProps.startDateTime}
              endDateTime={virtualEventFaqBlockProps.endDateTime}
              admissionType={virtualEventFaqBlockProps.admissionType}
            />
            <AddToCalendarButton
              sx={{mt: 20}}
              {...virtualEventFaqBlockProps}
              url={thisURL}
              description={virtualEventFaqBlockProps.excerpt}
              location={virtualEventFaqBlockProps.location?.address1}
            />
          </Box>
        </Flex>
      </Container>
    </AnchorSection>
  );
};

export default VirtualEventFaqBlock;
