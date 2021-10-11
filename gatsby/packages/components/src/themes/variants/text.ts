export default {
  color: 'text',
  fontFamily: 'body',
  lineHeight: 'body',
  fontWeight: 'body',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
};

export const heading = {
  color: 'text',
  fontFamily: 'heading',
  lineHeight: 'heading',
  fontWeight: 'heading',
};

export const heroTitle = {
  // unused in Rink designs, but in RC
  variant: 'text.heading',
  fontSize: [6, 9],
  letterSpacing: 0,
};

export const heroTitleSmall = {
  // needs to be renamed, I don't see it in any designs
  variant: 'text.heading',
  fontSize: [6, 8],
  letterSpacing: 3,
};

export const mediumTitle = {
  variant: 'text.heading',
  fontSize: 6,
  letterSpacing: 0,
  fontFamily: 'headingSecondary',
};

export const smallTitle = {
  variant: 'text.heading',
  fontSize: 4,
  letterSpacing: 0,
  fontFamily: 'headingSecondary',
};

export const body = {
  variant: 'text.default',
};

export const largeP = {
  // rink hero caption block
  variant: 'text.body',
  fontSize: 4,
  letterSpacing: 1,
};

export const mediumP = {
  // rink directions/hours
  variant: 'text.body',
  fontSize: 3,
  letterSpacing: 1,
};

export const smallP = {
  // rink carousel caption
  variant: 'text.body',
  fontSize: 2,
  letterSpacing: 2,
};

export const copyright = {
  fontSize: [0, 1],
};

export const ticketPrice = {
  fontFamily: 'body',
  fontWeight: 'heading',
  fontSize: [3, null, 5],
  lineHeight: 1,
  letterSpacing: 1,
};

export const ticketPriceSmall = {
  fontFamily: 'body',
  fontWeight: 'body',
  fontSize: 1,
  lineHeight: 1,
  letterSpacing: 1,
};

export const eyebrow = {
  variant: 'text.body',
  fontSize: 2,
  letterSpacing: 3,
  fontWeight: 'medium',
  color: 'text',
  opacity: '0.75',
};

export const categoryEyebrow = {
  variant: 'text.eyebrow',
  mb: 3,
  fontSize: 3,
  fontWeight: 'regular',
  color: 'accentSecondary',
  opacity: '1',
};

export const eventListTitle = {
  variant: 'text.heading',
  fontSize: [4, 6],
  letterSpacing: 0,
};

export const featuredStoryEyebrow = {
  variant: 'text.eyebrow',
  fontFamily: 'headingSecondary',
  textTransform: 'uppercase',
  mb: [2, 3],
  fontSize: 1,
  letterSpacing: 5,
  color: 'accent',
  opacity: '1',
};

export const hoursAndDirections = {
  variant: 'text.body',
  fontSize: [2, 3],
  color: 'text',
};

/** Text that appears underneath the `MenuBar` Rock Center logo. */
export const rockCenterPageName = {
  variant: 'text.body',
  color: 'pageName',
  transition: 'color 0.7s ease-in-out',
  fontSize: [2, null, 3],
  fontWeight: 'medium',
  whiteSpace: 'nowrap',
  lineHeight: 1,
};

/** Text that appears underneath the `MenuBar` Rainbow Room logo. */
export const rainbowRoomPageName = {
  variant: 'text.rockCenterPageName',
  fontSize: [2, 3, 4, 5],
};

export const imageCalloutTitle = {
  variant: 'text.heading',
  fontSize: [5, 6, 7],
  fontFamily: 'headingSecondary',
  letterSpacing: 0,
  mb: [2, null, 3],
};

export const selectNavigationTitle = {
  //for select navigation
  variant: 'text.body',
  color: 'primary',
  fontSize: [2, 3],
};

export const faqItemTitle = {
  variant: 'styles.h3',
  fontFamily: 'headingSecondary',
  fontWeight: 'regular',
};

