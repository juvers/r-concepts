import fetch from 'node-fetch';
import crypto from 'crypto';

const {
  MAILCHIMP_URL = 'https://us18.api.mailchimp.com/3.0',
  MAILCHIMP_AUDIENCE_ID = 'f398f9780a',
  MAILCHIMP_API_KEY
} = process.env;

export default async ({formData, options, formName, formSchemaFields}) => {
  if (!formData) return {status: 500, data: 'No form data was passed to the mailchimp integration'}
  if (!formSchemaFields) return {status: 500, data: 'No form fields was passed to the mailchimp integration'}
  if (!MAILCHIMP_URL) return {status: 500, data: 'MAILCHIMP_URL is not specified'}
  if (!MAILCHIMP_AUDIENCE_ID) return {status: 500, data: 'MAILCHIMP_AUDIENCE_ID is not specified' }
  if (!MAILCHIMP_API_KEY) return {status: 500, data: 'MAILCHIMP_API_KEY is not specified'}

  const memberEndpoint = `/lists/${MAILCHIMP_AUDIENCE_ID}/members`;

  const {tags = [], customFields = {}, interests = [], updateFields = null} = options;

  let newData = formData;
  if (updateFields) {
    try {
      newData = updateFields(formData, formSchemaFields);
      // TODO: Prevent relying on an error property from newData
      if (newData.error) {
        return {status: 500, data: `Error in updateFields function for ${formName}: ${newData.error}`};
      }
    } catch (error) {
      return {status: 500, data: `Error in updateFields function for ${formName}: ${error}`};
    }
  }

  const { newsletter } = newData;

  if(newsletter !== undefined && newsletter == "false"){
    return {status: 200, data: `NewsLetter Not Subscribed`};
  }

  const {email, customTags = [], customInterests = [], ...mergeFields} = newData;

  const body = {
    email_address: email, // eslint-disable-line @typescript-eslint/camelcase
    tags: [...tags, ...customTags],
    interests: {...interests, ...customInterests},
    merge_fields: {...mergeFields, ...customFields}, // eslint-disable-line @typescript-eslint/camelcase
  };

  let status = 500;
  let responseText = null;
  let tagResponseText = null;
  let extraContext = null;

  try {
    const response = await fetch(`${MAILCHIMP_URL}${memberEndpoint}/${email}`, {
      method: 'put',
      headers: {
        Authorization: `apikey ${MAILCHIMP_API_KEY}`,
      },
      body: JSON.stringify({...body, status: 'subscribed'}),
    });
    responseText = await response.json();

    if (response.status === 400 && responseText.title === 'Forgotten Email Not Subscribed') {
      extraContext = `User must fill out a Mailchimp hosted form in order to be added back to the list. To read more on permanently deleted contacts go to https://mailchimp.com/help/delete-contacts/#Archive_vs._Remove`;
    }

    status = response.status;
  } catch (error) {
    responseText = error;
  }

  // Update tags
  try {
    const hash = crypto.createHash('md5').update(email).digest("hex");
    const tagResponse = await fetch(`${MAILCHIMP_URL}${memberEndpoint}/${hash}/tags`, {
      method: 'post',
      headers: {
        Authorization: `apikey ${MAILCHIMP_API_KEY}`,
      },
      body: JSON.stringify({
        tags: body.tags.map(tag => {
          return {'name': tag, 'status': 'active'};
        }),
      })
    });
    tagResponseText = await response.json();

    // Give this secondary request higher priority
    if (status === 200) {
      status = tagResponse.status;
    }
  } catch (error) {
    tagResponseText = error;
  }

  return {
    status,
    data: {
      addMember: responseText,
      updateTags: tagResponseText,
    },
    extraContext,
  }
}
