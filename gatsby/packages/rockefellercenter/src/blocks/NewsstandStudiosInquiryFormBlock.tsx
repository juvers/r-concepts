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
  Box,
  Textarea,
  SubmitButton,
  Container,
  Section,
  Text,
  Grid,
  Form,
} from '@tishman/components';
import ContactThankYouBlock from '~blocks/forms/ContactThankYouBlock';

const NEWSSTAND_STUDIO_FORM_SECTION_QUERY = graphql`
  query NewsstandStudioFormSection {
    formJson(id: {eq: "newsstand-studio-inquiry-section-form"}) {
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

interface NewsstandStudioInquiryFormBlockValues {
  fullname: string;
  email: string;
  phone: string;
  message?: string;
}

const NewsstandStudioInquiryFormBlock = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    errors,
    clearErrors,
    setError,
    formState,
  } = useForm<NewsstandStudioInquiryFormBlockValues>();
  const [showThankYou, setShowThankYou] = useState(false);
  const onSuccess = () => {
    setShowThankYou(true);
  };

  const {
    formJson,
  } = useStaticQuery<GatsbyTypes.NewsstandStudioFormSectionQuery>(
    NEWSSTAND_STUDIO_FORM_SECTION_QUERY,
  );
  invariant(formJson, 'Newsstand Studio Inquiry Form JSON data is required!');

  return (
    <Section theme="Rock Center Dark_Green" sx={{py: [3, 5]}}>
      <Grid
        columns={[1, '1fr 2fr']}
        gap={[4, 0]}
        sx={{maxWidth: 1000, margin: 'auto'}}
      >
        <Container sx={{py: 3}}>
          <Box sx={{maxWidth: 230}}>
            <Text sx={{color: 'white', fontSize: '23px', fontWeight: 400}}>
              Let&#39;s get started.
            </Text>
            <Text
              mt={1}
              sx={{color: 'white', fontSize: '14px', fontWeight: 300}}
            >
              We&#39;re excited to tell you more about Newsstand Studios and
              about how to partner with us to create your own content.
            </Text>
            <Text
              mt={4}
              sx={{color: 'white', fontSize: '23px', fontWeight: 400}}
            >
              Contact & Directions
            </Text>
            <Text
              mt={1}
              sx={{color: 'white', fontSize: '14px', fontWeight: 300}}
            >
              1 Rockefeller Plaza <br />
              Lobby Level <br />
              New York, NY 10112
            </Text>
          </Box>
        </Container>
        <Container sx={{px: 0}}>
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
              </Grid>
              <Box>
                <Box
                  sx={{color: '#EC104E', fontStyle: 'italic', fontWeight: 400}}
                >
                  {errors.phone && errors.phone.message}
                </Box>
                <Input
                  text="Phone"
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

              <Textarea
                text="Describe Your Idea"
                name="message"
                placeholder="Please Enter Your Message Here"
                textColor="white"
                sx={{
                  '::placeholder': {
                    color: 'white',
                  },
                }}
                ref={register}
              />
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
    </Section>
  );
};

export default NewsstandStudioInquiryFormBlock;
