/** @jsx jsx */
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import invariant from 'invariant';
import {useStaticQuery, graphql} from 'gatsby';
import {
  jsx,
  RequiredLabel,
  Input,
  Flex,
  Date,
  Box,
  SubmitButton,
  Container,
  Section,
  Text,
  Textarea,
  Grid,
  Form,
  Checkbox,
} from '@tishman/components';
import ContactThankYouBlock from '~blocks/forms/ContactThankYouBlock';

import type {ComponentPropsWithoutRef} from 'react';

const PARTNERSHIP_FORM_SECTION_QUERY = graphql`
  query PartnershipFormSection {
    formJson(id: {eq: "partnership-inquiry-section-form"}) {
      integrationId
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

interface PartnershipInquiryFormBlockValues {
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

const PartnershipInquiryFormBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    register,
    handleSubmit,
    errors,
    clearErrors,
    setError,
    formState,
  } = useForm<PartnershipInquiryFormBlockValues>();
  const [showThankYou, setShowThankYou] = useState(false);
  const onSuccess = () => {
    setShowThankYou(true);
  };

  const {formJson} = useStaticQuery<GatsbyTypes.PartnershipFormSectionQuery>(
    PARTNERSHIP_FORM_SECTION_QUERY,
  );
  invariant(formJson, 'Partnership Inquiry Form JSON data is required!');

  return (
    <Section {...props}>
      <Container sx={{py: [3, 5], px: [0, 0, 0], maxWidth: 1280}}>
        <Grid
          columns={[1, '1fr 3fr']}
          gap={4}
          sx={{maxWidth: 1200, margin: 'auto'}}
        >
          <Container sx={{py: 3, px: [3, 0, 0]}}>
            <Box
            //  sx={{maxWidth: 240}}
            >
              <Text sx={{color: 'white', fontSize: 6, fontWeight: 400}}>
                Contact Us
              </Text>
              <Text mt={1} sx={{color: 'white', fontSize: 2, fontWeight: 300}}>
                Contact us to discuss your next branded partnership at
                Rockefeller Center!
              </Text>
            </Box>
          </Container>
          <Container px={[0, 0, 0]}>
            {showThankYou ? (
              <ContactThankYouBlock {...formJson.thankYouMessage} />
            ) : (
              <Form
                reactHookHandleSubmit={handleSubmit}
                errors={errors}
                clearErrors={clearErrors}
                setError={setError}
                onSuccess={onSuccess}
                id={formJson.integrationId}
              >
                <Grid mb={3} columns={[1, 2]} gap={4}>
                  <Box>
                    <Box
                      sx={{
                        color: '#EC104E',
                        fontStyle: 'italic',
                        fontWeight: 400,
                      }}
                    >
                      {errors.fullname && <span>This field is required</span>}
                    </Box>
                    <Input
                      text="Full Name"
                      name="fullname"
                      placeholder="Enter Full Name"
                      textColor="white"
                      sx={{
                        borderBottom: errors.fullname && '2px solid #EC104E',
                        '::placeholder': {
                          color: 'white',
                        },
                      }}
                      ref={register({required: 'Please enter your full name'})}
                      required
                    />
                  </Box>
                  <Box>
                    <Box
                      sx={{
                        color: '#EC104E',
                        fontStyle: 'italic',
                        fontWeight: 400,
                      }}
                    >
                      {errors.email && errors.email.message}
                    </Box>
                    <Input
                      text="Email"
                      name="email"
                      placeholder="Enter Email Address"
                      textColor="white"
                      sx={{
                        borderBottom: errors.email && '2px solid #EC104E',
                        '::placeholder': {
                          color: 'white',
                        },
                      }}
                      ref={register({
                        required: 'Please enter a valid email address',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                          message: 'Please enter a valid email address',
                        },
                      })}
                      required
                    />
                  </Box>
                  <Box>
                    <Box
                      sx={{
                        color: '#EC104E',
                        fontStyle: 'italic',
                        fontWeight: 400,
                      }}
                    >
                      {errors.phone && errors.phone.message}
                    </Box>
                    <Input
                      text="Phone Number"
                      name="phone"
                      placeholder="000.000.0000"
                      textColor="white"
                      sx={{
                        borderBottom: errors.phone && '2px solid #EC104E',
                        '::placeholder': {
                          color: 'white',
                        },
                      }}
                      ref={register({
                        required: 'Please enter your phone number',
                        pattern: {
                          value: /^[(0-9) \-+().]*$/,
                          message: 'Please enter a valid phone number',
                        },
                      })}
                      required
                    />
                  </Box>
                  <Box>
                    <Box
                      sx={{
                        color: '#EC104E',
                        fontStyle: 'italic',
                        fontWeight: 400,
                      }}
                    >
                      {errors.company && errors.company.message}
                    </Box>
                    <Input
                      text="Company or Affiliation"
                      name="company"
                      placeholder="Please Enter Affiliation"
                      textColor="white"
                      sx={{
                        borderBottom: errors.company && '2px solid #EC104E',
                        '::placeholder': {
                          color: 'white',
                        },
                      }}
                      ref={register({
                        required: 'Please enter a company or affiliation',
                      })}
                      required
                    />
                  </Box>
                  <Box>
                    <Date
                      text="Start Date"
                      name="startdate"
                      textColor="white"
                      ref={register}
                    />
                  </Box>
                  <Box>
                    <Date
                      text="End Date"
                      name="enddate"
                      textColor="white"
                      ref={register}
                    />
                  </Box>
                  <Box>
                    <Input
                      name="client"
                      text="Client Name"
                      placeholder="Enter Client"
                      textColor="white"
                      sx={{
                        '::placeholder': {
                          color: 'white',
                        },
                      }}
                      ref={register}
                    />
                  </Box>
                  <Box>
                    <Input
                      name="location"
                      text="Location"
                      placeholder="Enter Location"
                      textColor="white"
                      sx={{
                        '::placeholder': {
                          color: 'white',
                        },
                      }}
                      ref={register}
                    />
                  </Box>
                </Grid>
                <Textarea
                  text="Comments"
                  name="comments"
                  placeholder="Tell Us Briefly About Your Event"
                  textColor="white"
                  sx={{
                    '::placeholder': {
                      color: 'white',
                    },
                  }}
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
                    Don&apos;t miss out on what&apos;s happening. Subscribe to
                    The Center and be the first know about upcoming events,
                    special offers and more.
                  </Text>
                </Box>
                <Flex
                  pt={4}
                  sx={{
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{mb: 4, mt: 4}}>
                    <RequiredLabel labelText="Required*" />
                  </Box>
                  <Flex
                    sx={{
                      mb: 4,
                      mt: 4,
                      justifyContent: 'flex-end',
                      alignItems: 'end',
                      flex: 'auto',
                    }}
                  >
                    <SubmitButton
                      text={formState.isSubmitting ? `Submitting...` : `Submit`}
                      disabled={formState.isSubmitting}
                    />
                  </Flex>
                </Flex>
              </Form>
            )}
          </Container>
        </Grid>
      </Container>
    </Section>
  );
};

export default PartnershipInquiryFormBlock;
