/** @jsx jsx */
import {useState} from 'react';
import invariant from 'invariant';
import {Layout} from '~layouts';
import {graphql} from 'gatsby';
import Img from 'gatsby-image';
import {useForm} from 'react-hook-form';
import {
  jsx,
  Input,
  SubmitButton,
  Container,
  Grid,
  Box,
  IntrinsicBox,
  Form,
  Text,
} from '@tishman/components';
import IntroText from '~components/IntroText';
import ContactThankYouBlock from '~blocks/forms/ContactThankYouBlock';

export const query = graphql`
  query RRBarSixtyFiveNewsletter {
    placeholder: file(relativePath: {eq: "the-rock-list-image.png"}) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    meta: formJson(id: {eq: "sixty-five-newsletter-form"}) {
      meta {
        title
        description
      }
    }
    formJson(id: {eq: "sixty-five-newsletter-form"}) {
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

const RainbowRoomNewsletter = ({
  data: {formJson, ...data},
}: {
  data: GatsbyTypes.RRBarSixtyFiveNewsletterQuery;
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

  invariant(formJson, 'Rainbow Room Newsletter Form JSON data is required!');

  return (
    <Layout sx={{padding: '60px 0'}}>
      <Box
        sx={{
          textAlign: 'center',
          maxWidth: '950px',
          margin: 'auto',
          mb: [5, 7],
        }}
      >
        <IntroText
          center={true}
          sx={{m: '0 auto'}}
          maxWidth={900}
          desktopOrientation="column"
          title="Rainbow Room Newsletter"
          caption="Don't miss an event. Always know about everything happening at the legendary Rainbow Room."
        />
      </Box>
      <Grid
        columns={[1, null, null, '1fr 300px']}
        gap={0}
        sx={{maxWidth: 750, margin: 'auto'}}
      >
        <Container sx={{margin: 'auto', px: [0, 0, 0, 0]}}>
          <IntrinsicBox maxWidth={350} sx={{margin: '0'}}>
            <Img fluid={data.placeholder?.childImageSharp?.fluid} />
          </IntrinsicBox>
        </Container>
        <Container sx={{margin: 0, px: [0, 0, 0, 0], maxWidth: '300px'}}>
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
              <Box sx={{mb: [5, 7]}}>
                {errors.email && (
                  <Text variant="formError">{errors.email.message}</Text>
                )}
                <Input
                  text="Email"
                  name="email"
                  placeholder="Enter Email Address"
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
              </Box>
              <Box>
                <SubmitButton
                  text={
                    formState.isSubmitting ? `Submitting...` : `Subscribe Now`
                  }
                  disabled={formState.isSubmitting}
                />
              </Box>
            </Form>
          )}
        </Container>
      </Grid>
    </Layout>
  );
};

export default RainbowRoomNewsletter;
