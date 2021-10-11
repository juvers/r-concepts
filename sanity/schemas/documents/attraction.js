import { attractionIcon } from "../components/icon";
import {
  locationField,
  faqsField,
  heroCTAField,
  contactsField,
  featuredEventsField,
  imageGalleryField,
  galleryField,
  seoField,
  tripadvisorReviewsField,
  featuredStoriesField,
  featuredNewsPressField,
  floorplanField,
  sampleMenuField,
  vendorField,
  hourField,
  alertField,
  calloutGridCardsField,
  fullWidthCalloutGridCardField,
} from "../fields";

export const attractionWedding = {
  name: "attraction.wedding",
  type: "document",
  title: "attraction",
  icon: attractionIcon,
  preview: {
    prepare() {
      return {
        title: "wedding",
      };
    },
  },
  fields: [
    galleryField(),
    heroCTAField(),
    featuredStoriesField(),
    featuredNewsPressField(),
    seoField(),
  ],
};
export const attractionEvent = {
  name: "attraction.event",
  type: "document",
  title: "attraction",
  icon: attractionIcon,
  preview: {
    prepare() {
      return {
        title: "Private event",
      };
    },
  },
  fields: [galleryField(), heroCTAField(), featuredStoriesField(), seoField()],
};
export const attractionEventVenue = {
  name: "attraction.event.venue",
  type: "document",
  title: "Private event venue",
  icon: attractionIcon,
  fields: [
    imageGalleryField(),
    sampleMenuField(),
    vendorField(),
    floorplanField(),
  ],
};

export const attractionRc = {
  name: "attraction.rc",
  type: "document",
  title: "attraction",
  icon: attractionIcon,
  preview: {
    prepare() {
      return {
        title: "RC Tour",
      };
    },
  },
  fields: [
    alertField(true),
    galleryField(),
    heroCTAField(),
    locationField(),
    contactsField(),
    hourField(),
    faqsField(),
    seoField(),
  ],
};
export const attractionRainbow = {
  name: "attraction.rainbow",
  type: "document",
  title: "attraction",
  icon: attractionIcon,
  preview: {
    prepare() {
      return {
        title: "Rainbow Room",
      };
    },
  },
  fields: [
    alertField(true),
    galleryField(),
    heroCTAField(),
    locationField(),
    contactsField(),
    faqsField(),
    featuredEventsField(),
    featuredNewsPressField(),
    seoField(),
  ],
};
export const attractionBar = {
  name: "attraction.bar",
  type: "document",
  title: "attraction",
  icon: attractionIcon,
  preview: {
    prepare() {
      return {
        title: "Bar 65",
      };
    },
  },
  fields: [
    alertField(true),
    galleryField(),
    heroCTAField(),
    locationField(),
    contactsField(),
    hourField(),
    faqsField(),
    featuredEventsField(),
    featuredStoriesField(),
    featuredNewsPressField(),
    seoField(),
  ],
};
export const attractionHoliday = {
  name: "attraction.holiday",
  type: "document",
  title: "attraction",
  icon: attractionIcon,
  preview: {
    prepare() {
      return {
        title: "The Christmas Tree Lighting",
      };
    },
  },
  fields: [
    galleryField(),
    heroCTAField(),
    locationField(),
    contactsField(),
    hourField(),
    faqsField(),
    featuredEventsField(),
    featuredStoriesField(),
    featuredNewsPressField(),
    seoField(),
  ],
};

export const attractionTor = {
  name: "attraction.tor",
  type: "document",
  title: "attraction",
  icon: attractionIcon,
  preview: {
    prepare() {
      return {
        title: "Top of the Rock",
      };
    },
  },
  fields: [
    alertField(true),
    galleryField(),
    heroCTAField(),
    locationField(),
    contactsField(),
    hourField(),
    faqsField(),
    featuredEventsField(),
    tripadvisorReviewsField(),
    seoField(),
  ],
};

export const attractionRink = {
  name: "attraction.rink",
  type: "document",
  title: "attraction",
  icon: attractionIcon,
  preview: {
    prepare() {
      return {
        title: "The Rink",
      };
    },
  },
  fields: [
    alertField(true),
    galleryField(),
    heroCTAField(),
    locationField(),
    contactsField(),
    hourField(),
    faqsField(),
    featuredEventsField(),
    seoField(),
  ],
};

export const attractionOnlyHere = {
  name: "attraction.onlyHere",
  type: "document",
  title: "Only Here",
  icon: attractionIcon,
  preview: {
    prepare() {
      return {
        title: "Only Here",
      };
    },
  },
  fields: [
    heroCTAField(),
    fullWidthCalloutGridCardField("1"),
    calloutGridCardsField("1"),
    fullWidthCalloutGridCardField("2"),
    calloutGridCardsField("2"),
    fullWidthCalloutGridCardField("3"),
    calloutGridCardsField("3"),
    seoField(),
  ],
};

const attraction = {
  name: "attraction",
  type: "document",
  title: "attraction",
  icon: attractionIcon,
  fields: [
    galleryField(),
    heroCTAField(),
    locationField(),
    contactsField(),
    hourField(),
    faqsField(),
    featuredEventsField(),
  ],
  validation: (Rule) =>
    Rule.custom((document) => {
      // only one can be true
      const fields = [
        document.hasOwnProperty("poster"),
        document.hasOwnProperty("imageGallery")
          ? document["imageGallery"].hasOwnProperty("images")
          : false,
      ];
      return fields.filter((field) => field === true).length === 1
        ? true
        : "Poster or Image Gallery is required";
    }),
};

export { attraction };
