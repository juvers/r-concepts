/** @jsx jsx */
import {useForm} from 'react-hook-form';
import invariant from 'invariant';
import {
  jsx,
  Text,
  Textarea,
  RequiredLabel,
  Input,
  Flex,
  Box,
  SubmitButton,
  Form,
} from '@tishman/components';
import {Layout} from '~layouts';
import ContactUsBlock from '~blocks/ContactUsBlock';
import {useState} from 'react';
import {graphql} from 'gatsby';
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
  query PressInquiriesForm {
    meta: formJson(id: {eq: "press-inquiry-form"}) {
      meta {
        title
        description
      }
    }
    formJson(id: {eq: "press-inquiry-form"}) {
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

interface PressInquiryFormValues {
  fullname: string;
  email: string;
  phone: string;
  company: string;
  title?: string;
  message: string;
}

const PressInquiryForm = ({
  data: {formJson},
}: {
  data: GatsbyTypes.PressInquiriesFormQuery;
}): JSX.Element => {
  const {
    register,
    handleSubmit,
    errors,
    clearErrors,
    setError,
    formState,
  } = useForm<PressInquiryFormValues>();
  const [showThankYou, setShowThankYou] = useState(false);
  const onSuccess = () => {
    setShowThankYou(true);
  };

  invariant(formJson, 'Press Inquiry Form JSON data is required!');

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
            {errors.email && (
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
                borderColor: errors.email && '#EC104E',
                '::placeholder': {
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
              ref={register({
                required: 'Please enter your phone number',
                pattern: {
                  value: /^[(0-9) \-+().]*$/,
                  message: 'Please enter a valid phone number',
                },
              })}
              sx={{
                borderColor: errors.phone && '#EC104E',
                '::placeholder': {
                  color: '#fff',
                },
              }}
              required
            />
            {errors.company && (
              <Text variant="formError">{errors.company.message}</Text>
            )}
            <Input
              text="Company or Affiliation"
              name="company"
              placeholder="Please Enter Affiliation"
              ref={register({
                required: 'Please enter a company or affiliation',
              })}
              sx={{
                borderColor: errors.company && '#EC104E',
                '::placeholder': {
                  color: '#fff',
                },
              }}
              required
            />
            <Input
              text="Title"
              name="title"
              placeholder="Please Enter Title"
              ref={register}
            />
            {errors.message && (
              <Text variant="formError">{errors.message.message}</Text>
            )}
            <Textarea
              text="Message"
              name="message"
              placeholder="Provide Proposed Usage and Inquiry"
              sx={{
                borderColor: errors.message && '#EC104E',
                '::placeholder': {
                  color: '#fff',
                },
              }}
              ref={register({
                required: 'Please enter proposed usage and comments',
              })}
              required
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

export default PressInquiryForm;
