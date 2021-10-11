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
  Text,
  Grid,
  Form,
  Section,
  Checkbox,
} from '@tishman/components';
import {ContactSelect} from '~components/Form';
import ContactThankYouBlock from '~blocks/forms/ContactThankYouBlock';

import type {ComponentPropsWithoutRef} from 'react';

const FILM_PHOTO_FORM_SECTION_QUERY = graphql`
  query FilmPhotoFormBlock {
    formJson(id: {eq: "film-photo-inquiry-section-form"}) {
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

interface FilmPhotoFormBlockValues {
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

const FilmPhotoFormBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    register,
    handleSubmit,
    errors,
    clearErrors,
    setError,
    formState,
  } = useForm<FilmPhotoFormBlockValues>();
  const [showThankYou, setShowThankYou] = useState(false);
  const onSuccess = () => {
    setShowThankYou(true);
  };

  const {formJson} = useStaticQuery<GatsbyTypes.FilmPhotoFormBlockQuery>(
    FILM_PHOTO_FORM_SECTION_QUERY,
  );
  invariant(formJson, 'Film and Photo Inquiry Form JSON data is required!');

  return (
    <Section {...props}>
      <Container sx={{py: [3, 5], px: [0, 0, 0], maxWidth: 1280}}>
        <Grid
          columns={[1, '1fr 2fr']}
          gap={[6, 0]}
          sx={{maxWidth: 1000, margin: 'auto'}}
        >
          <Container sx={{py: 3, px: [3, 0, 0]}}>
            <Box sx={{maxWidth: 250}}>
              <Text sx={{color: 'white', fontSize: 6, fontWeight: 400}}>
                Contact Rockefeller Center Film & Photo
              </Text>
              <Text mt={1} sx={{color: 'white', fontSize: 2, fontWeight: 300}}>
                We&#39;re always available to discuss film and photo
                opportunities at Rockefeller Center.
              </Text>
              <Text sx={{mt: 4, color: 'white', fontSize: 5, fontWeight: 400}}>
                Film Office Hours
              </Text>
              <Text mt={1} sx={{color: 'white', fontSize: 2, fontWeight: 300}}>
                Monday-Saturday <br />
                9:00am-5:00pm
              </Text>
              <Text sx={{mt: 4, color: 'white', fontSize: 5, fontWeight: 400}}>
                Contact &amp; Directions
              </Text>
              <Text mt={1} sx={{color: 'white', fontSize: 2, fontWeight: 300}}>
                30 Rockefeller Plaza, <br />
                New York, NY 10112 <br />
                1.877.692.7625
              </Text>
            </Box>
          </Container>
          <Container>
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
                      {errors.fullname && (
                        <span>Please enter your full name</span>
                      )}
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
                      ref={register({required: true})}
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
                      {errors.company && (
                        <span>Please enter a company or affiliation</span>
                      )}
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
                      ref={register({required: true})}
                      required
                    />
                  </Box>
                </Grid>
                <Box>
                  <Box>
                    <Input
                      name="shootpurpose"
                      text="Purpose of the Shoot"
                      placeholder="Enter Purpose of the Shoot"
                      textColor="white"
                      sx={{
                        '::placeholder': {
                          color: 'white',
                        },
                      }}
                      ref={register}
                    />
                  </Box>
                </Box>
                <Grid mb={3} columns={[1, 2]} gap={4}>
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
                      name="loadintime"
                      text="Load in time"
                      placeholder="0:00"
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
                      name="loadouttime"
                      text="Load out time"
                      placeholder="0:00"
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
                <Input
                  text="Proposed Location"
                  name="location"
                  placeholder="Location"
                  textColor="white"
                  sx={{
                    '::placeholder': {
                      color: 'white',
                    },
                  }}
                  ref={register}
                />
                <Grid mt={3} mb={3} columns={[1, 2]} gap={4}>
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
                    textColor="white"
                    sx={{
                      '::placeholder': {
                        color: 'white',
                      },
                    }}
                    ref={register}
                  />
                </Grid>
                <Box>
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

export default FilmPhotoFormBlock;
