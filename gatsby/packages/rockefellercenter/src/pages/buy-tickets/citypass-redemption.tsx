/** @jsx jsx */
import {jsx} from '@tishman/components';
import {graphql} from 'gatsby';
import {useState, useCallback, Fragment, useMemo, useEffect} from 'react';
import invariant from 'invariant';
import userStore from '~buy-tickets/store/user/userStore';
import {ErrorBoundary} from 'react-error-boundary';
import BuyTicketsDateStepBlock from '~blocks/BuyTicketsDateStepBlock';
import BuyTicketsIntroBlock from '~blocks/BuyTicketsIntroBlock';
import BuyTicketsPurchaseStepBlock from '~blocks/BuyTicketsPurchaseStepBlock';
import BuyTicketsTimeStepBlock from '~blocks/BuyTicketsTimeStepBlock';
import BuyTicketsCityPassStepBlock from '~blocks/BuyTicketsCityPassStepBlock';
import {BuyTicketsModal, Wizard, BuyTicketsPage} from '~components/BuyTickets';
import {BuyTicketsLayout} from '~layouts/BuyTicketsLayout';
import {TishmanAttraction, TishmanFlow} from '~buy-tickets/constants/constants';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Cream',
  pageName: null,
  logo: 'Top of the Rock Buy Tickets',
  hideSearchToggleButton: true,
  leftNav: {to: '/buy-tickets/', label: 'BACK'},
};

export default function CityPassRedemption({
  data,
}: {
  data: GatsbyTypes.BuyTicketsCityPassRedemptionQuery;
}): JSX.Element {
  const [toggle, openModal] = useState(true);
  const closeModal = useCallback(() => openModal(false), []);
  const [userState, setUserState] = useState(userStore.initialState);

  const page = data.page;
  invariant(page, 'Expected valid buy tickets intro json');

  const ticketTypes = useMemo(() => {
    if (!page.ticketStep?.ticketTypes?.length)
      throw new Error('Expected ticket types for Top of the Rock');
    return page.ticketStep.ticketTypes.map((ticket) => {
      if (!ticket?.ticketTypeId)
        throw new Error('Expected ticket type to have id');
      return {
        TicketCount: 0,
        TicketLabel: ticket.label,
        TicketTypeId: ticket.ticketTypeId,
      };
    });
  }, [page]);

  useEffect(() => {
    if (!toggle) openModal(true);
  }, [toggle]);

  useEffect(() => {
    const userSub = userStore.subscribe(setUserState);
    return () => userSub.unsubscribe();
  }, []);

  useEffect(() => {
    userStore.clearData();
  }, []);

  useEffect(() => {
    if (userState.ticketSelectionList.length === 0) {
      userStore.sendData({
        attraction: TishmanAttraction.TopOfTheRockObservationDeck,
        flow: TishmanFlow.REDEMPTION,
        ticketSelectionList: ticketTypes,
      });
    }
  }, [ticketTypes, userState.ticketSelectionList.length]);

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
      <Wizard totalSteps={4} currentStep={currentStep}>
        <BuyTicketsCityPassStepBlock data={data} stepNumber={1} />
        <BuyTicketsDateStepBlock data={data} stepNumber={2} />
        <BuyTicketsTimeStepBlock data={data} stepNumber={3} />
        <BuyTicketsPurchaseStepBlock data={data} stepNumber={4} />
      </Wizard>
    </Fragment>
  );
};

export const query = graphql`
  query BuyTicketsCityPassRedemption {
    page: buyTicketsFlowJson(id: {eq: "buy-tickets-city-pass-redemption"}) {
      hero {
        title
      }
      ticketStep {
        title
        description
        ticketTypes {
          ticketTypeId
          label
        }
      }
      dateStep {
        title
        description
      }
      timeStep {
        title
      }
      purchaseStep {
        title
      }
    }
    meta: buyTicketsFlowJson(id: {eq: "buy-tickets-city-pass-redemption"}) {
      meta {
        title
        description
      }
    }
  }
`;
