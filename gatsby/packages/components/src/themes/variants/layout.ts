export const container = {
  py: 0,
  px: [3, 4],
  mx: 'auto',
  maxWidth: 'container',
};

/**
 * An overlay container covers the viewport with a dark,
 * semi-transparent color, and blocks pointer events to that content,
 * while displaying its content on top of the background and
 * allowing its content to be interactive.
 */
export const overlay = {
  position: 'fixed',
  display: 'grid',
  placeItems: 'center center',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  bg: 'backgroundOverlay',
  zIndex: 'overlay',
  '> *': {
    // Allow user selection and pointer events on overlay contents.
    // This is often needed because most overlays will prevent these
    // interactions on the whole document. The assumption here is that
    // anything 'inside' the overlay is what should be interactive, and
    // anything 'outside' the overlay _may_ be noninteractive.
    userSelect: 'text',
    pointerEvents: 'auto',
  },
};
