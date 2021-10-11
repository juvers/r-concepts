import React from 'react';
import {Select} from '@tishman/components';

import type {UseFormMethods} from 'react-hook-form';

interface RegisterOption {
  name: string;
  value: string;
}

export interface ContactSelectProps<Values> {
  name: string;
  text: string;
  errors: UseFormMethods<Values>['errors'];
  required?: boolean;
  register: UseFormMethods<Values>['register'];
  defaultOptionText?: string;
  options: (RegisterOption | string)[];
}

export const ContactSelect = <Values extends Record<string, unknown>>(
  props: ContactSelectProps<Values>,
): JSX.Element => {
  const {
    name,
    text,
    required,
    register,
    errors,
    defaultOptionText,
    options,
  } = props;
  if (!errors)
    throw `Property 'errors' is required for ContactSelect for input ${name}`;
  if (!options || options.length < 0)
    throw 'One more options need to be provided to ContactSelect';

  const [currentValue, setCurrentValue] = React.useState<string | undefined>(
    undefined,
  );
  const optionElements = options.reduce(
    (acc: RegisterOption[], op: RegisterOption | string) => {
      if (typeof op === 'string') {
        return acc.concat({name: op, value: op});
      } else if (op.name !== null && op.value !== null) {
        return acc.concat(op);
      } else {
        console.warn(
          `${JSON.stringify(
            op,
          )} is not of type 'string' nor {name: string; value: string}`,
        );
        return acc;
      }
    },
    [],
  );

  const requiredOptions = required
    ? {
        required: `Please select a valid ${text.toLowerCase()}`,
        validate: (value: string) => value !== 'default',
      }
    : {};

  return (
    <Select
      name={name}
      text={text}
      onChange={(e) => {
        setCurrentValue(e.target.value);
      }}
      ref={register(requiredOptions)}
      defaultValue="default"
      data-selection={currentValue !== undefined}
      required={required || false}
      sx={{
        borderColor: errors[name] ? '#EC104E' : '#FFFFFF',
        backgroundColor: 'background',
        fontSize: [3, 5],
        fontWeight: 'regular',
        '&[data-selection="false"]': {
          color: '#757575',
        },
      }}
    >
      <option value="default" disabled>
        {defaultOptionText || 'Please Choose One'}
      </option>
      {optionElements &&
        optionElements.map((op: RegisterOption) => (
          <option key={op.value} value={op.value}>
            {op.name}
          </option>
        ))}
    </Select>
  );
};
