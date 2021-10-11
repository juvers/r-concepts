/** @jsx jsx */
import {jsx, Divider, Flex, Container} from '@tishman/components';
import {useMemo} from 'react';
import {alpha} from '@theme-ui/color';
import {getSanityFluidImageProps} from '~blocks/utils';
import SponsorGrid from '~components/sponsor-grid';

const EventSponsorBlock = ({
  data,
}: {
  data: GatsbyTypes.sanityEventQuery;
}): JSX.Element | null => {
  const primary = useMemo(() => {
    if (!data) throw new Error('Expected event data');
    if (!data.event) throw new Error('Expected valid event data');
    if (!data?.event?.sponsor?.primary) return null;
    return data?.event?.sponsor?.primary?.map((image) =>
      getSanityFluidImageProps(image),
    );
  }, [data]);

  const secondary = useMemo(() => {
    if (!data) throw new Error('Expected event data');
    if (!data.event) throw new Error('Expected valid event data');
    if (!data?.event?.sponsor?.secondary) return null;
    return data?.event?.sponsor?.secondary?.map((image) =>
      getSanityFluidImageProps(image),
    );
  }, [data]);

  const hasPrimarySponsors = primary && primary.length > 0;
  const hasSecondarySponsors = secondary && secondary.length > 0;

  if (!hasPrimarySponsors && !hasSecondarySponsors) return null;
  return (
    <Container my={[4, 7]}>
      {/* Top divider */}
      <Divider my={4} mb={[5, null, null, 8]} />
      <Flex
        sx={{
          flexDirection: ['column', null, null, 'row'],
          justifyContent: 'center',
        }}
      >
        {hasPrimarySponsors && (
          <SponsorGrid
            title="Primary Sponsors"
            logos={primary}
            isPrimary={true}
            sx={{
              // match theme.styles.hr styling // vertical middle divider on desktop
              borderRightColor: alpha('muted', 0.2),
              borderRightWidth: '2px',
              borderRightStyle: [
                'none',
                null,
                null,
                hasSecondarySponsors ? 'solid' : 'none',
              ],
            }}
          />
        )}
        {hasPrimarySponsors && hasSecondarySponsors && (
          // mobile horizontal divider
          <Divider sx={{display: ['block', null, null, 'none'], my: 4}} />
        )}
        {hasSecondarySponsors && (
          <SponsorGrid
            title="Secondary Sponsors"
            logos={secondary}
            isPrimary={false}
          />
        )}
      </Flex>
    </Container>
  );
};

export default EventSponsorBlock;
