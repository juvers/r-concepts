/** @jsx jsx */
import {jsx} from '@tishman/components';
import {graphql} from 'gatsby';
import {useState, useCallback, Fragment, useEffect} from 'react';
import userStore from '~buy-tickets/store/user/userStore';
import allPostsStore from '~buy-tickets/store/odt-posts/allPostsStore';
import {ErrorBoundary} from 'react-error-boundary';
import BuyTicketsIntroBlock from '~blocks/BuyTicketsIntroBlock';
import BuyTicketsRefundStepBlock from '~blocks/BuyTicketsRefundStepBlock';
import {BuyTicketsModal, Wizard, BuyTicketsPage} from '~components/BuyTickets';
import {BuyTicketsLayout} from '~layouts/BuyTicketsLayout';
import {TishmanAttraction, TishmanFlow} from '~buy-tickets/constants/constants';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Top of the Rock Blue',
  pageName: null,
  logo: 'Top of the Rock Buy Tickets',
  hideSearchToggleButton: true,
  leftNav: {to: '/buy-tickets/', label: 'BACK'},
};

export default function CityPassRedemption({
  data,
}: {
  data: GatsbyTypes.BuyTicketsCityPassRefundsQuery;
}): JSX.Element {
  const [toggle, openModal] = useState(true);
  const closeModal = useCallback(() => openModal(false), []);
  const [userState, setUserState] = useState(userStore.initialState);

  useEffect(() => {
    if (!toggle) openModal(true);
  }, [toggle]);

  useEffect(() => {
    const userSub = userStore.subscribe(setUserState);
    return () => userSub.unsubscribe();
  }, []);

  useEffect(() => {
    userStore.clearData();
    allPostsStore.clearData();
  }, []);

  useEffect(() => {
    userStore.sendData({
      attraction: TishmanAttraction.TopOfTheRockObservationDeck,
      flow: TishmanFlow.REFUND,
    });
  }, []);

  return (
    <BuyTicketsLayout>
      <ErrorBoundary
        onReset={closeModal}
        resetKeys={[toggle]}
        fallbackRender={({error, resetErrorBoundary}) => {
          return (
            <Fragment>
              <Page data={data} currentStep={userState.currentStep} />
              <BuyTicketsModal
                toggle={toggle}
                closeModal={resetErrorBoundary}
                error={error}
              />
            </Fragment>
          );
        }}
      >
        <Page data={data} currentStep={userState.currentStep} />
      </ErrorBoundary>
    </BuyTicketsLayout>
  );
}

const Page = ({data, currentStep}: BuyTicketsPage): JSX.Element => {
  return (
    <Fragment>
      <BuyTicketsIntroBlock data={data} isRunning={false} showPrice={false} />
      <Wizard totalSteps={1} currentStep={currentStep}>
        <BuyTicketsRefundStepBlock data={data} />
      </Wizard>
    </Fragment>
  );
};

export const query = graphql`
  query BuyTicketsCityPassRefunds {
    page: buyTicketsFlowJson(id: {eq: "buy-tickets-refunds"}) {
      hero {
        title
      }
      ticketStep {
        title
        description
      }
    }
    meta: buyTicketsFlowJson(id: {eq: "buy-tickets-refunds"}) {
      meta {
        title
        description
      }
    }
  }
`;
