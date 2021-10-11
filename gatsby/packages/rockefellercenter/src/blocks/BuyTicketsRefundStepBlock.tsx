/**@jsx jsx */
import {jsx, Box, Grid, Text, Container} from '@tishman/components';
import invariant from 'invariant';
import {BuyTicketsData, ModalLoader} from '~components/BuyTickets';
import {useState, useMemo, useEffect} from 'react';
import {RefundForm} from '~components/BuyTickets/Payment/Refund/refund-form';
import userStore from '~buy-tickets/store/user/userStore';

const BuyTicketsRefundStepBlock = ({
  data,
}: {
  data: BuyTicketsData;
}): JSX.Element => {
  const page = data.page;
  const [userState, setUserState] = useState(userStore.initialState);

  invariant(page, 'Expected valid buy tickets page json');

  const stepData = useMemo(() => {
    if (!page.ticketStep.title)
      throw new Error('Expected buy tickets page title');
    return {
      title: page.ticketStep.title,
      description: page.ticketStep.description,
    };
  }, [page]);

  useEffect(() => {
    const userSub = userStore.subscribe(setUserState);
    return () => userSub.unsubscribe();
  }, []);

  return userState.loading && userState.processPayment ? (
    <Box sx={{height: 800, width: '100%', position: 'relative'}}>
      <ModalLoader opacity={1} />
    </Box>
  ) : (
    <Container>
      <Grid gap={2} columns={[1, null, '1fr 2fr', '1fr 2fr']}>
        <Box>
          <Text variant="accessibilityHeading" sx={{mb: 4}}>
            Please provide your purchase information
          </Text>
          <Text>{stepData.description}</Text>
        </Box>
        <RefundForm />
      </Grid>
    </Container>
  );
};

export default BuyTicketsRefundStepBlock;
