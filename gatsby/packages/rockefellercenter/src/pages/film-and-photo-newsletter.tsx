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
  query FilmAndPhotoNewsletterImage {
    desktop: file(relativePath: {eq: "filmphoto.png"}) {
      childImageSharp {
        fluid(maxWidth: 1990) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    mobile: file(relativePath: {eq: "mobile-film-photo.png"}) {
      childImageSharp {
        fluid(maxWidth: 400) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    meta: formJson(id: {eq: "film-and-photo-form"}) {
      meta {
        title
        description
      }
    }
    formJson(id: {eq: "film-and-photo-form"}) {
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

const FilmAndPhotoNewsletter = ({
  data: {formJson, ...data},
}: {
  data: GatsbyTypes.FilmAndPhotoNewsletterImageQuery;
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

  invariant(formJson, 'Film And Photo Newsletter Form JSON data is required!');

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
          sx={{m: '0 auto', px: ['38px', null, 0]}}
          maxWidth={900}
          desktopOrientation="column"
          title="Film & Photo Newsletter"
          caption="As one of the most iconic backdrops in New York, Rockefeller Center is a prized location for film and photo shoots. The Film & Photo Newsletter will keep you updated on the latest oppurtunities."
        />
      </Box>
      <Grid
        columns={[1, null, null, '1fr 300px']}
        gap={0}
        sx={{maxWidth: 750, margin: 'auto'}}
      >
        <Container
          sx={{
            margin: 'auto',
            px: [0, 0, 0, 0],
          }}
        >
          <IntrinsicBox
            maxWidth={[350, 350, 400]}
            sx={{
              margin: ['0 auto', '0'],
              px: ['16px', null, 0],
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
        <Container
          sx={{margin: 0, px: [0, 0, 0, 0], maxWidth: ['100%', '300px']}}
        >
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
              <Box sx={{mb: [5, null, 5]}}>
                {errors.email && (
                  <Text variant="formError">{errors.email.message}</Text>
                )}
                <Input
                  text="Email"
                  name="email"
                  placeholder="Enter Email Address"
                  sx={{
                    borderBottom: errors.email && '2px solid #EC104E',
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
              <Box
                sx={{
                  width: ['100%', null, 'auto'],
                  display: ['block'],
                  '> button': {
                    width: ['100%'],
                  },
                }}
              >
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

export default FilmAndPhotoNewsletter;
