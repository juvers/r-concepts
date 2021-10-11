/** @jsx jsx */
import {useForm} from 'react-hook-form';
import invariant from 'invariant';
import {graphql} from 'gatsby';
import {
  jsx,
  Textarea,
  Text,
  RequiredLabel,
  Input,
  Flex,
  Box,
  SubmitButton,
  Form,
} from '@tishman/components';
import {Layout} from '~layouts';
import ContactUsBlock from '~blocks/ContactUsBlock';
import {ContactSelect} from '~components/Form';
import {useState} from 'react';
import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Black',
  logo: 'Rockefeller Center',
  pageName: 'Contact Us',
  cta: {
    to: '/buy-tickets',
    label: 'Buy Tickets',
  },
};

export const query = graphql`
  query RRBarSixtyFiveInquiryForm {
    meta: formJson(id: {eq: "rr-bar-sixtyfive-inquiry-form"}) {
      meta {
        title
        description
      }
    }
    formJson(id: {eq: "rr-bar-sixtyfive-inquiry-form"}) {
      id
      integrationId
      name
      slug
      description {
        text
        image {
          id
          fluid {
            ...GatsbyImageSharpFluid_withWebp
          }
        }
      }
      thankYouMessage {
        title
        caption
        links {
          url
          label
        }
      }
    }
  }
`;

interface RRBarSixtyFiveInquiryFormValues {
  fullname: string;
  email: string;
  phone: string;
  purpose?: string;
  comments?: string;
}

const RRBarSixtyFiveInquiryForm = ({
  data: {formJson},
}: {
  data: GatsbyTypes.RRBarSixtyFiveInquiryFormQuery;
}): JSX.Element => {
  const {
    register,
    handleSubmit,
    errors,
    clearErrors,
    setError,
    formState,
  } = useForm<RRBarSixtyFiveInquiryFormValues>();
  const [showThankYou, setShowThankYou] = useState(false);
  const onSuccess = () => {
    setShowThankYou(true);
  };

  invariant(formJson, 'Rainbow Room Inquiries Form JSON data is required!');

  return (
    <Layout theme="Rock Center Black">
      <ContactUsBlock showThankYou={showThankYou} {...formJson}>
        <Form
          reactHookHandleSubmit={handleSubmit}
          errors={errors}
          clearErrors={clearErrors}
          setError={setError}
          onSuccess={onSuccess}
          id={formJson.integrationId}
        >
          <Box sx={{mb: 5}}>
            {errors.fullname && (
              <Text variant="formError">{errors.fullname.message}</Text>
            )}
            <Input
              text="Full Name"
              name="fullname"
              placeholder="Enter Full Name"
              sx={{
                borderColor: errors.fullname && '#EC104E',
                '::placeholder': {
                  color: '#fff',
                },
              }}
              ref={register({required: 'Please enter your full name'})}
              required
            />
            {errors.email && errors.email.message && (
              <Text variant="formError">{errors.email.message}</Text>
            )}
            <Input
              text="Email"
              name="email"
              placeholder="Enter Email Address"
              ref={register({
                required: 'Please enter a valid email address',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: 'Please enter a valid email address',
                },
              })}
              sx={{
                borderColor: errors.fullname && '#EC104E',
                '::placeholder ': {
                  color: '#fff',
                },
              }}
              required
            />
            {errors.phone && (
              <Text variant="formError">{errors.phone.message}</Text>
            )}
            <Input
              text="Phone Number"
              name="phone"
              placeholder="000.000.0000"
              sx={{
                borderColor: errors.phone && '#EC104E',
                '::placeholder': {
                  color: '#fff',
                },
              }}
              ref={register({
                required: 'Please enter a valid phone number',
                pattern: {
                  value: /^[(0-9) \-+().]*$/,
                  message: 'Please enter a valid phone number',
                },
              })}
              required
            />
            <ContactSelect
              name="purpose"
              text="Purpose of Inquiry"
              register={register}
              errors={errors}
              required={false}
              defaultOptionText="I'm interested in..."
              options={[
                'General Inquiries',
                'Reservations',
                'Rainbow Room Dining Groups of 9 or more',
                'Bar SixtyFive Groups of 15 or more',
                'Members-Only Dining Club',
                'Performing at Rainbow Room',
                'Press Inquiries',
                'Donation Requests',
                'History of Rainbow Room',
              ]}
            />
            <Textarea
              text="Comments"
              name="comments"
              placeholder="Your message here..."
              ref={register}
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
              text={formState.isSubmitting ? `Submitting...` : `Submit`}
              disabled={formState.isSubmitting}
            />
          </Flex>
        </Form>
      </ContactUsBlock>
    </Layout>
  );
};

export default RRBarSixtyFiveInquiryForm;
