import {BLACK} from '~themes/colors';

export const primary = {
  bg: 'transparent',
  color: 'text',
  fontSize: 1,
  borderRadius: 'square',
  letterSpacing: 4,
  border: `1px solid`,
  borderColor: 'text',
  px: 5,
  py: '24px',
  textTransform: 'uppercase',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: `color 0.3s ease-in-out,
        background-color 0.3s ease-in-out,
        border-color 0.3s ease-in-out`,

  ':not(:disabled):hover': {
    bg: 'accent',
    color: 'text',
  },

  ':disabled': {
    border: 'none',
    cursor: 'default',
    bg: 'backgroundDisabled',
  },
};

export const inverted = {
  // get base styling of buttons.base
  variant: 'buttons.primary',
  bg: 'text',
  borderColor: 'text',
  color: 'background',
};

export const secondaryMenuToggle = {
  variant: 'buttons.icon',
  textTransform: 'none',
  color: 'text',
  bg: 'background',
  border: 'none',
  fontSize: 3,
  letterSpacing: [3, 4],
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  alignItems: 'center',
  width: '100%',
  px: [3, 4, 5],
  py: 3,

  '&:after': {
    flexBasis: '100%',
    content: '""',
    display: 'block',
    width: '100%',
    borderBottom: '1px solid',
    borderColor: 'text',
    mt: 2,
  },

  '.sticky &': {
    fontSize: 2,
    py: 2,
  },

  '.sticky &:after': {
    display: 'none',
  },
};

export const footer = {
  bg: 'text',
  color: 'background',
  fontSize: 1,
  borderRadius: 'square',
  border: `1px solid`,
  borderColor: BLACK,
  letterSpacing: 4,
  p: 25,
  textTransform: 'uppercase',
  flexShrink: 0,
  cursor: 'pointer',
  transition: 'color 0.3s ease-in-out, background-color 0.3s ease-in-out',
  minWidth: '144px',

  '&:hover': {
    bg: 'primary',
  },
};

// For wrapping icons in buttons.
export const icon = {
  color: 'text',
  fontSize: 1,
  letterSpacing: 5,
  textTransform: 'uppercase',
  textDecoration: 'none',
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  bg: 'transparent',
  cursor: 'pointer',
  transition: 'color 0.3s ease-in-out',

  '&:disabled': {
    color: 'backgroundDisabled',
    cursor: 'default',
  },
};

export const iconUnderline = {
  variant: 'buttons.icon',
  display: 'inline-grid',
  '::after': {
    content: '""',
    bg: 'currentColor',
    mt: 1,
    height: 2,
    transition: 'transform 0.3s ease-in-out',
    transformOrigin: 'left',
    transform: 'scaleX(0)',
  },
  ':not(:disabled):hover::after': {
    transform: 'scaleX(1)',
  },
};

export const submit = {
  variant: 'buttons.inverted',
  border: 'none',
  '&:not(:disabled)hover': {
    bg: 'accentSecondary',
  },
};

export const tab = {
  px: 0,
  pt: 0,
  pb: 2,
  fontSize: 3,
  color: 'text',
  letterSpacing: 4,
  bg: 'transparent',
  fontWeight: 'book',
  borderRadius: 'square',
  fontFamily: 'button',
  cursor: 'pointer',
};

export const text = {
  cursor: 'pointer',
  bg: 'background',
  color: 'text',
  fontSize: 3,
  fontWeight: 500,
  m: 0,
  p: 0,
  border: 'none',
};

export const socialCarouselCardButton = {
  display: 'inline-block',
  p: 3,
  border: 'none',
  background: 'transparent',
  // match border color of social carousel card
  outlineColor: 'accent',
  cursor: 'pointer',
};

export const circle = {
  variant: 'buttons.icon',
  color: 'textInverted',
  bg: 'text',
  borderRadius: '50%',
  padding: 2,
  transition: 'background 0.3s ease-in-out',

  ':hover:not(:disabled)': {
    bg: 'accent',
  },

  '::before': {
    content: "''",
    width: '1px',
    marginLeft: '-1px',
    float: 'left',
    height: '0px',
    paddingTop: '100%',
  },
  '::after': {
    content: "''",
    display: 'table',
    clear: 'both',
  },
};

export const menuHeading = {
  variant: 'buttons.icon',
  color: 'text',
  fontSize: 5,
  textTransform: 'none',
  letterSpacing: 3,
  lineHeight: 1,
  fontWeight: 'medium',
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
};

export const underline = {
  variant: 'links.underline',
  bg: 'background',
  border: 'none',
  cursor: 'pointer',
  px: 0,
};

/** A button in an alphabetical or numeric group list. */
export const listGroupNav = {
  display: 'inline-block',
  bg: 'background',
  fontWeight: 'regular',
  fontSize: 1,
  py: 1,
  pl: 3,
  pr: 4,
  color: 'muted',
  textDecoration: 'none',

  '&:hover': {
    color: 'text',
    textDecoration: 'underline',
  },

  '&[data-active="true"]': {
    color: 'text',
  },
};
