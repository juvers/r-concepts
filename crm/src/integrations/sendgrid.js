import sgMail from '@sendgrid/mail';
import sanityClient from '@sanity/client'
import fs from 'fs';

const {
  SENDGRID_API_KEY,
  SENDGRID_DEV_TO,
  SENDGRID_DEV_FROM,
  SANITY_PROJECT_ID = 'bs9rmafh',
  SANITY_DATASET = 'production',
  SANITY_ASSET_TOKEN
} = process.env;

const sanitySendgridPrefix = 'sendgrid-treelighting';

sgMail.setApiKey(SENDGRID_API_KEY);

const uploadPhotoToSanity = async (filename, image, filetype) => {
  const client = sanityClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    token: SANITY_ASSET_TOKEN
  })
  // Temporarily create a file to stream to preserve full image file data when read
  const dataUri = image.replace(`data:${filetype};base64,`, '');
  const dataBuffer = Buffer.from(dataUri, 'base64');
  const nowDate = new Date(Date.now());
  const dateHash = nowDate.toISOString().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '_');
  const hashedDateFilename = `${dateHash}-${filename}`;
  const tmpDir = '/tmp/';
  const filePath = `${tmpDir}${hashedDateFilename}`;

  fs.writeFileSync(filePath, dataBuffer, {encoding: 'base64'});

  // Send to Sanity
  try {
    const imageAssets = await client.assets.upload('image', fs.createReadStream(filePath), {
      filename: `${sanitySendgridPrefix}-${hashedDateFilename}`,
    });
    if (imageAssets) {
      // Clean up temporary file after successful upload
      fs.unlink(hashedDateFilename, (err) => {
        if (err) {
          // Don't reject, not a show stopper if image isn't successfully removed
          console.log(`Error deleting ${hashedDateFilename}`);
        }
      });
      return imageAssets;
    } else {
      const errMsg = `Error: Image assets received after upload is null! ${filepath}`
      console.log(errMsg);
      throw new Error(errMsg);
    }
  } catch(err) {
    console.log('Error uploading asset to sanity', err);
    throw err;
  }
}

export default async ({formData, options, formName, formSchemaFields}) => {
  if (!formData) return {status: 500, data: 'No form data was passed to the sendgrid integration'};
  if (!formSchemaFields) return {status: 500, data: 'No form fields were passed to the sendgrid integration'};
  if (!options) return {status: 500, data: 'Options {to, from, subject} for sendgrid integration are required'}

  let {
    to,
    from,
    subject
  } = options;

  // Override recipients if dev email is given
  if (SENDGRID_DEV_TO) {
    to = SENDGRID_DEV_TO.split(',');
  }
  if (SENDGRID_DEV_FROM) {
    from = SENDGRID_DEV_FROM;
  }

  if (!to) return {status: 500, data: `No 'to' recepients are specified for ${formName}.`};
  if (!from) return {status: 500, data: `No 'from' sender specified for ${formName}.`};
  if (!subject) return {status: 500, data: `No 'subject' line specified for ${formName}.`};

  let emailBody = formSchemaFields.map(field => {
    // TODO: Compare against a field's type instead of a field's name
    if (field.name !== 'image') {
      return `${field.title}: ${formData[field.name]}`;
    }
  })

  if (formData.filename && formData.image && formData.filetype) {
    try {
      const imageAsset = await uploadPhotoToSanity(formData.filename, formData.image, formData.filetype);
      emailBody = emailBody.concat(`Image: ${imageAsset.url}`);
    } catch(error) {
      console.log('Error uploading photo to sanity', JSON.stringify(formData));
      return {
        status: 500,
        data: `Error uploading photo to sanity ${error}`,
      }
    }
  }

  const message = {
    to,
    from,
    subject,
    text: emailBody.join('\n'),
    html: emailBody.join('<br />'),
  }

  try {
    const response = await sgMail.send(message);
    const firstResponse = response[0];
    if (firstResponse && (firstResponse.statusCode === 200 || firstResponse.statusCode === 202)) {
      return {
        status: 200,
        data: 'success'
      }
    } else {
      return {
        status: response.statusCode,
        data: response.body,
      };
    }
  } catch (error) {
    return {
      status: error.code,
      data: error.message,
      extraContext: error.response,
    };
  }
}
