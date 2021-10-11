/* eslint-disable @typescript-eslint/no-explicit-any */
/** @jsx jsx */
import {jsx} from '@tishman/components';
import {graphql} from 'gatsby';
import {
  useRef,
  useMemo,
  useState,
  Fragment,
  useEffect,
  useCallback,
} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import invariant from 'invariant';
import userStore from '~buy-tickets/store/user/userStore';
import allPostsStore from '~buy-tickets/store/odt-posts/allPostsStore';
import BuyTicketsIntroBlock from '~blocks/BuyTicketsIntroBlock';
import BuyTicketsDateStepBlock from '~blocks/BuyTicketsDateStepBlock';
import BuyTicketsTimeStepBlock from '~blocks/BuyTicketsTimeStepBlock';
import BuyTicketsTicketStepBlock from '~blocks/BuyTicketsTicketStepBlock';
import BuyTicketsPurchaseStepBlock from '~blocks/BuyTicketsPurchaseStepBlock';
import {
  BuyTicketsModal,
  Wizard,
  BuyTicketsPage,
  TimeContext,
  timeoutError,
} from '~components/BuyTickets';
import {BuyTicketsLayout} from '~layouts/BuyTicketsLayout';
import {TishmanAttraction, TishmanFlow} from '~buy-tickets/constants/constants';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Black',
  pageName: 'Rockefeller Center Tour',
  logo: 'Rockefeller Center Tour',
  hideSearchToggleButton: true,
  leftNav: {to: '/buy-tickets/', label: 'BACK'},
};

export default function TourTickets({
  data,
}: {
  data: GatsbyTypes.BuyTicketsTourQuery;
}): JSX.Element {
  const [toggle, openModal] = useState(true);
  const closeModal = useCallback(() => openModal(false), []);
  const [userState, setUserState] = useState(userStore.initialState);

  const page = data.page;
  invariant(page, 'Expected valid buy tickets intro json');

  const ticketTypes = useMemo(() => {
    if (!page.ticketStep?.ticketTypes?.length)
      throw new Error('Expected ticket types for Rock Center Tour');
    return page.ticketStep.ticketTypes.map((ticket) => {
      if (!ticket?.ticketTypeId)
        throw new Error('Expected ticket type to have id');
      return {
        TicketCount: 0,
        TicketTypeId: ticket.ticketTypeId,
        TicketLabel: ticket.label,
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
    allPostsStore.clearData();
  }, []);

  useEffect(() => {
    if (userState.ticketSelectionList.length === 0) {
      userStore.sendData({
        attraction: TishmanAttraction.RockefellerCenterTour,
        flow: TishmanFlow.TOUR,
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
                data={data}
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
  const [timeLeft, setTimeLeft] = useState(600);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef: any = useRef();
  const startTimer = () => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft((timeLeft) => {
        if (timeLeft >= 1) {
          return timeLeft - 1;
        } else {
          resetTimer();
          userStore.sendData({currentStep: 1});
          timeoutError();
          return 0;
        }
      });
    }, 1000);
  };
  const stopTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setTimeLeft(600);
    setIsRunning(false);
  };

  return (
    <TimeContext.Provider value={timeLeft}>
      <BuyTicketsIntroBlock data={data} isRunning={isRunning} />
      <Wizard totalSteps={4} currentStep={currentStep}>
        <BuyTicketsTicketStepBlock data={data} hideLabel />
        <BuyTicketsDateStepBlock data={data} stepNumber={2} />
        <BuyTicketsTimeStepBlock data={data} stepNumber={3} />
        <BuyTicketsPurchaseStepBlock
          data={data}
          stepNumber={4}
          startTime={startTimer}
          stopTime={stopTimer}
          resetTime={resetTimer}
        />
      </Wizard>
    </TimeContext.Provider>
  );
};

export const query = graphql`
  query BuyTicketsTour {
    page: buyTicketsFlowJson(id: {eq: "buy-tickets-tour"}) {
      hero {
        title
        link {
          label
          modal
        }
      }
      ticketStep {
        title
        ticketTypes {
          label
          ticketTypeId
        }
      }
      dateStep {
        title
      }
      timeStep {
        title
      }
      purchaseStep {
        title
      }
      modalCard {
        title
        description
        cta {
          label
          url
        }
        link {
          label
          url
        }
        image {
          src {
            childImageSharp {
              fluid(maxWidth: 516) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
          alt
        }
      }
      modalCard2 {
        title
        description
        cta {
          label
          url
        }
        link {
          label
          url
        }
        image {
          src {
            childImageSharp {
              fluid(maxWidth: 516) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
          alt
        }
      }
    }
    meta: buyTicketsFlowJson(id: {eq: "buy-tickets-tour"}) {
      meta {
        title
        description
      }
    }
  }
`;
