/* eslint-disable @typescript-eslint/no-explicit-any */
/** @jsx jsx */
import {jsx, Container, IntrinsicBox} from '@tishman/components';
import {ReactNode, useState, useEffect} from 'react';
import {useErrorHandler} from 'react-error-boundary';
import {postItem$, getItem$} from '~buy-tickets/services/http-client';
import allPostsStore from '~buy-tickets/store/odt-posts/allPostsStore';
import userStore from '~buy-tickets/store/user/userStore';
import usStates from '~components/BuyTickets/Data/us-states.json';
import {
  RefundErrorMessages,
  standardError,
} from '~buy-tickets/constants/constants';

import type {UseFormMethods, SubmitHandler} from 'react-hook-form';
import {CityPassType} from '~components/BuyTickets';

type SubmitError = {
  message: {message: string; errorTicket: string; error: string}[];
};

type InternalFormProps<
  Values extends Record<string, unknown>
> = FormProps<Values> & {
  errors: Record<string, SubmitError>;
  clearErrors: (name?: string) => void;
  setError: (
    name: string,
    options: Parameters<FormProps<Values>['setError']>[1],
  ) => void;
};

interface FormProps<Values extends Record<string, unknown>> {
  id: string;
  reactHookHandleSubmit: UseFormMethods<Values>['handleSubmit'];
  errors: UseFormMethods<Values>['errors'];
  clearErrors: UseFormMethods<Values>['clearErrors'];
  setError: UseFormMethods<Values>['setError'];
  onSuccess: () => void;
  reset: UseFormMethods<Values>['reset'];
  url?: string;
  children: ReactNode;
  autoComplete?: string;
  showErrorMessage?: boolean;
  name?: string;
  // Image Dimesnions for Images file type Upload
  dimensions?: {
    width: string;
    height: string;
  };
}

