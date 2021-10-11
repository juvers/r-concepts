/** @jsx jsx */
import React, {useState, ChangeEvent} from 'react';
import {jsx, Box, Label, Flex, Button} from '@tishman/components';

import type {ThemeUIComponentProps} from '@tishman/components';

export type UploadInputProps = ThemeUIComponentProps<
  'forms',
  'input',
  {
    text: string;
    textColor?: string;
    required?: boolean;
    id?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    hasFileAttachment?: boolean;
  }
>;

export const UploadInput = React.forwardRef(
  (
    {
      text,
      textColor = 'text',
      required = false,
      variant = 'input',
      placeholder,
      id,
      ...props
    }: UploadInputProps,
    ref: UploadInputProps['ref'],
  ) => {
    const [hasFile, setHasFile] = useState(false);

    const isFlagProjectForm = id === 'flagProjectFormFileInput';

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
      event.preventDefault();
      const {value} = event.target;
      if (value !== null) setHasFile(true);
    };

    return (
      <Label
        my={2}
        sx={{
          flexDirection: 'column',
          alignItems: 'flex-start',
          color: textColor,
        }}
      >
        <Flex sx={{cursor: 'pointer'}}>
          <Box
            ref={ref}
            id={id}
            as="input"
            variant={variant}
            type="file"
            data-selection={hasFile || props?.hasFileAttachment}
            placeholder={placeholder}
            onChange={isFlagProjectForm ? props?.onChange : handleChange}
            {...props}
            __themeKey="forms"
            __css={{
              display: 'block',
              width: '100%',
              textIndent: '0',
              appearance: 'none',
              fontSize: 'inherit',
              lineHeight: 'inherit',
              border: '1px solid',
              borderRadius: 4,
              color: 'inherit',
              fontFamily: 'body',
              bg: 'transparent',
              '&[data-selection="false"]': {
                color: '#757575',
                borderColor: '#FFFFFF',
              },
              '::-webkit-file-upload-button': {
                width: 0,
                margin: 0,
                padding: 0,
                border: 0,
                appearance: 'none',
                textAlign: 'left',
                left: '1px',
              },
            }}
          />
          <Button
            variant="inverted"
            sx={{
              cursor: 'pointer',
              marginLeft: '10px',
              fontSize: '13px',
              letterSpacing: '1px',
              minWidth: 'auto',
              borderBottom: '2px solid',
              alignSelf: 'flex-end',
              marginBottom: '0px',
              fontFamily: 'body',
              position: 'relative',
              top: '8px',
              px: 3,
              py: 2,
              pointerEvents: 'none',
            }}
          >
            BROWSE
          </Button>
        </Flex>
        {text}
        {required && '*'}
      </Label>
    );
  },
);

UploadInput.displayName = 'UploadInput';

export default UploadInput;
