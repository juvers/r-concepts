/** @jsx jsx */
import {useForm} from 'react-hook-form';
import invariant from 'invariant';
import {
  jsx,
  Text,
  RequiredLabel,
  Input,
  Flex,
  Date,
  Box,
  Textarea,
  SubmitButton,
  Grid,
  Form,
  Checkbox,
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
  query PartnershipInquiriesForm {
    meta: formJson(id: {eq: "partnership-inquiry-form"}) {
      meta {
        title
        description
      }
    }
    formJson(id: {eq: "partnership-inquiry-form"}) {
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

interface PartnershipInquiryFormValues {
  fullname: string;
  email: string;
  phone: string;
  company: string;
  startdate?: string;
  enddate?: string;
  client?: string;
  location?: string;
  comments?: string;
}

const PartnershipInquiryForm = ({
  data: {formJson},
}: {
  data: GatsbyTypes.PartnershipInquiriesFormQuery;
}): JSX.Element => {
  const {
    register,
    handleSubmit,
    errors,
    clearErrors,
    setError,
    formState,
  } = useForm<PartnershipInquiryFormValues>();
  const [showThankYou, setShowThankYou] = useState(false);
  const onSuccess = () => {
    setShowThankYou(true);
  };

  invariant(formJson, 'Partnership Inquiry Form JSON data is required!');

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
              ref={register({required: 'Please enter your full name'})}
              sx={{
                borderColor: errors.fullname && '#EC104E',
                '::placeholder': {
                  color: '#fff',
                },
              }}
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
                required: 'Please enter a valid phone number',
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
            <Grid columns={[1, 3]} gap={4} mt={3} mb={3}>
              <Date text="Start Date" name="startdate" ref={register} />
              <Date text="End Date" name="enddate" ref={register} />
              <Input
                text="Client Name"
                name="client"
                placeholder="Enter Client"
                ref={register}
              />
            </Grid>
            <Input
              text="Location"
              name="location"
              placeholder="Enter Location"
              ref={register}
            />
            <Textarea
              text="Comments"
              name="comments"
              placeholder="Tell Us Briefly About Your Event"
              ref={register}
            />
            <Box sx={{mt: 4}}>
              <Checkbox
                text="Join our newsletter"
                name="newsletter"
                ref={register}
                sx={{color: 'white'}}
              />
              <Text sx={{fontSize: 18}}>
                Don&apos;t miss out on what&apos;s happening. Subscribe to The
                Center and be the first to know about upcoming events, special
                offers and more.
              </Text>
            </Box>
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

export default PartnershipInquiryForm;
