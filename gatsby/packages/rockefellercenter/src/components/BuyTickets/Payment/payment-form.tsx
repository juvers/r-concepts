/** @jsx jsx */
import {
  jsx,
  Text,
  Flex,
  Box,
  Grid,
  Select,
  RequiredLabel,
  SubmitButton,
  Input,
  UnknownCardIcon,
  MasterCardIcon,
  DiscoverIcon,
  AmexIcon,
  VisaIcon,
  DinersIcon,
} from '@tishman/components';
import {navigate} from 'gatsby';
import {ODTForm} from '~buy-tickets/services/form-service';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import usStates from '~components/BuyTickets/Data/us-states.json';
import countries from '~components/BuyTickets/Data/countries.json';

interface PaymentFormValues {
  CardHolderName: string;
  EmailAddress: string;
  CreditCardNumber: string;
  ExpiryMonth: string | number;
  ExpiryYear: string | number;
  CVV: string;
  Country: string;
  BillingAddress: string;
  City: string;
  State: string;
  ZipCode: string;
}
const hiddenState = {
  CreditCardType: -1,
};

const amex = /^3[47][0-9]{13}$/;
const visa = /^4[0-9]{12}(?:[0-9]{3})?$/;
const mastercard = /^5[1-5][0-9]{14}$/;
const mastercard2 = /^2[2-7][0-9]{14}$/;
const discover1 = /^6011[0-9]{12}[0-9]*$/;
const discover2 = /^62[24568][0-9]{13}[0-9]*$/;
const discover3 = /^6[45][0-9]{14}[0-9]*$/;
const diners = /^3[0689][0-9]{12}[0-9]*$/;
const monthsDigits = [
  '-',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
];

const yy = Number(new Date().getFullYear().toString().slice(2, 4));
const yearDigits: Array<number | string> = Array.from(
  {length: 10},
  (_, i: number) => i + yy,
);
yearDigits.unshift('-');

