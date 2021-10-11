/**@jsx jsx */
import {graphql, useStaticQuery} from 'gatsby';
import {useForm} from 'react-hook-form';
import {
  jsx,
  RequiredLabel,
  Input,
  Flex,
  Box,
  Date,
  SubmitButton,
  Container,
  Text,
  Grid,
  Time,
  Form,
  Section,
} from '@tishman/components';
import {ContactSelect} from '~components/Form';
import ContactThankYouBlock from '~blocks/forms/ContactThankYouBlock';
import {H} from '@hzdg/sectioning';
import {useState} from 'react';
import invariant from 'invariant';

const ROCK_SALES_GENERAL_QUERY = graphql`
  query RockGroupSalesGeneral {
    formJson(id: {eq: "group-sales-inquiry"}) {
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
    dataJson(id: {eq: "rock-group-sales"}) {
      general {
        formIntro {
          title
          caption
        }
        contactInformation {
          title
          caption
          phone
          tollFree
          fax
          email
        }
      }
    }
  }
`;

interface RockGroupSalesGeneralBlockValues {
  fullname: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  attraction: string;
  guestcount: string;
}

const RockGroupSalesGeneralBlock = (): JSX.Element => {
  const {
    formJson,
    dataJson,
  } = useStaticQuery<GatsbyTypes.RockGroupSalesGeneralQuery>(
    ROCK_SALES_GENERAL_QUERY,
  );

  const {
    register,
    handleSubmit,
    errors,
    clearErrors,
    setError,
    formState,
  } = useForm<RockGroupSalesGeneralBlockValues>();
  const [showThankYou, setShowThankYou] = useState(false);
  const onSuccess = () => {
    setShowThankYou(true);
  };

  invariant(
    formJson && dataJson,
    'Rock Group Sales General Block and Form JSON data is required!',
  );

  return (
    <Section theme="Top of the Rock">
      <Container sx={{maxWidth: 987, py: [5, 6], px: [3, 4]}}>
        <Grid
          sx={{justifyItems: 'center'}}
          columns={[1, '1fr 315px']}
          gap={[6, 7]}
        >
          <Box>
            <H
              sx={{
                variant: 'styles.h2',
                fontFamily: 'headingSecondary',
                mb: 2,
              }}
            >
              {dataJson.general.formIntro.title}
            </H>
            <Text sx={{variant: 'text.mediumP', mb: [4, 5]}}>
              {dataJson.general.formIntro.caption}
            </Text>
            {showThankYou ? (
              <ContactThankYouBlock {...formJson.thankYouMessage} />
            ) : (
              <Box
                sx={{
                  px: 0,
                  // Removes padding for form
                  '& > div > div': {
                    px: 0,
                  },
                }}
              >
                <Form
                  reactHookHandleSubmit={handleSubmit}
                  errors={errors}
                  clearErrors={clearErrors}
                  setError={setError}
                  onSuccess={onSuccess}
                  id={formJson.integrationId}
                >
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
                      placeholder="ex. Jean Doe"
                      textColor="black"
                      sx={{
                        borderBottom: errors.fullname && '2px solid #EC104E',
                        '::placeholder': {
                          color: 'black',
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
                      text="E-mail"
                      name="email"
                      placeholder="ex. jeand@gmail.com"
                      textColor="black"
                      sx={{
                        borderBottom: errors.email && '2px solid #EC104E',
                        '::placeholder': {
                          color: 'black',
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
                      text="Phone"
                      name="phone"
                      placeholder="ex. 123-123-1234"
                      textColor="black"
                      ref={register()}
                    />
                  </Box>
                  <Grid mb={3} columns={[1, 2]} gap={4}>
                    <Box>
                      <Date
                        text="Date"
                        textColor="black"
                        name="date"
                        ref={register}
                        sx={{
                          borderColor: 'black !important',
                          '::placeholder': {
                            color: 'black',
                          },
                        }}
                      />
                    </Box>
                    <Box>
                      <Time
                        text="Time"
                        name="time"
                        ref={register}
                        sx={{
                          borderColor: 'black !important',
                          '::placeholder': {
                            color: 'black',
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Box
                    sx={{
                      px: 0,
                      // Border color for select
                      // We should probably update the original component
                      '& select': {
                        borderColor: '#000',
                      },
                    }}
                  >
                    <ContactSelect
                      name="attraction"
                      text="Attraction"
                      register={register}
                      errors={errors}
                      defaultOptionText="Choose an attraction"
                      options={['Top of the Rock', 'Rockefeller Center Tour']}
                    />
                  </Box>
                  <Input
                    text="Number of People"
                    textColor="black"
                    name="guestcount"
                    placeholder="ex. 20"
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
                        text={
                          formState.isSubmitting ? `Submitting...` : `Submit`
                        }
                        disabled={formState.isSubmitting}
                      />
                    </Flex>
                  </Flex>
                </Form>
              </Box>
            )}
          </Box>
          <Box>
            <H
              sx={{
                variant: 'styles.h3',
                fontFamily: 'headingSecondary',
                mb: 2,
              }}
            >
              {dataJson.general.contactInformation.title}
            </H>
            <Text mb={3} sx={{variant: 'text.mediumP'}}>
              {dataJson.general.contactInformation.caption}
            </Text>
            <Box sx={{variant: 'text.mediumP'}}>
              <Text sx={{variant: 'text.mediumP'}}>
                {dataJson.general.contactInformation.phone}
              </Text>
              <Text sx={{variant: 'text.mediumP'}}>
                {dataJson.general.contactInformation.tollFree}
              </Text>
              <Text sx={{variant: 'text.mediumP'}}>
                {dataJson.general.contactInformation.fax}
              </Text>
              <Text sx={{variant: 'text.mediumP'}}>
                {dataJson.general.contactInformation.email}
              </Text>
            </Box>
          </Box>
        </Grid>
      </Container>
    </Section>
  );
};

export default RockGroupSalesGeneralBlock;
