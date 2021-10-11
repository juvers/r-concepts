/** @jsx jsx */
import {jsx, Container, IntrinsicBox} from '@tishman/components';
import {ReactNode, useState} from 'react';

import type {UseFormMethods, SubmitHandler} from 'react-hook-form';

const {
  GATSBY_FORM_SUBMISSION_ENDPOINT = '/.netlify/functions/submit',
} = process.env;

type SubmitError = {
  message: {message: string; errorTicket: string; error: string}[];
};

type InternalFormProps<
  Values extends Record<string, unknown>
> = FormProps<Values> & {
  errors: Record<string, SubmitError>;
  clearErrors: (name?: string) => void;
  setError: (
    name: string,
    options: Parameters<FormProps<Values>['setError']>[1],
  ) => void;
};

export interface FormProps<Values extends Record<string, unknown>> {
  id: string;
  // Coming from react-hook-forms
  reactHookHandleSubmit: UseFormMethods<Values>['handleSubmit'];
  errors: UseFormMethods<Values>['errors'];
  clearErrors: UseFormMethods<Values>['clearErrors'];
  setError: UseFormMethods<Values>['setError'];
  onSuccess: () => void;
  children: ReactNode;
  autoComplete?: string;
  showErrorMessage?: boolean;
  name?: string;
  // Image Dimesnions for file Upload in Flag Project Form
  dimensions?: {
    width: string;
    height: string;
  };
}

export const encodePhoto = async (file: File): Promise<string> => {
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

export function Form<Values extends Record<string, unknown>>(
  props: FormProps<Values>,
): JSX.Element {
  const [submitAttempt, setSubmitAttempt] = useState(false);
  const {
    id,
    reactHookHandleSubmit,
    children,
    errors,
    setError,
    clearErrors,
    onSuccess,
    autoComplete = 'on',
    showErrorMessage = true,
    ...formProps
  } = props as InternalFormProps<Values>;

  if (!clearErrors) {
    throw `'clearErrors' is required for Forms for ${id}`;
  }
  if (!setError) {
    throw `'setError' is required for Forms for ${id}`;
  }
  if (!reactHookHandleSubmit) {
    throw `'reactHookHandleSubmit' is required for Forms for ${id}`;
  }

  const submitForm: SubmitHandler<Values> = async (values, event) => {
    event?.preventDefault();
    setSubmitAttempt(true);
    clearErrors('server');

    const formData = new FormData();
    formData.append('id', id);

    for (const i in values) {
      const value = values[i];

      if (value instanceof FileList) {
        const file = value[0];
        const encodedPhoto = await encodePhoto(file);
        formData.append(i, encodedPhoto);
        // filename and filetype used for uploading image to Sanity
        formData.append('filename', file.name);
        formData.append('filetype', file.type);
      } else {
        formData.append(i, value as string);
      }
    }

    try {
      const response = await fetch(GATSBY_FORM_SUBMISSION_ENDPOINT, {
        method: 'POST',
        headers: {},
        mode: 'cors',
        body: formData,
      });

      const responseText = (await response.json()) as string;

      if (response.status != 200) {
        setError('server', {type: 'manual', message: responseText});
      } else {
        onSuccess();
      }
    } catch (e) {
      setError('fetch', {type: 'manual', message: (e as Error).message});
    }
  };

  const submitFlagProjectForm: SubmitHandler<Values> = async (
    values,
    event,
  ) => {
    event?.preventDefault();

    const {dimensions} = formProps;

    setSubmitAttempt(true);
    clearErrors('server');

    const formData = new FormData();
    formData.append('imageWidth', dimensions ? dimensions?.width : '');
    formData.append('imageHeight', dimensions ? dimensions?.height : '');

    formData.append('id', id);
    formData.append('form-name', event?.target.getAttribute('name'));

    for (const i in values) {
      const value = values[i];
      if (value instanceof FileList) {
        const file = value[0];
        formData.append('file', file);
      } else {
        formData.append(i, value as string);
      }
    }

    fetch('/', {
      method: 'POST',
      headers: {},
      body: formData,
    })
      .then((response) => {
        response.status === 200 && onSuccess();
        // Scroll to top of the page if submission went through
        typeof window !== 'undefined' &&
          window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth',
          });
      })
      .catch((error: Error) =>
        setError('fetch', {type: 'manual', message: (error as Error).message}),
      );
  };

  const errorMessages = Object.keys(errors).map((errorKey) => {
    const error = errors[errorKey]?.message;
    if (error instanceof Array) {
      const ticket = error[0].errorTicket;
      const message = error[0].message;
      return (
        <div key={errorKey}>
          {message}
          <br />
          {ticket ? ` Ticket: ${ticket}` : null}
          {errorKey === 'fetch' ? 'Fetch Error: 001' : null}
        </div>
      );
    } else {
      return null;
    }
  });

  const isFlagProjectForm = id === 'flagProjectForm';

  return (
    <IntrinsicBox ratio={9 / 1}>
      <Container sx={{maxWidth: 900}}>
        <form
          id={id}
          onSubmit={
            isFlagProjectForm
              ? reactHookHandleSubmit(submitFlagProjectForm)
              : reactHookHandleSubmit(submitForm)
          }
          noValidate
          autoComplete={autoComplete}
          action="POST"
          {...formProps}
        >
          {children}
        </form>
      </Container>
      {showErrorMessage && (
        <Container>
          {submitAttempt && errorMessages && errorMessages.length > 0
            ? errorMessages
            : null}
        </Container>
      )}
    </IntrinsicBox>
  );
}
