/** @jsx jsx */
import {jsx} from '@tishman/components';
import {FallbackProps} from 'react-error-boundary';

const ErrorMessage = ({error}: FallbackProps): JSX.Element => {
  // most likely error will be TypeError: Failed to fetch
  // so we can update that to be more descriptive to users
  // else show actual error.
  const message =
    error?.message === 'TypeError: Failed to fetch'
      ? 'Failed to fetch social media data'
      : error?.message;
  return (
    <div>
      <p>Something went wrong:</p>
      <pre sx={{width: '100%'}}>{message}</pre>
    </div>
  );
};

export default ErrorMessage;
