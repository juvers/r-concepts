/* eslint-disable @tishman/prefer-tishman-components */
/** @jsx jsx */
import {jsx, Heading} from 'theme-ui';

import type {ReactNode} from 'react';

interface HeadingProps {
  id?: string;
  children: string;
  Tag: string;
}

const heading = (headingType: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'): ReactNode => {
  const Component = (props: HeadingProps): JSX.Element => {
    // add variant to use tishmanTheme base styles when creating
    // these tags in mdx files. Previously it would not obey
    // heading types and only used the root font size
    return props.id ? (
      <Heading
        as={headingType}
        sx={{
          variant: `styles.${headingType}`,
          my: 3,
        }}
        {...props}
      >
        <a
          href={`#${props.id}`}
          sx={{
            color: 'inherit',
            textDecoration: 'underline',
          }}
        >
          {props.children}
        </a>
      </Heading>
    ) : (
      <Heading
        as={headingType}
        sx={{
          variant: `styles.${headingType}`,
          my: 3,
        }}
        {...props}
      />
    );
  };

  Component.displayName = headingType;
  return Component;
};

export const h2 = heading('h2');
export const h3 = heading('h3');
export const h4 = heading('h4');
export const h5 = heading('h5');
export const h6 = heading('h6');
