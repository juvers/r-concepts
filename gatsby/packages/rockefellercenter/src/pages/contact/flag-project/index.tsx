/** @jsx jsx */
import {useForm} from 'react-hook-form';
import invariant from 'invariant';
import {
  jsx,
  Text,
  RequiredLabel,
  Input,
  UploadInput,
  Flex,
  Box,
  Textarea,
  SubmitButton,
  Grid,
  Form,
  Checkbox,
} from '@tishman/components';
import {ContactSelect} from '~components/Form';
import {Layout} from '~layouts';
import ContactUsBlock from '~blocks/ContactUsBlock';
import {useState, Fragment} from 'react';
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

// All accepted file types
const fileType = [
  'application/pdf',
  'image/tiff',
  'image/jpeg',
  'image/jpg',
  'image/vnd.adobe.photoshop',
];

// JPG file types (where we are capturing width and height of the image)
const imageType = ['image/jpeg', 'image/jpg'];

// Other file types where we are not capturing the dimensions
const noDimensionType = [
  'application/pdf',
  'image/tiff',
  'image/vnd.adobe.photoshop',
];

export const query = graphql`
  query FlagForm {
    meta: formJson(id: {eq: "flag-project-form"}) {
      meta {
        title
        description
      }
    }
    formJson(id: {eq: "flag-project-form"}) {
      id
      integrationId
      name
      slug
      description {
        text
        image {
          id
          fluid {
            ...GatsbyImageSharpFluid
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
      formSubmissionNotice
    }
  }
`;

interface FlagFormValues {
  fullname: string;
  email: string;
  phone: string;
  address: string;
  comments: string;
  city: string;
  state: string;
  zip: string;
  file: string;
  socialMediaPlatform: string;
  socialMediaHandle: string;
  formSubmissionNotice?: string;
  disclaimer: string;
}

interface ImageDimensions {
  width: string;
  height: string;
}

const FlagForm = ({
  data: {formJson},
}: {
  data: GatsbyTypes.FlagFormQuery;
}): JSX.Element => {
  const {
    register,
    handleSubmit,
    errors,
    clearErrors,
    setError,
    formState,
  } = useForm<FlagFormValues>();
  const [showThankYou, setShowThankYou] = useState(false);
  const onSuccess = () => {
    setShowThankYou(true);
  };

  const [hasFileAttachment, setFileAttachment] = useState(false);

  const [imageDimensions, setImageDimensions] = useState({
    width: '',
    height: '',
  });

  // Convert the uploaded image to base 64 encoded string
  const encodePhoto = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', function () {
        if (!reader.result) reject();
        resolve(String(reader.result));
      });
      if (file) {
        reader.readAsDataURL(file);
      }
    });
  };

  // Promise to get the image dimensions and send to Netlify form
  function getImageDimensions(file: string) {
    return new Promise<ImageDimensions>(function (resolve) {
      const image = new Image();
      image.src = file;

      image.onload = function () {
        resolve({
          width: String(image.width),
          height: String(image.height),
        });
      };
    });
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const {files} = event.target;
    // Check for uploaded files types that are images (jpg/jpeg)
    if (files && files.length > 0) {
      setFileAttachment(true);
      if (imageType.includes(files[0].type)) {
        const encodedImage = await encodePhoto(files[0]);
        const dimensions = await getImageDimensions(encodedImage);

        setImageDimensions({
          width: dimensions.width,
          height: dimensions.height,
        });
      }
    }
  };

  invariant(formJson, 'Flag project form JSON data is required!');

  const {width, height} = imageDimensions;

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
          name={formJson.name}
          dimensions={imageDimensions}
          data-netlify="true"
          data-netlify-honeypot="bot-field"
        >
          <input type="hidden" name="form-name" value={`${formJson.name}`} />
          <input type="hidden" name="bot-field" />
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
                  placeholder="Zip Code"
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
            <Grid columns={[1]} gap={4}>
              <Box>
                {errors.file && (
                  <Text variant="formError">{errors.file.message}</Text>
                )}
                <UploadInput
                  id={`${formJson.integrationId}FileInput`}
                  text="Upload Your Flag (tiff, psd, jpg, pdf)"
                  name="file"
                  placeholder="No file chosen"
                  accept=".tiff, .psd, .jpg, .pdf"
                  ref={register({
                    required: 'Please select an image',
                    validate: {
                      fileType: (value) =>
                        fileType.includes(value[0].type) ||
                        'File type not supported',
                      fileSize: (value) =>
                        Math.round(value[0].size / 1024) <= 102400 ||
                        'File size must be less than 100 MB',
                      fileOrientation: (value) =>
                        // Check file orientation only for jpg / ipeg file types
                        // and skip for the rest of the file types
                        noDimensionType.includes(value[0].type) ||
                        (imageType.includes(value[0].type) &&
                          parseInt(width) > parseInt(height)) ||
                        'Only landscape images are allowed',
                    },
                  })}
                  onChange={handleFileChange}
                  sx={{
                    pt: 13,
                    pb: '3px',
                    borderColor: errors.file ? '#EC104E' : '#FFFFFF',
                    '::placeholder': {
                      color: '#fff',
                    },
                  }}
                  required={true}
                  hasFileAttachment={hasFileAttachment}
                />
              </Box>
              <input type="hidden" name="imageWidth" />
              <input type="hidden" name="imageHeight" />
            </Grid>
            {errors.comments && (
              <Text variant="formError">{errors.comments.message}</Text>
            )}
            <Textarea
              text="Comments"
              name="comments"
              placeholder="Tell us briefly about the photo you submitted and
               why you'd like to see it as a flag at Rockefeller Center"
              ref={register({required: 'Please enter comments'})}
              sx={{
                borderColor: errors.comments && '#EC104E',
                '::placeholder': {
                  color: '#fff',
                },
              }}
              required
            />
            <Box sx={{mt: 4, mb: 2}}>
              <Text variant="smallP">
                Share your social handle with us so we can tag you
              </Text>
            </Box>
            <Grid columns={[1, 2]} gap={4}>
              <Box>
                {errors.socialMediaPlatform && (
                  <Text variant="formError">Please select a platform</Text>
                )}
                <ContactSelect
                  name="socialMediaPlatform"
                  text="Social Media Platform"
                  register={register}
                  errors={errors}
                  defaultOptionText="Choose a platform"
                  options={['Twitter', 'Instagram', 'Facebook']}
                />
              </Box>
              <Box>
                <Input
                  text="Enter Your Social Media Handle"
                  name="socialMediaHandle"
                  placeholder="Social Media Handle"
                  ref={register}
                  sx={{
                    '::placeholder': {
                      color: '#fff',
                    },
                  }}
                />
              </Box>
            </Grid>
          </Box>
          <Fragment>
            {formJson?.formSubmissionNotice.map(
              (submissionString: string, index: number) => (
                <Box key={index} sx={{my: 4}}>
                  <Text variant="smallP">{submissionString}</Text>
                </Box>
              ),
            )}
          </Fragment>
          <Box sx={{my: 2}}>
            {errors.disclaimer && (
              <Text variant="formError">{errors.disclaimer.message}</Text>
            )}
            <Checkbox
              ref={register({required: 'Please accept terms and conditions'})}
              name="disclaimer"
              text="I have read and acknowledge the statement above"
              required={true}
              sx={{
                color: 'white',
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

export default FlagForm;
