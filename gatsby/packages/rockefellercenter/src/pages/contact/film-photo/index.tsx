/** @jsx jsx */
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import invariant from 'invariant';
import {
  jsx,
  RequiredLabel,
  Text,
  Input,
  Flex,
  Date,
  Box,
  SubmitButton,
  Grid,
  Form,
  Checkbox,
} from '@tishman/components';
import {Layout} from '~layouts';
import ContactUsBlock from '~blocks/ContactUsBlock';
import {ContactSelect} from '~components/Form';
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
  query FilmPhotoInquiriesForm {
    meta: formJson(id: {eq: "film-photo-inquiry-form"}) {
      meta {
        title
        description
      }
    }
    formJson(id: {eq: "film-photo-inquiry-form"}) {
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

interface FilmPhotoInquiryFormValues {
  fullname: string;
  email: string;
  phone: string;
  company: string;
  shootpurpose?: string;
  startdate?: string;
  enddate?: string;
  loadintime?: string;
  loadouttime?: string;
  location?: string;
  shoottype?: string;
  peoplecount?: string;
}

const FilmPhotoInquiryForm = ({
  data: {formJson},
}: {
  data: GatsbyTypes.FilmPhotoInquiriesFormQuery;
}): JSX.Element => {
  const {
    register,
    handleSubmit,
    errors,
    clearErrors,
    setError,
    formState,
  } = useForm<FilmPhotoInquiryFormValues>();
  const [showThankYou, setShowThankYou] = useState(false);
  const onSuccess = () => {
    setShowThankYou(true);
  };

  invariant(formJson, 'Film and Photo Inquiry Form JSON data is required!');

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
              required
              sx={{
                borderColor: errors.fullname && '#EC104E',
                '::placeholder': {
                  color: '#fff',
                },
              }}
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
              name="shootpurpose"
              text="Purpose of the Shoot"
              placeholder="Enter Purpose of the Shoot"
              ref={register}
            />
            <Grid columns={[1, 2]} gap={4}>
              <Date text="Start Date" name="startdate" ref={register} />
              <Date text="End Date" name="enddate" ref={register} />
              <Input
                name="loadintime"
                text="Load in time"
                placeholder="0:00"
                ref={register}
              />
              <Input
                name="loadouttime"
                text="Load out time"
                placeholder="0:00"
                ref={register}
              />
            </Grid>
            <Input
              text="Proposed Location"
              name="location"
              placeholder="Location"
              ref={register}
            />
            <Grid columns={[1, 2]} gap={4}>
              <ContactSelect
                name="shoottype"
                text="Type of Shoot"
                register={register}
                errors={errors}
                required={false}
                defaultOptionText="Select One"
                options={['Film', 'Photo']}
              />
              <Input
                text="Number of People (Approx.)"
                name="peoplecount"
                placeholder="Number of People"
                ref={register}
              />
            </Grid>
            <Box sx={{mt: 4}}>
              <Checkbox
                text="Join our newsletter"
                name="newsletter"
                ref={register}
                sx={{color: 'white'}}
              />
              <Text sx={{fontSize: 18}}>
                Be the first to know about film and photo opportunities at
                Rockefeller Center. Sign up for the Film & Photo Newsletter.
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

export default FilmPhotoInquiryForm;
