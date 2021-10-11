/** @jsx jsx */
import {
  jsx,
  Section,
  AnchorSection,
  Container,
  GalleryCarousel,
  Box,
  AddToCalendarButton,
  Link,
  Flex,
} from '@tishman/components';
import invariant from 'invariant';
import {useMemo} from 'react';
import {useLocation} from '@reach/router';
import type {ComponentPropsWithoutRef} from 'react';
import {
  getHoursProps,
  getSanityGalleryItemProps,
  getLocationProps,
  getContactsInfoProps,
} from '~blocks/utils';
import IntroText from '~components/IntroText';
import VirtualEventHoursAndAddress from '~blocks/VirtualEventHoursAndAddress';

const VirtualEventHeroBlock = (
  props: {data: GatsbyTypes.SanityEventVirtualQuery} & ComponentPropsWithoutRef<
    typeof Section
  >,
): JSX.Element => {
  const {data, ...styleProps} = props;

  invariant(data, 'Virtual Event JSON data is required!');
  const thisURL = useLocation().href;
  const virtualEventHeroBlockProps = useMemo(() => {
    const virtualEvent = data.virtualEvent;
    invariant(virtualEvent, `No virtual event data found`);
    const upperGalleryItem = getSanityGalleryItemProps(virtualEvent?.photo);
    const lowerGalleryItems = virtualEvent?.imageGallery?.images?.map(
      (item) => {
        return getSanityGalleryItemProps(item);
      },
    );

    const hours = virtualEvent?.hour ? getHoursProps(virtualEvent?.hour) : null;

    const location = getLocationProps(virtualEvent?.location);

    const contactsInfo = virtualEvent?.contactsInfo.map((contact) =>
      getContactsInfoProps(contact),
    );

    const subnavItem = virtualEvent?.subnavItems?.find(
      (item) => item && item.targetSection === 'details',
    );

    return {
      upperGallery: [upperGalleryItem],
      lowerGallery: lowerGalleryItems,
      title: virtualEvent?.titleAndSlug.title,
      excerpt: virtualEvent?.excerpt,
      hours,
      location,
      contactsInfo,
      admissionType: virtualEvent?.admissionType,
      body: virtualEvent?._rawBody,
      startDateTime: virtualEvent?.startEndDateTime.startDateTime,
      endDateTime: virtualEvent?.startEndDateTime.endDateTime,
      showAddToCalendar: virtualEvent?.showAddToCalendar,
      eventCTA: virtualEvent?.eventsCTA,
      anchorId:
        subnavItem && subnavItem?.slug && subnavItem.slug?.current
          ? subnavItem?.slug.current
          : '',
    };
  }, [data.virtualEvent]);

  return (
    <Section {...styleProps}>
      <Container sx={{maxWidth: 1280, pt: 5, pb: 4, px: [0, 3]}}>
        <GalleryCarousel cards={virtualEventHeroBlockProps.upperGallery} />
      </Container>
      <AnchorSection id={virtualEventHeroBlockProps.anchorId}>
        <Container
          sx={{
            display: 'flex',
            flexDirection: ['column', null, 'row'],
            justifyContent: 'space-between',
            pt: [3, null, 8],
            pb: [6, null, 8],
            px: [3, 0, 0],
          }}
        >
          <IntroText
            sx={{
              fontSize: 4,
              maxWidth: 676,
              p: {
                mt: 20,
                mb: 40,
              },
              ul: {
                pl: 0,
                listStylePosition: 'inside',
              },
            }}
            title={virtualEventHeroBlockProps.title}
            captionRichText={virtualEventHeroBlockProps.body}
          />
          <Box sx={{mt: 1}}>
            <VirtualEventHoursAndAddress
              hours={virtualEventHeroBlockProps.hours}
              location={virtualEventHeroBlockProps.location}
              contactsInfo={virtualEventHeroBlockProps.contactsInfo}
              startDateTime={virtualEventHeroBlockProps.startDateTime}
              endDateTime={virtualEventHeroBlockProps.endDateTime}
              admissionType={virtualEventHeroBlockProps.admissionType}
            />
            <Flex
              sx={{
                flexDirection: ['column', 'row'],
                alignItems: ['flex-start', 'center'],
                flexWrap: 'wrap',
              }}
            >
              {virtualEventHeroBlockProps.showAddToCalendar && (
                <AddToCalendarButton
                  sx={{mt: 20, mr: 4}}
                  {...virtualEventHeroBlockProps}
                  url={thisURL}
                  description={virtualEventHeroBlockProps.excerpt}
                  location={virtualEventHeroBlockProps.location?.address1}
                />
              )}
              {virtualEventHeroBlockProps.eventCTA &&
                virtualEventHeroBlockProps.eventCTA.url &&
                virtualEventHeroBlockProps.eventCTA.caption && (
                  <Link
                    key={virtualEventHeroBlockProps.eventCTA.caption}
                    variant="button"
                    href={virtualEventHeroBlockProps.eventCTA.url}
                    sx={{
                      mt: 20,
                      px: 12,
                      py: 24,
                      mr: 4,
                      border: '1px solid black',
                    }}
                  >
                    {virtualEventHeroBlockProps.eventCTA.caption}
                  </Link>
                )}
            </Flex>
          </Box>
        </Container>
        {virtualEventHeroBlockProps.lowerGallery &&
          virtualEventHeroBlockProps.lowerGallery.length > 0 && (
            <Container sx={{maxWidth: 1600, pt: 5, pb: 45, px: [0, 3]}}>
              <GalleryCarousel
                cards={virtualEventHeroBlockProps.lowerGallery}
              />
            </Container>
          )}
      </AnchorSection>
    </Section>
  );
};

export default VirtualEventHeroBlock;
