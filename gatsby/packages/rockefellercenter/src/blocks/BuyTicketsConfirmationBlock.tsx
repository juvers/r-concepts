/** @jsx jsx */
import {jsx, Box, Section, Flex} from '@tishman/components';
import {graphql, useStaticQuery, navigate} from 'gatsby';
import {useMemo, useState, useEffect, useCallback} from 'react';
import invariant from 'invariant';
import {getItem$} from '~buy-tickets/services/http-client';
import {
  Contact,
  Intro,
  OrderSummary,
  RedemptionSummary,
  RefundInfo,
  RefundSummary,
  ModalLoader,
  useIsMounted,
} from '~components/BuyTickets';
import userStore from '~buy-tickets/store/user/userStore';
import allPostsStore from '~buy-tickets/store/odt-posts/allPostsStore';
import {TishmanFlow} from '~buy-tickets/constants/constants';

import type {ComponentPropsWithoutRef} from 'react';

const BUY_TICKETS_CONFIRMATION_QUERY = graphql`
  query BuyTicketsConfirmation {
    dataJson(id: {eq: "buy-tickets"}) {
      confirmation {
        deck {
          title
          description
        }
        vip {
          title
          description
        }
        tour {
          title
          description
        }
        rockPass {
          title
          description
        }
        cityPassRedemption {
          title
          description
        }
        refund {
          title
          description
        }
      }
    }
  }
`;

const BuyTicketsConfirmationBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.BuyTicketsConfirmationQuery>(
    BUY_TICKETS_CONFIRMATION_QUERY,
  );

  invariant(dataJson, 'Buy Tickets confirmation JSON data is required!');

  const isMounted = useIsMounted();
  const [isAsync, setIsAsync] = useState(
    typeof window !== 'undefined' &&
      window.sessionStorage.getItem('fromCheckout') === 'true',
  );
  const [showLoader, setShowLoader] = useState(true);
  const [userState, setUserState] = useState(userStore.initialState);
  const [allPostsState, setAllPostsState] = useState(
    allPostsStore.initialState,
  );

  const isRefund = userState.flow === TishmanFlow.REFUND;
  const isRedemption = userState.flow === TishmanFlow.REDEMPTION;

  const getSale = useCallback(async () => {
    if (allPostsState?.payment?.SaleId) {
      await getItem$(`Sale?saleId=${allPostsState.payment.SaleId}`).subscribe(
        (res) => {
          allPostsStore.sendData(res, 'saleWithGet');
          setShowLoader(false);
          sessionStorage.clear();
        },
      );
    }
  }, [allPostsState.payment]);

  useEffect(() => {
    const userSub = userStore.subscribe(setUserState);
    const postsSub = allPostsStore.subscribe(setAllPostsState);
    userSub.add(postsSub);
    return () => userSub.unsubscribe();
  }, []);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.sessionStorage.getItem('fromCheckout') !== 'true'
    )
      navigate('/buy-tickets/');
  }, []);

  useEffect(() => {
    if (isAsync) {
      const effect = async () => {
        if (isRefund) {
          setShowLoader(false);
          sessionStorage.clear();
        } else {
          await getSale();
        }
        if (!isMounted()) return;
        setIsAsync(false);
      };
      effect();
    }
  }, [isAsync, getSale, setIsAsync, isRefund, isMounted]);

  const confirmationProps = useMemo(() => {
    return {
      deck: {
        title: dataJson.confirmation.deck.title,
        description: dataJson.confirmation.deck.description,
      },
      tour: {
        title: dataJson.confirmation.tour.title,
        description: dataJson.confirmation.tour.description,
      },
      vip: {
        title: dataJson.confirmation.vip.title,
        description: dataJson.confirmation.vip.description,
      },
      rockPass: {
        title: dataJson.confirmation.rockPass.title,
        description: dataJson.confirmation.rockPass.description,
      },
      cityPassRedemption: {
        title: dataJson.confirmation.cityPassRedemption.title,
        description: dataJson.confirmation.cityPassRedemption.description,
      },
      refund: {
        title: dataJson.confirmation.refund.title,
        description: dataJson.confirmation.refund.description,
      },
    };
  }, [dataJson]);

  const introData = () => {
    switch (userState.flow) {
      case TishmanFlow.DECK:
      case TishmanFlow.CITY_PASS:
      case TishmanFlow.C3:
        return confirmationProps.deck;
      case TishmanFlow.TOUR:
        return confirmationProps.tour;
      case TishmanFlow.VIP:
        return confirmationProps.vip;
      case TishmanFlow.REFUND:
        return confirmationProps.refund;
      case TishmanFlow.ROCK_PASS:
        return confirmationProps.rockPass;
      case TishmanFlow.REDEMPTION:
        return confirmationProps.cityPassRedemption;
      default:
        return confirmationProps.deck;
    }
  };

  return showLoader ? (
    <Box sx={{height: 800, width: '100%', position: 'relative'}}>
      <ModalLoader opacity={1} />
    </Box>
  ) : (
    <Section sx={{px: [0, 8]}} {...props}>
      <Flex
        sx={{
          justifyContent: 'space-between',
          flexDirection: ['column', 'column', 'row'],
        }}
      >
        <Box
          sx={{
            width: ['100%', '100%', '50%'],
            marginTop: [0, 7],
          }}
        >
          <Intro
            isRefund={isRefund}
            saleId={isRefund ? '' : allPostsState?.payment?.SaleId}
            confirmationNumber={
              isRefund
                ? allPostsState?.refund?.Barcode
                : allPostsState?.saleWithGet?.SaleBarcode
            }
            flow={userState.flow}
            datetime={userState.datetime || userState.date}
            {...introData()}
          />
        </Box>
        <Box
          sx={{
            width: ['100%', '100%', '43%'],
            marginTop: [5, 7],
            marginBottom: 7,
          }}
        >
          {isRefund ? (
            <RefundSummary />
          ) : isRedemption ? (
            <RedemptionSummary />
          ) : (
            <OrderSummary />
          )}
          {isRefund ? <RefundInfo /> : <Contact />}
        </Box>
      </Flex>
    </Section>
  );
};

export default BuyTicketsConfirmationBlock;
