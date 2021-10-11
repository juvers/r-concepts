/** @jsx jsx */

import {
  jsx,
  Section,
  Container,
  IntrinsicBox,
  Box,
  Flex,
  AnchorSection,
} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

function getYoutubeId(
  url: GatsbyTypes.Maybe<GatsbyTypes.Scalars['String']>,
): GatsbyTypes.Maybe<GatsbyTypes.Scalars['String']> {
  const urlArray = url
    ?.replace(/(>|<)/gi, '')
    .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  return urlArray && urlArray.length > 1 && urlArray[2] !== undefined
    ? urlArray[2].split(/[^0-9a-z_-]/i)[0]
    : urlArray && urlArray[0];
}

const PreRecordedYoutubeBlock = (
  url: GatsbyTypes.Maybe<GatsbyTypes.Scalars['String']>,
): JSX.Element => {
  const youtubeId = getYoutubeId(url);
  return (
    <IntrinsicBox
      ratio={1280 / 680}
      sx={{
        my: [4, 56],
        position: 'relative',
      }}
    >
      <iframe
        title={`youtube iframe ${youtubeId}`}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        src={`https://www.youtube.com/embed/${youtubeId}`}
      ></iframe>
    </IntrinsicBox>
  );
};

const VirtualEventPreRecordedBlock = (
  props: {data: GatsbyTypes.SanityEventVirtualQuery} & ComponentPropsWithoutRef<
    typeof Section
  >,
): JSX.Element => {
  const {data, ...styleProps} = props;

  invariant(data.virtualEvent, `No virtual event data found`);

  const anchorSectionProps =
    useMemo(() => {
      const subnavItem = data?.virtualEvent?.subnavItems?.find((item) => {
        return (
          item &&
          item?.slug &&
          item?.slug?.current &&
          /recorded-events/.test(item?.targetSection)
        );
      });
      if (!subnavItem)
        return {
          id: '',
        };

      return {
        id:
          subnavItem && subnavItem.slug && subnavItem.slug.current
            ? subnavItem.slug.current.replace('#', '')
            : '',
      };
    }, [data.virtualEvent.subnavItems]) || {};

  const virtualEventPreRecordedBlockProps = useMemo(() => {
    return {
      title: data.virtualEvent?.recordedContent?.title,
      items: data.virtualEvent?.recordedContent?.items,
    };
  }, [data]);

  return (
    <Section {...styleProps}>
      <AnchorSection {...anchorSectionProps}>
        <Container sx={{maxWidth: 1200, pt: [50, 69], pb: [36, 0], px: [3, 3]}}>
          <Box sx={{borderBottom: '1px solid #979797', mb: [0, 0]}}>
            <H
              sx={{
                variant: 'styles.h2',
                fontFamily: 'body',
                fontSize: [6, 7],
                mb: [34, 32],
              }}
            >
              {virtualEventPreRecordedBlockProps.title}
            </H>
          </Box>
          {virtualEventPreRecordedBlockProps.items?.map((item, index) => {
            return (
              <Box
                key={`row${index}`}
                sx={{
                  borderBottom: '1px solid #979797',
                }}
              >
                <Flex
                  sx={{
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    flexDirection: ['column', 'row'],
                    pt: [31, 56],
                  }}
                >
                  <Box sx={{flexBasis: ['100%', '50%'], maxWidth: '453px'}}>
                    <H
                      sx={{
                        variant: 'styles.h3',
                        fontFamily: 'body',
                        fontSize: [5, 6],
                        mb: [18, 0],
                      }}
                    >
                      {item?.title}
                    </H>
                  </Box>

                  <Box
                    sx={{
                      variant: 'text.body',
                      fontSize: [2, 2],
                      color: 'text',
                      flexBasis: ['100%', '50%'],
                      maxWidth: '540px',
                    }}
                  >
                    {item?.subTitle}
                  </Box>
                </Flex>
                {PreRecordedYoutubeBlock(item?.link?.url)}
              </Box>
            );
          })}
        </Container>
      </AnchorSection>
    </Section>
  );
};

export default VirtualEventPreRecordedBlock;
