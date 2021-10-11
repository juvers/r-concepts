/**@jsx jsx */
import {Grid, jsx} from '@tishman/components';
import {RedemptionSummary} from './redemption-summary';
import {RedemptionForm} from './redemption-form';

export function RedemptionComponent(): JSX.Element {
  return (
    <Grid gap={7} sx={{gridTemplateColumns: ['1fr', null, '286px 1fr']}}>
      <RedemptionSummary />
      <RedemptionForm />
    </Grid>
  );
}