const getCardType = (cc: string): JSX.Element => {
  if (visa.test(cc)) return <VisaIcon />;
  if (mastercard.test(cc) || mastercard2.test(cc)) return <MasterCardIcon />;
  if (amex.test(cc)) return <AmexIcon />;
  if (discover1.test(cc) || discover2.test(cc) || discover3.test(cc))
    return <DiscoverIcon />;
  if (diners.test(cc)) return <DinersIcon />;
  return <UnknownCardIcon />;
};
export const PaymentForm = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    errors,
    clearErrors,
    setError,
    formState,
    reset,
    getValues,
  } = useForm<PaymentFormValues>();

  const [creditCardDetails, setCreditCardDetails] = useState('');
  const [hiddenData, setHiddenData] = useState(hiddenState);
  const handleHiddenData = () => {
    const getCardCode = (cc: string): number => {
      if (visa.test(cc)) return 1;
      if (mastercard.test(cc) || mastercard2.test(cc)) return 2;
      if (amex.test(cc)) return 3;
      if (discover1.test(cc) || discover2.test(cc) || discover3.test(cc))
        return 4;
      if (diners.test(cc)) return 5;
      return -1;
    };
    setHiddenData({
      ...hiddenData,
      CreditCardType: getCardCode(creditCardDetails),
    });
  };

  const onSuccess = () => {
    console.log('Successfully executed');
    sessionStorage.setItem('fromCheckout', JSON.stringify(true));
    navigate('/buy-tickets/confirmation');
  };

  return (
    <ODTForm
      reactHookHandleSubmit={handleSubmit}
      errors={errors}
      clearErrors={clearErrors}
      setError={setError}
      onSuccess={onSuccess}
      id={'payment'}
      reset={reset}
    >
      <Box sx={{mb: 5}}>
        <Input
          text="Full Name"
          name="CardHolderName"
          placeholder="Enter Full Name"
          ref={register({required: 'Please enter your full name'})}
          sx={{
            borderColor: errors.CardHolderName && '#EC104E',
            '::placeholder': {
              color: '#fff',
            },
          }}
          required
        />
        {errors.CardHolderName && (
          <Text variant="formError">{errors.CardHolderName.message}</Text>
        )}

        <Input
          text="Email"
          name="EmailAddress"
          placeholder="Enter email address"
          ref={register({
            required: 'Please enter a valid email address',
            pattern: {
              value: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/,
              message: 'Please enter a valid email address',
            },
          })}
          sx={{
            borderColor: errors.EmailAddress && '#EC104E',
            '::placeholder': {
              color: '#fff',
            },
          }}
          required
        />
        {errors.EmailAddress && (
          <Text variant="formError">{errors.EmailAddress.message}</Text>
        )}

        <Box sx={{position: 'relative'}}>
          <Input
            text="Credit Card Number"
            name="CreditCardNumber"
            placeholder="1234 1234 1234 1234"
            ref={register({
              required: 'Please enter a valid credit card',
              pattern: {
                value: /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
                message: 'Please enter a valid credit card',
              },
            })}
            sx={{
              borderColor: errors.CreditCardNumber && '#EC104E',
              '::placeholder': {
                color: '#fff',
              },
            }}
            required
            onChange={({target}) => {
              setCreditCardDetails(target.value);
            }}
            onBlur={handleHiddenData}
          />
          {errors.CreditCardNumber && (
            <Text variant="formError">{errors.CreditCardNumber.message}</Text>
          )}
          <Box sx={{position: 'absolute', right: '0.5em', top: '0.75em'}}>
            {getCardType(creditCardDetails)}
          </Box>
        </Box>

        <Grid columns={3}>
          <Box>
            <Select
              text="Expiration Month"
              name="ExpiryMonth"
              ref={register({
                required: 'Please select expiry month',
                pattern: {
                  value: /^[^-]+$/,
                  message: 'Please select a valid date',
                },
              })}
              sx={{
                borderColor: errors.Country && '#EC104E',
                '::placeholder': {
                  color: '#fff',
                },
              }}
              required
              onChange={({target}) => {
                const a = getValues('ExpiryYear');
                const today = new Date();
                const expiry = new Date();
                expiry.setFullYear(Number(`20${a}`), Number(target.value), 1);
                if (expiry < today) {
                  setError('ExpiryMonth', {
                    type: 'manual',
                    message: 'Enter a valid expiration date',
                  });
                  setError('ExpiryYear', {
                    type: 'manual',
                    message: 'Enter a valid expiration date',
                  });
                } else {
                  clearErrors('ExpiryMonth');
                  clearErrors('ExpiryYear');
                }
              }}
            >
              {monthsDigits.map((x: string) => (
                <option key={x}>{x}</option>
              ))}
            </Select>
            {errors.ExpiryMonth && (
              <Text variant="formError">{errors.ExpiryMonth.message}</Text>
            )}
          </Box>
          <Box>
            <Select
              text="Expiration Year"
              name="ExpiryYear"
              ref={register({
                required: 'Please select expiry year',
                pattern: {
                  value: /^[^-]+$/,
                  message: 'Please select a valid date',
                },
              })}
              sx={{
                borderColor: errors.Country && '#EC104E',
                '::placeholder': {
                  color: '#fff',
                },
              }}
              required
              onChange={({target}) => {
                const a = getValues('ExpiryMonth');
                const today = new Date();
                const expiry = new Date();
                expiry.setFullYear(Number(`20${target.value}`), Number(a), 1);
                if (expiry < today) {
                  setError('ExpiryMonth', {
                    type: 'manual',
                    message: 'Enter a valid expiration date',
                  });
                  setError('ExpiryYear', {
                    type: 'manual',
                    message: 'Enter a valid expiration date',
                  });
                } else {
                  clearErrors('ExpiryMonth');
                  clearErrors('ExpiryYear');
                }
              }}
            >
              {yearDigits.map((x: string | number) => (
                <option key={x}>{x}</option>
              ))}
            </Select>
            {errors.ExpiryYear && (
              <Text variant="formError">{errors.ExpiryYear.message}</Text>
            )}
          </Box>
          <Box>
            <Input
              text="Security Code"
              name="CVV"
              placeholder="CVV"
              ref={register({
                required: 'Required',
                pattern: {
                  value: /^[0-9]{3,4}$/,
                  message: 'Please enter security code',
                },
              })}
              sx={{
                borderColor: errors.CVV && '#EC104E',
                '::placeholder': {
                  color: '#fff',
                },
              }}
              required
            />
            {errors.CVV && (
              <Text variant="formError">{errors.CVV.message}</Text>
            )}
          </Box>
        </Grid>
        <Select
          text="Country"
          name="Country"
          ref={register({
            required: 'Please select country',
          })}
          sx={{
            borderColor: errors.Country && '#EC104E',
            '::placeholder': {
              color: '#fff',
            },
          }}
          required
        >
          <option>{'USA'}</option>
          {countries
            .filter((item) => item.Country !== 'USA')
            .map((x: {Country: string}) => (
              <option key={x.Country}>{x.Country}</option>
            ))}
        </Select>
        {errors.Country && (
          <Text variant="formError">{errors.Country.message}</Text>
        )}

        <Input
          text="Billing Address"
          placeholder="Enter Billing Address"
          name="BillingAddress"
          ref={register({required: 'Please enter address'})}
          sx={{
            borderColor: errors.BillingAddress && '#EC104E',
            '::placeholder': {
              color: '#fff',
            },
          }}
          required
        />
        {errors.BillingAddress && (
          <Text variant="formError">{errors.BillingAddress.message}</Text>
        )}
        <Grid
          columns={
            getValues('Country') == 'USA'
              ? [1, null, '2fr 1fr 2fr']
              : [1, null, '3fr 2fr']
          }
        >
          <Box>
            <Input
              text="City"
              name="City"
              placeholder="Enter City"
              ref={register({required: 'Please enter city'})}
              sx={{
                borderColor: errors.City && '#EC104E',
                '::placeholder': {
                  color: '#fff',
                },
              }}
              required
            />
            {errors.City && (
              <Text variant="formError">{errors.City.message}</Text>
            )}
          </Box>
          {getValues('Country') == 'USA' && (
            <Box>
              <Select
                text="State"
                name="State"
                ref={register({
                  required: 'Please select state',
                })}
                sx={{
                  borderColor: errors.State && '#EC104E',
                  '::placeholder': {
                    color: '#fff',
                  },
                }}
              >
                <option value={''}>{''}</option>
                {usStates.map((x: {name: string; abbreviation: string}) => (
                  <option key={x.name} value={x.name}>
                    {x.abbreviation}
                  </option>
                ))}
              </Select>
              {errors.State && (
                <Text variant="formError">{errors.State.message}</Text>
              )}
            </Box>
          )}
          <Box>
            <Input
              text="ZIP Code"
              name="ZipCode"
              placeholder="Enter ZIP Code"
              ref={register({required: 'Please enter zipcode'})}
              sx={{
                borderColor: errors.ZipCode && '#EC104E',
                '::placeholder': {
                  color: '#fff',
                },
              }}
              required
            />
            {errors.ZipCode && (
              <Text variant="formError">{errors.ZipCode.message}</Text>
            )}
          </Box>
        </Grid>
      </Box>
      <Box sx={{display: 'none'}}>
        <Input
          text="CreditCardType"
          ref={register}
          name="CreditCardType"
          value={hiddenData.CreditCardType}
          onChange={() => console.log('')}
        />
      </Box>
      <Flex
        sx={{
          justifyContent: 'space-between',
          flexDirection: ['column', null, 'row'],
        }}
      >
        <Box sx={{mb: [4, null]}}>
          <RequiredLabel labelText="Required*" />
        </Box>
        <SubmitButton
          text={formState.isSubmitting ? `Submitting...` : `Confirm Order`}
          disabled={formState.isSubmitting}
        />
      </Flex>
    </ODTForm>
  );
};
