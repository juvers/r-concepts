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
  Textarea,
} from '@tishman/components';
import {useState} from 'react';
import {navigate} from 'gatsby';
import {ODTForm} from '~buy-tickets/services/form-service';
import {useForm} from 'react-hook-form';

interface RefundFormValues {
  Barcode: string;
  CardHolderName: string;
  CreditCardSuffix: string;
  CreditCardType: number;
  RefundReason: string;
}

const reasons = [
  'Purchased the wrong Ticket',
  'Trip cancellation or schedule change',
  'Accidental purchase',
  'Other(fill in the blank)',
];

const cardType = [
  {
    name: 'Select Card Type',
    type: -1,
  },
  {
    name: 'Visa',
    type: 1,
  },
  {
    name: 'MasterCard',
    type: 2,
  },
  {
    name: 'Amex',
    type: 3,
  },
  {
    name: 'Discover',
    type: 4,
  },
  {
    name: 'Diners',
    type: 5,
  },
];

export const RefundForm = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    errors,
    clearErrors,
    setError,
    formState,
    reset,
  } = useForm<RefundFormValues>();

  const [showOther, setShowOther] = useState(false);

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
      id={'refund'}
      reset={reset}
    >
      <Box sx={{mb: 5}}>
        <Input
          text="Ticket Number"
          name="Barcode"
          placeholder="1234..."
          ref={register({
            required: 'Required',
            pattern: {
              value: /^[0-9]{14}$/,
              message: 'Please enter your 14 digits Ticket Number',
            },
          })}
          sx={{
            borderColor: errors.Barcode && '#EC104E',
          }}
          required
        />
        {errors.Barcode && (
          <Text variant="formError">{errors.Barcode.message}</Text>
        )}

        <Input
          text="Cardholder Name"
          name="CardHolderName"
          placeholder="Name"
          ref={register({required: 'Please enter your full name'})}
          sx={{
            borderColor: errors.CardHolderName && '#EC104E',
          }}
          required
        />
        {errors.CardHolderName && (
          <Text variant="formError">{errors.CardHolderName.message}</Text>
        )}

        <Grid columns={2}>
          <Box>
            <Input
              text="Credit Card Last 4 Digits"
              name="CreditCardSuffix"
              placeholder="1234"
              ref={register({
                required: 'Required',
                pattern: {
                  value: /^[0-9]{4}$/,
                  message: 'Please enter last 4 digits of your credit card',
                },
              })}
              sx={{
                borderColor: errors.CreditCardSuffix && '#EC104E',
              }}
              required
            />
            {errors.CreditCardSuffix && (
              <Text variant="formError">{errors.CreditCardSuffix.message}</Text>
            )}
          </Box>

          <Box>
            <Select
              text="Card Type"
              name="CreditCardType"
              placeholder="1234"
              defaultValue="Select Card Type"
              ref={register({
                required: 'Please select Card Type',
                pattern: {
                  value: /^[1-9][0-9]*$/,
                  message: 'Please select Card Type',
                },
              })}
              sx={{
                borderColor: errors.CreditCardType && '#EC104E',
                '::placeholder': {
                  color: '#fff',
                },
              }}
              required
            >
              {cardType.map((x: {name: string; type: number}) => (
                <option key={x.type} value={x.type}>
                  {x.name}
                </option>
              ))}
            </Select>
            {errors.CreditCardType && (
              <Text variant="formError">{errors.CreditCardType.message}</Text>
            )}
          </Box>
        </Grid>
        <Select
          text="Reason for refund"
          name="RefundReason"
          ref={register({
            required: 'Please select a reason for refund',
          })}
          sx={{
            borderColor: errors.RefundReason && '#EC104E',
            '::placeholder': {
              color: '#fff',
            },
          }}
          required
          onChange={({target}) => {
            console.log(target.value);
            if (target.value.startsWith('Other')) {
              setShowOther(true);
            } else {
              setShowOther(false);
            }
          }}
        >
          {reasons.map((x: string) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </Select>

        {showOther && (
          <Textarea
            name="RefundOther"
            text=""
            placeholder="Enter reason here..."
            ref={register}
          />
        )}

        {errors.RefundReason && (
          <Text variant="formError">{errors.RefundReason.message}</Text>
        )}
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
          text={formState.isSubmitting ? `Submitting...` : `Complete Order`}
          disabled={formState.isSubmitting}
        />
      </Flex>
    </ODTForm>
  );
};
