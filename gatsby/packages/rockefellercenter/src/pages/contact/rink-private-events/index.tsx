/** @jsx jsx */
import {useState} from 'react';
import {graphql} from 'gatsby';
import {useForm} from 'react-hook-form';
import invariant from 'invariant';
import {
  jsx,
  Textarea,
  Text,
  RequiredLabel,
  Input,
  Flex,
  Date,
  Box,
  SubmitButton,
  Form,
} from '@tishman/components';
import {Layout} from '~layouts';
import ContactUsBlock from '~blocks/ContactUsBlock';
import {ContactSelect} from '~components/Form';
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
  query RinkPrivateInquiriesForm {
    meta: formJson(id: {eq: "rink-private-events-form"}) {
      meta {
        title
        description
      }
    }
    formJson(id: {eq: "rink-private-events-form"}) {
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

interface RinkPrivateInquiriesFormValues {
  fullname: string;
  email: string;
  phone: string;
  eventcategory: string;
  venue: string;
  eventtype: string;
  guestcount: string;
  eventdate?: string;
  eventdescription?: string;
}

const RinkPrivateInquiriesForm = ({
  data: {formJson},
}: {
  data: GatsbyTypes.RinkPrivateInquiriesFormQuery;
}): JSX.Element => {
  const {
    register,
    handleSubmit,
    errors,
    clearErrors,
    setError,
    formState,
  } = useForm<RinkPrivateInquiriesFormValues>();
  const [showThankYou, setShowThankYou] = useState(false);
  const onSuccess = () => {
    setShowThankYou(true);
  };

  invariant(formJson, 'Rink Private Inquiries Form JSON data is required!');

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
                pattern: {
                  value: /^[(0-9) \-+().]*$/,
                  message: 'Please enter a valid phone number',
                },
              })}
            />

            {errors.eventcategory && (
              <Text variant="formError">{errors.eventcategory.message}</Text>
            )}
            <ContactSelect
              name="eventcategory"
              text="Company or Private Event"
              register={register}
              errors={errors}
              required={false}
              defaultOptionText="Please Choose One"
              options={['Company Event', 'Private Event', 'Undecided']}
            />
            {errors.venue && (
              <Text variant="formError">Please select a venue</Text>
            )}
            <ContactSelect
              name="venue"
              text="Event Venue"
              register={register}
              errors={errors}
              required={true}
              defaultOptionText="Please Choose a Venue"
              options={['Skating Rink', 'Sunken Plaza']}
            />

            {errors.eventtype && (
              <Text variant="formError">{errors.eventtype.message}</Text>
            )}
            <Input
              text="Event Type"
              name="eventtype"
              placeholder="Please specify event type"
              sx={{
                borderColor: errors.eventtype && '#EC104E',
                '::placeholder': {
                  color: '#fff',
                },
              }}
              ref={register({required: 'Please specify the event type'})}
              required
            />
            {errors.guestcount && (
              <Text variant="formError">
                <span>{errors.guestcount.message}</span>
              </Text>
            )}
            <Input
              text="Number of Guests"
              name="guestcount"
              placeholder="Please Specify The Number of Guests"
              ref={register({
                required: 'Please enter the number of guests',
                pattern: {
                  value: /^[0-9]\d*$/i,
                  message: 'Value must be a number',
                },
              })}
              required
              sx={{
                borderColor: errors.fullname && '#EC104E',
                '::placeholder': {
                  color: '#fff',
                },
              }}
            />
            <Date text="Date of Event" name="eventdate" ref={register} />
            <Textarea
              text="Additional Information"
              name="eventdescription"
              placeholder="Tell Us Briefly About Your Event"
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

export default RinkPrivateInquiriesForm;
