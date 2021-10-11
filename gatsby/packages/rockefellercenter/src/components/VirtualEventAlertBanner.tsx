/** @jsx jsx */
import {jsx, Flex, Box, Text, Link, Close_alert} from '@tishman/components';
import {useState, useMemo} from 'react';

const VirtualEventAlertBanner = (props: {
  data: GatsbyTypes.SanityEventVirtualQuery;
}): JSX.Element | null => {
  const {data} = props;
  const liveEventsAlert = data?.virtualEvent?.alert;
  const [bannerIsVisible, toggleBannerVisible] = useState<boolean>(true);

  const virtualEventAlertBannerProps = useMemo(() => {
    return {
      title: liveEventsAlert?.title,
      description: liveEventsAlert?.description,
      type: liveEventsAlert?.type,
      url: liveEventsAlert?.link?.url,
      caption: liveEventsAlert?.link?.caption,
    };
  }, [liveEventsAlert]);

  const {title, description, url, caption, type} = virtualEventAlertBannerProps;

  if (!title) return null;

  if (description && !title) return null;

  return (
    <Box>
      {bannerIsVisible && (
        <Flex
          sx={{
            backgroundColor: type === 'Live' ? '#FFD758' : '#89CBDB',
            padding: ['15px', '15px 34px'],
          }}
        >
          <Flex
            sx={{
              flex: 1,
              justifyContent: 'center',
              flexDirection: ['column', 'row'],
              alignItems: ['center'],
            }}
          >
            <Text variant="smallP" sx={{fontWeight: 500}}>
              {title}
            </Text>
            <Text
              variant="smallP"
              sx={{ml: 1, textAlign: 'center', fontWeight: 400}}
            >
              {description}
            </Text>
            <Link href={`${url}`} sx={{ml: 1}}>
              <Text variant="smallP" sx={{fontWeight: 500}}>
                {caption}
              </Text>
            </Link>
          </Flex>
          <Flex
            sx={{
              justifyContent: 'flex-end',
              cursor: 'pointer',
              margin: [0, 'auto'],
            }}
          >
            <Close_alert
              onClick={() => toggleBannerVisible(!bannerIsVisible)}
            />
          </Flex>
        </Flex>
      )}
    </Box>
  );
};

export default VirtualEventAlertBanner;
