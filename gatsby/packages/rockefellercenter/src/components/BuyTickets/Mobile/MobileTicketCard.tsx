/** @jsx jsx */
import {jsx, Box} from '@tishman/components';
import {CardDetail} from '../common/CardDetail';
import {IncludedFeaturesList} from './IncludedFeaturesList';

import type {Ticket} from '../types';

export function MobileTicketCard(props: Ticket): JSX.Element {
  return (
    <Box
      sx={{
        mt: '36px',
      }}
    >
      <CardDetail {...props} buttonPosition="aboveDescription" />
      {props.includedFeatures && (
        <IncludedFeaturesList includedFeatures={props.includedFeatures} />
      )}
    </Box>
  );
}
