/** @jsx jsx */
import {jsx, Flex} from '@tishman/components';
import {TicketFeaturesList} from './TicketFeaturesList';
import {Article} from '@hzdg/sectioning';
import {useMemo} from 'react';
import {CardDetail} from '../common/CardDetail';

import type {TicketCard as TicketCardProps} from '../types';

export function TicketCard(props: TicketCardProps): JSX.Element {
  const {allFeatures, includedFeatures, openFeaturesList = true} = props;

  const sortedFeatures = useMemo(() => {
    return allFeatures
      ? allFeatures.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      : [];
  }, [allFeatures]);

  return (
    <Flex
      as={Article}
      sx={{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        minWidth: '215px',
      }}
    >
      <CardDetail {...props} />

      {allFeatures && openFeaturesList && (
        <TicketFeaturesList
          allFeatures={sortedFeatures}
          includedFeatures={includedFeatures}
        />
      )}
    </Flex>
  );
}
