/** @jsx jsx */
import {useForm} from 'react-hook-form';
import invariant from 'invariant';
import {
  jsx,
  Text,
  Textarea,
  RequiredLabel,
  Input,
  UploadInput,
  Flex,
  Box,
  SubmitButton,
  Grid,
  Form,
} from '@tishman/components';
import {Layout} from '~layouts';
import ContactUsBlock from '~blocks/ContactUsBlock';
import {useState} from 'react';
import {graphql} from 'gatsby';
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
  query SubmitYourTreeForm {
    meta: formJson(id: {eq: "submit-your-tree-form"}) {
      meta {
        title
        description
      }
    }
    formJson(id: {eq: "submit-your-tree-form"}) {
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

interface SubmitYourTreeFormValues {
  fullname: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  image: string;
  treeheight: string;
  comments: string;
}

const SubmitYourTreeInquiryForm = ({
  data: {formJson},
}: {
  data: GatsbyTypes.SubmitYourTreeFormQuery;
}): JSX.Element => {
  const {
    register,
    handleSubmit,
    errors,
    clearErrors,
    setError,
    formState,
  } = useForm<SubmitYourTreeFormValues>();
  const [showThankYou, setShowThankYou] = useState(false);
  const onSuccess = () => {
    setShowThankYou(true);
  };

  invariant(formJson, 'Submit Your Tree Form JSON data is required!');

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
            {errors.address && (
              <Text variant="formError">{errors.address.message}</Text>
            )}
            <Input
              text="Address"
              name="address"
              placeholder="Address"
              ref={register({required: 'Please enter your address'})}
              sx={{
                borderColor: errors.address && '#EC104E',
                '::placeholder': {
                  color: '#fff',
                },
              }}
              required
            />
            <Grid columns={[1, 3]} gap={4}>
              <Box>
                {errors.city && (
                  <Text variant="formError">{errors.city.message}</Text>
                )}
                <Input
                  text="City"
                  name="city"
                  placeholder="City"
                  ref={register({required: 'Please enter your city'})}
                  sx={{
                    borderColor: errors.city && '#EC104E',
                    '::placeholder': {
                      color: '#fff',
                    },
                  }}
                  required
                />
              </Box>
              <Box>
                {errors.state && (
                  <Text variant="formError">Please select a state</Text>
                )}
                <ContactSelect
                  name="state"
                  text="State"
                  register={register}
                  errors={errors}
                  required={true}
                  defaultOptionText="State"
                  options={[
                    {name: 'Alabama', value: 'AL'},
                    {name: 'Alaska', value: 'AK'},
                    {name: 'Arizona', value: 'AZ'},
                    {name: 'Arkansas', value: 'AR'},
                    {name: 'California', value: 'CA'},
                    {name: 'Colorado', value: 'CO'},
                    {name: 'Connecticut', value: 'CT'},
                    {name: 'Delaware', value: 'DE'},
                    {name: 'District Of Columbia', value: 'DC'},
                    {name: 'Florida', value: 'FL'},
                    {name: 'Georgia', value: 'GA'},
                    {name: 'Hawaii', value: 'HI'},
                    {name: 'Idaho', value: 'ID'},
                    {name: 'Illinois', value: 'IL'},
                    {name: 'Indiana', value: 'IN'},
                    {name: 'Iowa', value: 'IA'},
                    {name: 'Kansas', value: 'KS'},
                    {name: 'Kentucky', value: 'KY'},
                    {name: 'Louisiana', value: 'LA'},
                    {name: 'Maine', value: 'ME'},
                    {name: 'Maryland', value: 'MD'},
                    {name: 'Massachusetts', value: 'MA'},
                    {name: 'Michigan', value: 'MI'},
                    {name: 'Minnesota', value: 'MN'},
                    {name: 'Mississippi', value: 'MS'},
                    {name: 'Missouri', value: 'MO'},
                    {name: 'Montana', value: 'MT'},
                    {name: 'Nebraska', value: 'NE'},
                    {name: 'Nevada', value: 'NV'},
                    {name: 'New Hampshire', value: 'NH'},
                    {name: 'New Jersey', value: 'NJ'},
                    {name: 'New Mexico', value: 'NM'},
                    {name: 'New York', value: 'NY'},
                    {name: 'North Carolina', value: 'NC'},
                    {name: 'North Dakota', value: 'ND'},
                    {name: 'Ohio', value: 'OH'},
                    {name: 'Oklahoma', value: 'OK'},
                    {name: 'Oregon', value: 'OR'},
                    {name: 'Pennsylvania', value: 'PA'},
                    {name: 'Rhode Island', value: 'RI'},
                    {name: 'South Carolina', value: 'SC'},
                    {name: 'South Dakota', value: 'SD'},
                    {name: 'Tennessee', value: 'TN'},
                    {name: 'Texas', value: 'TX'},
                    {name: 'Utah', value: 'UT'},
                    {name: 'Vermont', value: 'VT'},
                    {name: 'Virginia', value: 'VA'},
                    {name: 'Washington', value: 'WA'},
                    {name: 'West Virginia', value: 'WV'},
                    {name: 'Wisconsin', value: 'WI'},
                    {name: 'Wyoming', value: 'WY'},
                  ]}
                />
              </Box>
              <Box>
                {errors.zip && (
                  <Text variant="formError">{errors.zip.message}</Text>
                )}
                <Input
                  text="Zip"
                  name="zip"
                  placeholder="Zip"
                  ref={register({required: 'Please enter your zip'})}
                  sx={{
                    borderColor: errors.zip && '#EC104E',
                    '::placeholder': {
                      color: '#fff',
                    },
                  }}
                  required
                />
              </Box>
            </Grid>
            <Grid columns={[1, 2]} gap={4}>
              <Box>
                {errors.treeheight && (
                  <Text variant="formError">{errors.treeheight.message}</Text>
                )}
                <ContactSelect
                  name="treeheight"
                  text="Approximate Tree Height"
                  register={register}
                  errors={errors}
                  required={false}
                  defaultOptionText="Select Height"
                  options={['75ft', '80ft', '85ft', '90ft']}
                />
              </Box>
              <Box>
                {errors.image && (
                  <Text variant="formError">{errors.image.message}</Text>
                )}
                <UploadInput
                  text="Upload a Photo"
                  name="image"
                  placeholder="filename.000"
                  accept="image/*"
                  ref={register({required: 'Please select an image'})}
                  sx={{
                    pt: 13,
                    pb: '3px',
                    borderColor: errors.image && '#EC104E',
                  }}
                  required
                />
              </Box>
            </Grid>
            {errors.comments && (
              <Text variant="formError">{errors.comments.message}</Text>
            )}
            <Textarea
              text="Comments"
              name="comments"
              placeholder="Tell Us Briefly About Your Tree"
              ref={register()}
              sx={{
                borderColor: errors.comments && '#EC104E',
                '::placeholder': {
                  color: '#fff',
                },
              }}
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

export default SubmitYourTreeInquiryForm;
