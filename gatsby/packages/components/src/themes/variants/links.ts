import {keyframes} from '@emotion/core';

export const text = {
  color: 'primary',
  fontSize: 1,
  textDecoration: 'underline',
  '&:hover': {
    color: 'secondary',
    textDecoration: 'underline',
  },
};

export const footer = {
  variant: 'links.nav',
  fontSize: 2,
  textTransform: 'none',
  letterSpacing: 3,
  ':after': {
    content: '""',
    position: 'absolute',
    backgroundColor: 'text',
    height: 2,
    left: 0,
    bottom: -1,
    right: 0,
    display: 'block',
    transition: 'transform 0.5s',
    opacity: 0,
    transform: 'scale(0)',
    transformOrigin: 'left',
  },
  '&.active:after': {
    opacity: 1,
    transform: 'scale(1)',
  },
  '&:hover:after': {
    opacity: 1,
    transform: 'scale(1)',
  },
};

export const footerButton = {
  bg: 'text',
  color: 'background',
  fontSize: 2,
  borderRadius: 'square',
  border: `1px solid`,
  borderColor: 'background',
  letterSpacing: 5,
  p: [3, 24],
  textTransform: 'uppercase',
  textDecoration: 'none',
  textAlign: 'center',
  fontWeight: 'medium',
  flexShrink: 0,
  transition: 'color 0.3s ease-in-out, background-color 0.3s ease-in-out',
  minWidth: ['100%', '221px'],
  display: 'block',

  '&:hover': {
    bg: 'primary',
  },
};

export const nav = {
  color: 'text',
  fontSize: 1,
  letterSpacing: 5,
  textTransform: 'uppercase',
  textDecoration: 'none',
  position: 'relative',
  ':after': {
    content: '""',
    position: 'absolute',
    backgroundColor: 'text',
    height: '2px',
    left: 0,
    bottom: '-3px',
    right: 0,
    display: 'block',
    transition: 'transform 0.5s',
    opacity: 0,
    transform: 'scaleX(0)',
    transformOrigin: 'left',
  },
  '&.active:after': {
    opacity: 1,
    transform: 'scaleX(1)',
  },
  '&:hover:after': {
    opacity: 1,
    transform: 'scaleX(1)',
  },
};

export const button = {
  bg: 'text',
  color: 'background',
  fontSize: 1,
  borderRadius: 'square',
  letterSpacing: 4,
  fontWeight: 'medium',
  px: 5,
  py: '24px',
  textTransform: 'uppercase',
  textDecoration: 'none',
  transition: 'color 0.3s ease-in-out, background-color 0.3s ease-in-out',

  '&:hover': {
    bg: 'accent',
    color: 'text',
  },
};

export const buttonBorder = {
  variant: 'links.button',
  bg: 'background',
  border: '1px solid',
  borderColor: 'text',
  color: 'text',
};

export const buttonInverted = {
  variant: 'links.button',
  bg: 'text',
  borderColor: 'text',
  color: 'background',
  '&:hover': {
    bg: 'accent',
    color: 'text',
  },
};

export const arrow = {
  display: 'inline-flex',
  alignItems: 'center',
  color: 'text',
  fontSize: 3,
  letterSpacing: 1,
  textDecoration: 'none',
  position: 'relative',
  svg: {
    ml: 2,
    transition: 'transform 0.3s ease-in-out',
    color: 'text',
  },
  '&:hover svg': {
    transform: 'translateX(5px)',
  },
};

export const backArrow = {
  variant: 'links.arrow',
  flexDirection: 'row-reverse',
  letterSpacing: 5,
  fontWeight: 'regular',
  svg: {
    ml: 'inherit',
    mr: 2,
    transform: 'rotate(180deg)',
    transition: 'transform 0.3s ease-in-out',
  },
  '&:hover svg': {
    transform: 'rotate(180deg) translateX(5px)',
  },
};

export const upArrow = {
  variant: 'links.arrow',
  fontWeight: 'regular',
  fontSize: 1,
  letterSpacing: 5,
  textTransform: 'uppercase',
  svg: {
    ml: 2,
    mt: -1,
    transform: 'rotate(-90deg)',
    transition: 'transform 0.3s ease-in-out',
  },
  '&:hover svg': {
    transform: 'rotate(-90deg) translateX(5px)',
  },
};

export const upArrowCompressed = {
  variant: 'links.upArrow',
  textTransform: 'none',
  fontSize: 0,
  letterSpacing: 3,
};

export const underline = {
  color: 'text',
  fontSize: 1,
  letterSpacing: 5,
  textDecoration: 'none',
  textTransform: 'uppercase',
  position: 'relative',
  fontWeight: 'regular',
  py: 2,
  '::after': {
    content: '""',
    position: 'absolute',
    backgroundColor: 'text',
    height: 2,
    left: 0,
    bottom: 0,
    right: 0,
    display: 'block',
  },
  '&:hover::after': {
    // Underline hover animation
    animation: `${keyframes`
          0% {
            transform-origin: right;
            transform: scaleX(1);
          }
          40% {
            transform-origin: right;
            transform: scaleX(0);
          }
          60% {
            transform-origin: left;
            transform: scaleX(0);
          }

          100% {
            transform-origin: left;
            transform: scaleX(1);
          }
        `} 0.6s ease-in-out`,
  },
};

export const card = {
  fontWeight: 'heading',
  lineHeight: 'heading',
  letterSpacing: 1,
  fontSize: 5,
  color: 'text',

  textDecoration: 'none',

  '&:hover': {
    textDecoration: 'underline',
  },
};

export const eventTitle = {
  variant: 'text.mediumTitle',
  textDecoration: 'none',
  '&:hover': {
    color: 'accent',
    textDecoration: 'none',
  },
};

export const menu = {
  variant: 'links.nav',
  letterSpacing: 3,
  textTransform: 'none',
  fontSize: 3,
  fontWeight: 'medium',
  whiteSpace: 'nowrap',
};

export const menuSecondary = {
  variant: 'links.nav',
  fontWeight: 'medium',
  whiteSpace: 'nowrap',
};

export const menuSecondaryCompressed = {
  variant: 'links.menuSecondary',
  fontWeight: ['regular', null, 'medium'],
  textTransform: ['none', null, 'uppercase'],
  fontSize: [2, null, 1],
  letterSpacing: [3, null, 5],

  '&.active:after': {
    opacity: [0, null, 1],
    transform: ['scaleX(0)', null, 'scaleX(1)'],
  },
};

export const searchResultLink = {
  variant: 'links.nav',
  color: 'primary',
  letterSpacing: 3,
  fontSize: 3,
  fontWeight: 'regular',
  textTransform: 'none',

  '::after': {
    content: '""',
    position: 'absolute',
    backgroundColor: 'primary',
    height: 1,
    left: 0,
    bottom: 0,
    right: 0,
    display: 'block',
  },
};

export const icon = {
  variant: 'buttons.icon',
};

export const inline = {
  color: 'text',
  textDecoration: 'underline',
  fontSize: 'inherit',
  '&:hover': {
    color: 'primary',
    textDecoration: 'underline',
  },
};
