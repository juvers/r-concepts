/** @jsx jsx */
import {
  jsx,
  Text,
  Flex,
  Box,
  RequiredLabel,
  SubmitButton,
  Input,
} from '@tishman/components';
import {navigate} from 'gatsby';
import {ODTForm} from '~buy-tickets/services/form-service';
import {useForm} from 'react-hook-form';

interface PaymentFormValues {
  FullName: string;
  EmailAddress: string;
}

export const RedemptionForm = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    errors,
    clearErrors,
    setError,
    formState,
    reset,
  } = useForm<PaymentFormValues>();

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
      id={'redemption'}
      reset={reset}
    >
      <Box sx={{mb: 5}}>
        <Input
          text="Full Name"
          name="FullName"
          placeholder="Enter Full Name"
          ref={register({required: 'Please enter your full name'})}
          sx={{
            borderColor: errors.FullName && '#EC104E',
            '::placeholder': {
              color: '#fff',
            },
          }}
          required
        />
        {errors.FullName && (
          <Text variant="formError">{errors.FullName.message}</Text>
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
