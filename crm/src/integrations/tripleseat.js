// https://support.tripleseat.com/hc/en-us/articles/205161948-Lead-Form-API-endpoint
import fetch from 'node-fetch';

const {
  TRIPLESEAT_PUBLIC_KEY = 'fb17f1715ad42ba617463352a2ebb5174224b3ae'
} = process.env;

export default async ({formData, options, formName, formSchemaFields}) => {
  if (!formData) return {status: 500, data: 'No form data was passed to the tripleseat integration'}
  if (!options) return {status: 500, data: `options.updateFields function is required for ${formName} schema`}
  if (!TRIPLESEAT_PUBLIC_KEY) return {status: 500, data: 'TRIPLESEAT_PUBLIC_KEY is not specified'}

  const leadEndpoint = `http://api.tripleseat.com/v1/leads/create.js?public_key=${TRIPLESEAT_PUBLIC_KEY}`;

  let status = 500;
  let responseObj = null;
  let extraContext = null;
  let newData = null;

  const {updateFields} = options;
  if (updateFields) {
    try {
      newData = updateFields(formData, formSchemaFields);
      // TODO: Prevent relying on an error property from newData
      if (newData.error) {
        return {status: 500, data: `Error in updateFields function for ${formName}: ${newData.error}`};
      }
    } catch (error) {
      return {status: 500, data: `Error in updateFields function for ${formName}: ${newData.error}`};
    }
  } else {
    return {status: 500, data: `updateFields function is required for ${formName} schema`};
  }
  if (!newData) {
    return {status: 500, data: `updateFields function  did not return valid data for ${formName}. Got ${newData}`};
  }

  const params = Object.keys(newData).map((key) => `lead[${key}]=${newData[key]}`).join('&');

  try {
    const response = await fetch(`${leadEndpoint}&${params}`, {
      method: 'post',
    });
    responseObj = await response.json();
    status = response.status;
  } catch (error) {
    responseObj = error;
  }
  return {
    status,
    data: responseObj,
    extraContext
  }
}
