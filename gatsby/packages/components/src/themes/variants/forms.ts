import {WHITE} from '~themes/colors';

export const label = {
  color: 'text',
  alignItems: 'center',
  display: 'inline-block',
  fontSize: [2, 3],
};

export const select = {
  color: 'text',
  border: 'none',
  borderBottom: `2px solid currentColor`,
  borderRadius: 'square',
  fontSize: [3, 5],
  fontWeight: 'light',
  px: 0,
  py: 2,
  '::placeholder': {
    color: 'text',
    opacity: 0.5,
  },
  inverted: {
    color: 'background',
    bg: 'text',
  },
};

export const input = {
  color: 'text',
  border: 'none',
  borderBottom: `2px solid currentColor`,
  borderRadius: 'square',
  fontSize: [3, 5],
  fontWeight: 'light',
  mb: [1, 2],
  px: 0,
  py: 2,
  '::placeholder': {
    color: 'text',
    opacity: 0.5,
  },
  footer: {
    color: 'text',
    border: 'none',
    borderBottom: `1px solid ${WHITE}`,
    borderRadius: 'square',
    fontSize: 4,
    p: 0,
    '::placeholder': {
      color: 'text',
    },
  },
};

export const textarea = {
  color: 'text',
  border: 'none',
  borderBottom: `2px solid currentColor`,
  borderRadius: 'square',
  fontSize: [3, 5],
  fontWeight: 'light',
  fontFamily: 'body',
  resize: 'none',
  mb: [1, 2],
  px: 0,
  py: 2,
  '::placeholder': {
    color: 'text',
    opacity: 0.5,
  },
};