export const footerHeading = {
  variant: 'styles.h5',
  color: 'primary',
};

export const journeyToTheTopHeading = {
  variant: 'styles.h5',
  fontSize: 4,
  fontFamily: 'headingSecondary',
  fontWeight: 'regular',
  color: 'text',
};

export const leasingContactTitle = {
  fontSize: [4, 5],
  fontWeight: 'heading',
  lineHeight: 'heading',
};

export const storyAuthor = {
  variant: 'text.body',
  fontWeight: 'medium',
  fontSize: 1,
  letterSpacing: 5,
  color: 'accent',
  textAlign: 'center',
  textTransform: 'uppercase',
};

export const featuredEventMarquee = {
  variant: 'text.heading',
  writingMode: ['initial', null, null, 'vertical-lr'],
  textOrientation: ['initial', null, null, 'upright'],
  fontSize: [7, null, 10],
  letterSpacing: [20, 0],
  flex: [null, '1 0 auto'],
};

export const accessibilityHeading = {
  variant: 'text.heading',
  fontSize: [4, 6],
  fontFamily: 'headingSecondary',
};

export const menuHeading = {
  color: 'accent',
  fontWeight: 'medium',
  letterSpacing: 3,
  fontSize: 3,
  lineHeight: 'menuItem',
  whiteSpace: 'nowrap',
};

export const ticketButtonLabel = {
  mx: 2,
};

export const search = {
  '& > b': {
    fontWeight: 'medium',
  },
  '& > br': {
    display: 'none',
  },
};

export const largePrivateEventSpec = {
  variant: 'text.heroTitleSmall',
  lineHeight: 'body',
  fontFamily: 'headingSecondary',
  fontSize: 8,
};

export const mediumPrivateEventSpec = {
  variant: 'text.heading',
  fontSize: 7,
  letterSpacing: 3,
  lineHeight: 'body',
  fontFamily: 'headingSecondary',
};

export const smallPrivateEventSpec = {
  variant: 'text.heading',
  fontSize: [5, 6],
  letterSpacing: 3,
  lineHeight: 'body',
  fontFamily: 'headingSecondary',
};

export const formError = {
  variant: 'text.mediumP',
  color: 'error',
  fontStyle: 'italic',
};

export const introTextHeading = {
  variant: 'text.heading',
  fontFamily: 'headingSecondary',
  fontSize: [6, 9],
};

export const executiveTitle = {
  opacity: 0.5,
  fontSize: 3,
};

/** A text entry in an alphabetical or numeric group list. */
export const groupList = {
  variant: 'text.default',
  display: 'inline-block',
  fontWeight: 'book',
  fontSize: 1,
  py: 1,
  pl: 3,
  pr: 4,
  color: 'textDisabled',
};

export const storyDate = {
  fontFamily: 'headingSecondary',
  fontWeight: 'medium',
  my: 3,
  textTransform: 'uppercase',
  fontSize: [0, 1],
  letterSpacing: 5,
  color: 'text',
};

export const ticketsHeading = {
  variant: 'text.heading',
  fontFamily: 'headingSecondary',
  fontSize: [6, 7],
};

export const ticketsPriceSticky = {
  variant: 'text.heading',
  fontFamily: 'headingSecondary',
  fontSize: 5,
};

export const ticketsPriceSmall = {
  variant: 'text.heading',
  fontFamily: 'headingSecondary',
  fontSize: [1, 3],
};

export const taxHeading = {
  variant: 'text.body',
  fontWeight: 'medium',
  fontSize: 3,
};

export const taxHeadingSticky = {
  variant: 'text.body',
  fontWeight: 'medium',
  fontSize: 1,
};

export const buyTicketsBarTitle = {
  variant: 'text.mediumTitle',
  fontSize: [3, 6],
};

export const buyTicketsConfirmationTitle = {
  variant: 'text.mediumTitle',
  fontSize: [6, 8],
};
