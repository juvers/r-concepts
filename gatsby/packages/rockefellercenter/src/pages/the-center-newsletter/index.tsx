/** @jsx jsx */
import {useState} from 'react';
import invariant from 'invariant';
import {Layout} from '~layouts';
import {graphql} from 'gatsby';
import Img from 'gatsby-image';
import {useForm} from 'react-hook-form';
import {H} from '@hzdg/sectioning';
import {
  jsx,
  Input,
  Checkbox,
  SubmitButton,
  Container,
  Radio,
  Flex,
  Grid,
  Box,
  Text,
  IntrinsicBox,
  Form,
  RequiredLabel,
} from '@tishman/components';
import ContactThankYouBlock from '~blocks/forms/ContactThankYouBlock';

export const query = graphql`
  query RockListImage {
    meta: sanityRockListLp {
      seo {
        title: metaTitle
        description: metaDescription
      }
    }
    desktop: file(relativePath: {eq: "center-newsletter-desktop.png"}) {
      childImageSharp {
        fluid(maxWidth: 1990) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    mobile: file(relativePath: {eq: "center-newsletter-mobile.png"}) {
      childImageSharp {
        fluid(maxWidth: 400) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    formJson(id: {eq: "the-rocklist-newsletter-form"}) {
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

const TheCenterNewsletter = ({
  data: {formJson, ...data},
}: {
  data: GatsbyTypes.RockListImageQuery;
}): JSX.Element => {
  const {
    register,
    handleSubmit,
    errors,
    clearErrors,
    setError,
    formState,
  } = useForm<{email: string}>();
  const [showThankYou, setShowThankYou] = useState(false);
  const onSuccess = () => {
    setShowThankYou(true);
  };

  invariant(formJson, 'The Center Newsletter Form JSON data is required!');

  return (
    <Layout
      sx={{
        pt: 4,
        pb: [5, null, null, 7],
      }}
    >
      <Box sx={{textAlign: 'center', maxWidth: '950px', margin: 'auto'}}>
        <H
          sx={{
            variant: 'text.heroTitle',
            mb: 2,
          }}
        >
          The Center
        </H>
        <Text
          sx={{
            fontSize: '21px',
          }}
          mb={5}
          px={4}
        >
          The wonderful thing about Rockefeller Center is that it&#39;s never
          the same from one day to the next. The Center Newsletter is how you
          stay on top of all the happenings.
        </Text>
      </Box>
      <Grid
        columns={[1, null, null, '1fr 2fr']}
        gap={0}
        sx={{maxWidth: 1250, margin: 'auto'}}
      >
        <Container sx={{height: ['300px', 'auto']}}>
          <IntrinsicBox
            maxWidth={500}
            sx={{
              margin: 'auto',
              borderStyle: 'solid',
              borderWidth: '2px',
              borderColor: 'accent',
              p: [3, null, null, 4],
              height: '100%',
              maxHeight: ['300px', 'none'],
            }}
          >
            <Img
              fluid={data?.mobile?.childImageSharp?.fluid}
              sx={{height: '100%', display: ['block', 'none']}}
            />
            <Img
              fluid={data?.desktop?.childImageSharp?.fluid}
              sx={{height: '100%', display: ['none', 'block']}}
            />
          </IntrinsicBox>
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
              <Grid mt={[4, 4, 4, 0]}>
                {errors.email && (
                  <Text variant="formError">{errors.email.message}</Text>
                )}
                <Input
                  text="Email"
                  name="email"
                  placeholder="Email Address"
                  sx={{
                    '::placeholder': {
                      fontSize: '25px',
                      fontWeight: 400,
                    },
                  }}
                  ref={register({
                    required: 'Required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: 'Please enter a valid email address',
                    },
                  })}
                  required
                />
              </Grid>
              <Grid>
                <Box>
                  <Text sx={{fontWeight: 500}} mt={2} mb={2}>
                    Do you live or work in New York City?
                  </Text>
                  <Grid columns={[1, null, null, 2]}>
                    <Flex>
                      <Radio
                        text="Yes"
                        name="localtonyc"
                        value="true"
                        ref={register}
                      />
                      <Radio
                        text="No"
                        name="localtonyc"
                        value="false"
                        ref={register}
                      />
                    </Flex>
                  </Grid>
                </Box>
              </Grid>
              <Box>
                <Text sx={{fontWeight: 500}} mt={3} mb={3}>
                  What are you interested in? (Check all that apply)
                </Text>
                <Grid mb={4} columns={[1, null, 2, 2]}>
                  <Checkbox
                    text="Food & Drink"
                    name="foodDrink"
                    ref={register}
                  />
                  <Checkbox text="The Rink" name="rinkAtRc" ref={register} />
                  <Checkbox
                    text="Rainbow Room"
                    name="rrBarSixtyFive"
                    ref={register}
                  />
                  <Checkbox text="Shopping" name="shopping" ref={register} />
                  <Checkbox
                    text="Family Entertainment"
                    name="familyEntertainment"
                    ref={register}
                  />
                  <Checkbox
                    text="Private Events & Weddings"
                    name="privateEventsWeddings"
                    ref={register}
                  />
                  <Checkbox
                    text="Events & Experiences"
                    name="rcEventsExperiences"
                    ref={register}
                  />
                  <Checkbox
                    text="Arts, Music & Culture"
                    name="artMusicCulture"
                    ref={register}
                  />
                  <Checkbox
                    text="The Center Magazine"
                    name="rcStories"
                    ref={register}
                  />
                </Grid>
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
                    text={
                      formState.isSubmitting
                        ? `Submitting...`
                        : `SUBSCRIBE TO OUR NEWSLETTER`
                    }
                    disabled={formState.isSubmitting}
                  />
                </Flex>
              </Box>
            </Form>
          )}
        </Container>
      </Grid>
    </Layout>
  );
};

export default TheCenterNewsletter;
