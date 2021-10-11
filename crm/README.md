# Some CRM

## How to Use

Endpoint: `.netlify/functions/submit`

### Local Debug
- Add `GATSBY_FORM_SUBMISSION_ENDPOINT=/.netlify/functions/submit` to your root .env, and source it
- Go to the `crm/` folder
- Run `yarn` in the
- Then run `netlify-lambda serve src`

### Netlify Setup
- Add `GATSBY_FORM_SUBMISSION_ENDPOINT` `/.netlify/functions/submit` to the Netlify site's environment variables in the deploy settings.

## Sentry
This app logs errors to Sentry.

## Add a New Form
- Create a new form object in the `forms/` folder
- Export the form in `forms/index`

## Finding IDs
Use https://us1.api.mailchimp.com/playground/ to find the right ID.

## Things to Note
- Any deletion to interests must be updated in the code as well or else forms will fail.
- Source `SENDGRID_DEV_TO` containing your own email to test emails locally.
- Source `SENDGRID_DEV_FROM` with a valid sender email that has been set up in Sendgrid.
