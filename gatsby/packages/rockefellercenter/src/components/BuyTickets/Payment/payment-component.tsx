/**@jsx jsx */
import {Grid, jsx} from '@tishman/components';
import {OrderSummary} from './order-summary';
import {PaymentForm} from './payment-form';

export function PaymentComponent(): JSX.Element {
  return (
    <Grid gap={7} sx={{gridTemplateColumns: ['1fr', null, '286px 1fr']}}>
      <OrderSummary showPromoCodeField />
      <PaymentForm />
    </Grid>
  );
}
