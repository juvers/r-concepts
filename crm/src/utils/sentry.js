/**
 * Sentry utils to send messages and errors to sentry
 */
const Sentry = require('@sentry/node');

const {
  SENTRY_DSN = 'https://4b0ddd6cf5114c16a8c05e4a8403c1cf@sentry.hzdg.com/191'
} = process.env;

const sentryLog = (message) => {
  Sentry.init({dsn: SENTRY_DSN});
  const g = Sentry.captureMessage(message);
}

const sentryCapture = (message, {callback = null, statusCode, extras = null} = null) => {
  Sentry.init({dsn: SENTRY_DSN});
  console.log(message);
  let response = {
    statusCode,
    body: JSON.stringify([{
      message: 'There was an error submitting your form. Please contact support.',
    }])
  };
  try {
    const f = Sentry.withScope(scope => {
      const error = new Error(message);
      if (extras) {
        for (const extra of extras) {
          scope.setExtra(extra.name, extra.value);
          console.log(`ERROR: ${extra.name} : ${JSON.stringify(extra.value)}`);
        }
      }

      const ticketId = Sentry.captureException(error);
      response = {
        statusCode: statusCode,
        body: JSON.stringify([{
          message: 'There was an error submitting your form. Please contact support.',
          errorTicket: ticketId,
        }])
      };

      console.log(`Error sent to sentry: ${message} ${ticketId}`);
      if (callback) {
        callback(null, response);
      }
    })
  } catch (error) {
    console.log(`Error: Sentry failed to capture error `, error, message);
  }
  return response;
}

export {
  // Send a simple message to sentry
  sentryLog,
  // Capture an error, return error and ticket ID
  sentryCapture,
}
