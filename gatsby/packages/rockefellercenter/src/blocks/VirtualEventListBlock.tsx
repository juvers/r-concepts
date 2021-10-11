/** @jsx jsx */
import {
  jsx,
  Section,
  Container,
  CalloutGrid,
  CalloutGridCard,
  AnchorSection,
} from '@tishman/components';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

//If there is a link caption set use that, otherwise display
//moreInfo from the CMS as a placeholder
const getLinkCaptionState = (caption: string, moreInfo: string) => {
  if (!caption) {
    return moreInfo;
  } else {
    return caption;
  }
};
const VirtualEventListBlock = (
  props: {data: GatsbyTypes.SanityEventVirtualQuery} & ComponentPropsWithoutRef<
    typeof Section
  >,
): JSX.Element => {
  const {data, ...styleProps} = props;

  invariant(data.virtualEvent, `No virtual event data found`);

  const anchorSectionProps = useMemo(() => {
    const subnavItem = data?.virtualEvent?.subnavItems?.find((item) => {
      return (
        item &&
        item?.slug &&
        item?.slug?.current &&
        /live-events/.test(item.targetSection)
      );
    });
    if (!subnavItem) return {id: ''};

    return {
      id:
        subnavItem && subnavItem?.slug && subnavItem.slug?.current
          ? subnavItem?.slug?.current?.replace('#', '')
          : '',
    };
  }, [data.virtualEvent.subnavItems]);

  const virtualEventListBlockProps = useMemo(() => {
    return {
      items: data?.virtualEvent?.liveEvents?.items?.map((item, index) => ({
        index: index,
        fluid: item?.poster?.asset?.fluid,
        alt: '',
        title: item?.title as string,
        // caption: item?.subTitle,
        description: item?.subTitle as string,
        linkURL: item?.link?.url as string,
        linkCaption: getLinkCaptionState(
          item?.link?.caption as string,
          item?.moreInfo as string,
        ) as string,
      })),
    };
  }, [data]);

  return (
    virtualEventListBlockProps && (
      <Section {...styleProps}>
        <AnchorSection {...anchorSectionProps}>
          <Container sx={{py: 4, pt: 45}}>
            <CalloutGrid
              hideOffset
              sx={{
                '> div:nth-of-type(even)': {
                  justifySelf: ['unset', 'flex-end', 'unset'],
                  width: [null, '100%', null],
                },
                direction: 'rtl',
                gridColumnGap: '120px',
              }}
              title={props.data.virtualEvent?.liveEvents?.title}
              caption={props.data.virtualEvent?.liveEvents?.subTitle}
            >
              {virtualEventListBlockProps.items?.map((item) => (
                <CalloutGridCard
                  key={item.index}
                  {...item}
                  links={[{url: item.linkURL, label: item.linkCaption}]}
                  maxWidth={475}
                  // ratio={540 / 529}
                />
              ))}
            </CalloutGrid>
          </Container>
        </AnchorSection>
      </Section>
    )
  );
};
export default VirtualEventListBlock;