export function ODTForm<Values extends Record<string, unknown>>(
  props: FormProps<Values>,
): JSX.Element {
  const [submitAttempt, setSubmitAttempt] = useState(false);
  const [userState, setUserState] = useState(userStore.initialState);
  const [allPostsState, setAllPostsState] = useState(
    allPostsStore.initialState,
  );
  const handleError = useErrorHandler();

  const {
    id,
    reactHookHandleSubmit,
    children,
    errors,
    setError,
    clearErrors,
    onSuccess,
    reset,
    autoComplete = 'on',
    showErrorMessage = true,
    ...formProps
  } = props as InternalFormProps<Values>;

  if (!clearErrors) {
    throw `'clearErrors' is required for Forms for ${id}`;
  }
  if (!setError) {
    throw `'setError' is required for Forms for ${id}`;
  }
  if (!reset) {
    throw `'reset' is required for Forms for ${id}`;
  }
  if (!reactHookHandleSubmit) {
    throw `'reactHookHandleSubmit' is required for Forms for ${id}`;
  }

  useEffect(() => {
    const postsSub = allPostsStore.subscribe(setAllPostsState);
    const userSub = userStore.subscribe(setUserState);
    postsSub.add(userSub);
    return () => postsSub.unsubscribe();
  }, [allPostsState, userState]);

  const submitForm: SubmitHandler<Values> = async (values, event) => {
    event?.preventDefault();

    // Payment Processing
    if (event?.target.id === 'payment') {
      setSubmitAttempt(true);
      clearErrors('server');
      // reset();
      const extraValues = {
        SaleId: allPostsState.sale.SaleId,
        SignUpForPromotionalMaterial: false,
        WorksAtRockefellerCenter: false,
        HowDidYouLearnAboutUs: 'Internet',
      };
      const postValues: any = {
        ...values,
        ...extraValues,
      };
      userStore.sendData({
        loading: true,
        processPayment: true,
      });

      const getPrice = (type: string | number, arr: any[]) =>
        arr.filter((x) => x.label === type)[0].price;
      const createCollection = userState.ticketSelectionList.reduce(
        (
          acc: {
            sku: any;
            name: any;
            category: string;
            quantity: any;
            price: any;
          }[],
          curr: {
            TicketLabel: string;
            TicketCount: any;
            TicketTypeId: number;
          },
        ) => {
          acc.push({
            sku: curr.TicketTypeId,
            name: curr.TicketLabel,
            category: userState.flow,
            quantity: curr.TicketCount,
            price: getPrice(curr.TicketLabel, userState.ticketsForAnalytics),
          });
          return acc;
        },
        [],
      );
      const sunset = {
        sku: 4,
        name: 'Sunset',
        price: '10.00',
        category: 'Sunset',
        quantity: userState.totalNumberOfTickets,
      };
      createCollection.push(sunset);
      postItem$('Payment', postValues).subscribe(
        (response: any) => {
          const state = usStates.find((x) => x.name === postValues.State);
          allPostsStore.sendData(response, 'payment');
          userStore.sendData({
            name: postValues.CardHolderName,
            email: postValues.EmailAddress,
            cardType: postValues.CreditCardType,
            card: postValues.CreditCardNumber.slice(-4),
            country: postValues.Country,
            address1: postValues?.BillingAddress,
            address2: `${postValues.City}, ${
              postValues.State && state ? state.abbreviation : ''
            } ${postValues.ZipCode}`,
          });
          window.dataLayer.push({
            event: 'Transaction',
            transactionId: allPostsState.sale.SaleId,
            transactionTotal: `${userState.totalPrice + userState.totalTax}`,
            transactionTax: userState.totalTax,
            transactionProducts: createCollection,
          });
          onSuccess();
        },
        (error: Error) => {
          const errorCollection = {
            message: error.message,
            name: error.name,
            stack: error.stack,
          };
          window.dataLayer.push({
            event: 'Transaction',
            transactionId: allPostsState.sale.SaleId,
            transactionTotal: `${userState.totalPrice + userState.totalTax}`,
            transactionTax: userState.totalTax,
            transactionProducts: createCollection,
            Error: JSON.stringify(errorCollection),
          });
          userStore.sendData({
            loading: false,
            currentStep: 1,
          });
          handleError(error);
        },
      );
    } else if (event?.target.id === 'refund') {
      const unpackedValues: any = {...values};
      userStore.sendData({
        loading: true,
        processPayment: true,
      });

      if (unpackedValues.RefundOther && unpackedValues.RefundOther.length > 0) {
        unpackedValues.RefundReason = unpackedValues.RefundOther;
      }
      delete unpackedValues.RefundOther;
      getItem$(
        `RefundablePayment?barcode=${unpackedValues?.Barcode}&creditCardSuffix=${unpackedValues?.CreditCardSuffix}&creditCardType=${unpackedValues.CreditCardType}&cardHoldername=${unpackedValues.CardHolderName}`,
      ).subscribe(
        (x: any) => {
          if (x.IsRefundable === true) {
            postItem$('Refund', unpackedValues).subscribe((x: any) => {
              allPostsStore.sendData(x, 'refund');
              userStore.sendData({
                name: unpackedValues.CardHolderName,
                cardType: unpackedValues.CreditCardType,
                card: unpackedValues.CreditCardSuffix,
                reason: unpackedValues.RefundReason,
              });
              onSuccess();
            });
          } else if (x.IsRefundable === false) {
            userStore.sendData({loading: false});
            const error = new Error(
              `Reason: ${
                RefundErrorMessages.find(
                  (m) => m.reason === x.NonRefundableReason,
                )?.message
              }`,
            );
            error.name = 'Sorry, we couldn’t complete your refund';
            handleError(error);
          }
        },
        (error) => {
          userStore.sendData({loading: false});
          const err = new Error(standardError.message);
          err.name = standardError.name;
          err.stack = error.stack;
          handleError(err);
        },
      );
    } else if (event?.target.id === 'redemption') {
      const unpackedValues: any = {...values};
      userStore.sendData({
        loading: true,
        processPayment: true,
      });
      const extraValues = {
        SaleId: allPostsState.sale.SaleId,
        SignUpForPromotionalMaterial: false,
        WorksAtRockefellerCenter: false,
        HowDidYouLearnAboutUs: 'Internet',
        CityPassTickets: userState.redemptionCodes.map(
          (item: CityPassType) => ({
            CityPassBarcode: item.CityPassBarcode,
            TicketTypeId: item.TicketTypeId,
          }),
        ),
      };
      const postValues: any = {
        ...unpackedValues,
        ...extraValues,
      };
      postItem$(`citypass/payment`, postValues).subscribe(
        (response: any) => {
          allPostsStore.sendData(response, 'payment');
          userStore.sendData({
            name: postValues.FullName,
            email: postValues.EmailAddress,
          });
          onSuccess();
        },
        (error: Error) => {
          userStore.sendData({loading: false});
          const err = new Error(standardError.message);
          err.name = standardError.name;
          err.stack = error.stack;
          handleError(err);
        },
      );
    }
  };

  const errorMessages = Object.keys(errors).map((errorKey) => {
    const error = errors[errorKey]?.message;
    if (error instanceof Array) {
      const ticket = error[0].errorTicket;
      const message = error[0].message;
      return (
        <div key={errorKey}>
          {message}
          <br />
          {ticket ? ` Ticket: ${ticket}` : null}
          {errorKey === 'fetch' ? 'Fetch Error: 001' : null}
        </div>
      );
    } else {
      return null;
    }
  });

  return (
    <IntrinsicBox ratio={9 / 1}>
      <Container sx={{maxWidth: 900, p: 0}}>
        <form
          id={id}
          onSubmit={reactHookHandleSubmit(submitForm)}
          noValidate
          autoComplete={autoComplete}
          action="POST"
          {...formProps}
        >
          {children}
        </form>
      </Container>
      {showErrorMessage && (
        <Container>
          {submitAttempt && errorMessages && errorMessages.length > 0
            ? errorMessages
            : null}
        </Container>
      )}
    </IntrinsicBox>
  );
}
