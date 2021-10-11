/**@jsx jsx */
import {jsx, Container} from '@tishman/components';
import {ErrorBoundary} from 'react-error-boundary';
import {useState, Fragment, useCallback} from 'react';
import BuyTicketsCrossLinkBlock from '~blocks/BuyTicketsCrossLinkBlock';
import BuyTicketsConfirmationBlock from '~blocks/BuyTicketsConfirmationBlock';
import {BuyTicketsModal} from '~components/BuyTickets';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  pageName: null,
  logo: 'Top of the Rock Buy Tickets',
  hideSearchToggleButton: false,
};

const BuyTicketsConformation = (): JSX.Element => {
  const [toggle, openModal] = useState(true);
  const closeModal = useCallback(() => openModal(false), []);
  return (
    <ErrorBoundary
      onReset={closeModal}
      resetKeys={[toggle]}
      fallbackRender={({error, resetErrorBoundary}) => {
        return (
          <Fragment>
            <Page />
            <BuyTicketsModal
              toggle={toggle}
              closeModal={resetErrorBoundary}
              error={error}
            />
          </Fragment>
        );
      }}
    >
      <Page />
    </ErrorBoundary>
  );
};

const Page = (): JSX.Element => {
  return (
    <Container>
      <BuyTicketsConfirmationBlock />
      <BuyTicketsCrossLinkBlock />
    </Container>
  );
};

export default BuyTicketsConformation;
