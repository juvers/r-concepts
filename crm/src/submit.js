import * as formObjects from './forms';
import mailchimp from './integrations/mailchimp';
import sendgrid from './integrations/sendgrid';
import tripleseat from './integrations/tripleseat';
import {sentryLog, sentryCapture} from './utils/sentry';
import Busboy from 'busboy';
import atob from 'atob';

// Enable/Disable integrations here
export const ACTIVE_INTEGRATIONS = {
  mailchimp,
  sendgrid,
  tripleseat
};

// Checks that all fields specified in the backend match with what is sent from the
// frontend form
const validateFields = (formId, data) => {
  const formMakeup = formObjects[formId].fields;
  const formData = data;
  for (const fieldObj of formMakeup) {
    if (fieldObj.required) {
      if (!formData[fieldObj.name]) {
        return {
          error: {
            message: `${fieldObj.name} is required for ${formId} but was not provided in submission.`,
            statusCode: 400,
            extras: [
              {
                name: 'Backend Form Objects',
                value: formMakeup,
              },
              {
                name: 'Submitted Form Data',
                value: formData,
              }
            ]
          }
        };
      }
    }
  }
  return {error: null};
}

const runIntegration = async (integrationObject, data, formSchemaFields) => {
  if (ACTIVE_INTEGRATIONS[integrationObject.name]) {
    const a = await ACTIVE_INTEGRATIONS[integrationObject.name]({
      formData: data,
      options: integrationObject.options,
      formName: integrationObject.name,
      formSchemaFields,
    });
    return a;
  } else {
    const message = `Attempted to integrate ${integrationObject.name} with form ${data.id} but the integration is either missing or disabled`;
    console.log(message);
    sentryLog(message);
    return Promise.resolve('nope');
  }
}

const dispatchIntegrations = async (integrations, data, formSchemaFields) => {
  return Promise.all(integrations.map(integrationObject => runIntegration(integrationObject, data, formSchemaFields)))
}

const getFormData = (event) => {
  return new Promise((resolve, reject) => {
    let formData = event.body;
    if (event.isBase64Encoded) {
      formData = atob(formData);
    }
    let busboy = new Busboy({
      headers: {
        ...event.headers,
        "content-type":
        event.headers["Content-Type"] || event.headers["content-type"],
      },
    });
    let dataObj = {};

    busboy.on('file', function (fieldname, file) {
      file
        .on('data', data => {
          dataObj[fieldname] = data;
        })
    });

    busboy.on('field', (fieldname, val) => {
      dataObj[fieldname] = val;
    });

    busboy.on('finish', () => {
      resolve(dataObj);
    });

    busboy.on('error', err => {
      console.log('Error parsing form data:', err);
      reject(`Error parsing form data: ${err}`);
    });

    busboy.end(formData);
  });
}

exports.handler = async function(event, context) {
  if (!event || event === undefined) {
    return sentryCapture(`event object is not passed to handler`, {statusCode: 500});
  }

  let formId = null;
  let formData = null;
  let data = null;
  try {
    data = await getFormData(event);
    const {id = undefined, ...fields} = data;
    formId = id;
    formData = fields;
  } catch (error) {
    console.log(`Error parsing request body: ${error} ${event}`);
    return sentryCapture(`Error parsing request body: ${error}`, {statusCode: 500});
  }

  // Check for a form ID
  if (!formId) {
    console.log(`A unique form 'id' is required for submitting the form.`, JSON.stringify(data));
    return {
      statusCode: 400,
      body: JSON.stringify([{
        message: 'There was an error submitting your form. Please contact support.',
        error: 'Error: Form is missing a form ID.'
      }])
    };
  }

  // Check for an existing form instance setup in the backend
  const formSchema = formObjects[formId];
  if (!formSchema) {
    console.log(`No form instance was found for ${formId}. Either it's misspelled or you may need to create a new form instance.`, JSON.stringify(data))
    return {
      statusCode: 400,
      body: JSON.stringify([{
        message: 'There was an error submitting your form. Please contact support.',
        error: 'Error: Provided form ID does not match a valid form.'
      }])
    };
  }

  // Retrieve integrations enabled for the form
  const integrations = formSchema.options?.integrations;
  if (integrations?.length < 1) {
    return sentryCapture(
      `No integration is specified in the form instance's options. Please set at least one integration. ${JSON.stringify(integrations)} ${integrations.length}`,
      {
        statusCode: 400,
        extras: [
          {
            name: 'Form ID',
            value: formId,
          },
          {
            name: 'Form Fields',
            value: formData,
          }
        ],
      }
    )
  }

  const validResult = validateFields(formId, formData);
  if (validResult.error) {
    const { message, ...errorOptions } = validResult;
    return sentryCapture(message, ...errorOptions);
  }

  // Send out form information to the integrations
  try {
    const dispatchResults = await dispatchIntegrations(integrations, { id: formId, ...formData }, formSchema.fields);
    const errors = dispatchResults.filter(item => item.status !== 200);
    if (errors.length > 0) {
      console.log(`One or more errors occurred while submiting to one or more services: formid: ${formId}, integration Errors: ${JSON.stringify(errors)}`);
      return sentryCapture(
        `One or more errors occurred while submitting to one or more services.`,
        {
          statusCode: 500,
          extras: [
            {
              name: 'Form ID',
              value: formId
            },
            {
              name: 'Form Fields',
              value: formData
            },
            {
              name: 'Integration Errors',
              value: errors
            },
          ]
        }
      );
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify([{
          message: 'Success!',
        }])
      };
    }
  } catch(error) {
    const errorDispatchMessage = `There was an error dispatching integrations: ${error}`;
    console.log(errorDispatchMessage);
    return sentryCapture(errorDispatchMessage, { statusCode: 500 });
  }
}
