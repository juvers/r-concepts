export const locationField = () => ({
  name: "location",
  type: "reference",
  to: [{ type: "location" }],
  validation: (Rule) => Rule.required(),
});

export const faqsField = () => ({
  name: "faqs",
  title: "Faqs",
  type: "array",
  of: [{ type: "faq" }],
  validation: (Rule) => Rule.required(),
  options: {
    editModal: "fullscreen",
  },
});

export const directionsField = () => ({
  name: "directions",
  title: "Directions",
  type: "array",
  of: [{ type: "direction" }],
  validation: (Rule) => Rule.required(),
  options: {
    editModal: "fullscreen",
  },
});

export const titleField = () => ({
  name: "title",
  title: "Title",
  type: "string",
  validation: (Rule) => Rule.required().max(255),
});

export const stringField = (name = "input", required = true) => ({
  name: name,
  title: name,
  type: "string",
  validation: required ? (Rule) => Rule.required() : null,
});

export const titleAndSlugField = () => ({
  name: "titleAndSlug",
  title: "Title/Slug",
  type: "titleAndSlug",
  validation: (Rule) => Rule.required(),
});

export const heroCTAField = () => ({
  name: "heroCTA",
  type: "titlePlainBodyType",
  validation: (Rule) => Rule.required(),
});

export const imageField = (name = "photo", required = true) => ({
  name: name,
  type: "imageType",
  validation: required ? (Rule) => Rule.required() : null,
});

export const contactsField = () => ({
  name: "contactsInfo",
  type: "array",
  of: [{ type: "contactInfo" }],
  validation: (Rule) => Rule.required().unique(),
});

export const featuredField = () => ({
  name: "featured",
  type: "boolean",
  validation: (Rule) => Rule.required(),
});

export const startEndDateTimeField = () => ({
  name: "startEndDateTime",
  type: "startEndDateTime",
  validation: (Rule) => Rule.required(),
});

export const hourField = () => ({
  name: "hour",
  type: "hoursAndtext",
});

export const hoursField = () => ({
  name: "hours",
  type: "array",
  of: [{ type: "dayAndTime" }],
  validation: (Rule) => Rule.required(),
});
export const textField = (name = "excerpt") => ({
  name: name,
  type: "text",
  validation: (Rule) => Rule.required(),
});
export const simpleRichtextField = (name = "body") => ({
  name: name,
  type: "simpleRichtext",
  validation: (Rule) => Rule.required(),
});

export const fullRichtextField = () => ({
  name: "body",
  type: "fullRichtext",
});

export const maxRichtextField = () => ({
  name: "body",
  type: "maxRichtext",
});

export const galleryField = (name = "gallery") => ({
  name: name,
  type: "gallery",
  validation: (Rule) => Rule.required(),
});

export const imageGalleryField = () => ({
  name: "imageGallery",
  type: "imageGallery",
});
export const podcastField = () => ({
  name: "podcast",
  type: "reference",
  to: [{ type: "podcast" }],
});

export const podcastsField = () => ({
  name: "podcasts",
  type: "array",
  of: [{ type: "reference", to: [{ type: "podcast" }] }],
});

export const seoField = () => ({
  name: "seo",
  type: "metaSEO",
  title: "Seo",
});

export const featuredEventsField = () => ({
  name: "featuredEvents",
  type: "array",
  description: "Max 4 event items",
  of: [
    {
      type: "reference",
      to: [
        { type: "event" },
        { type: "event.treeLighting" },
        { type: "event.virtual" },
      ],
    },
  ],
  validation: (Rule) => Rule.max(4),
});

export const featuredStoryField = () => ({
  name: "featuredStory",
  description: "A featured story",
  type: "reference",
  to: [{ type: "story" }],
  validation: (Rule) => Rule.required(),
});

export const featuredStoriesField = () => ({
  name: "featuredStories",
  type: "array",
  description: "Max 4 story items",
  of: [{ type: "reference", to: [{ type: "story" }] }],
  validation: (Rule) => Rule.max(4),
});

export const featuredRetailerField = () => ({
  name: "featuredRetailers",
  type: "featuredRetailer",
  title: "Featured Retailers",
});

export const publishAtField = () => ({
  name: "publishAt",
  title: "Publish at",
  type: "datetime",
  description: "Story goes live at this date/time",
  validation: (Rule) => Rule.required(),
  options: {
    dateFormat: "YYYY-MM-DD",
    timeFormat: "HH:mm",
    timeStep: 60,
    calendarTodayLabel: "Today",
  },
});

export const stringArrayField = (name = "stringArray", required = true) => ({
  name: name,
  type: "array",
  of: [{ type: "string" }],
  validation: required ? (Rule) => Rule.required().min(1) : null,
});

export const externalLinkField = (name = "externalLink", required = true) => ({
  name: name,
  type: "urlType",
  validation: required ? (Rule) => Rule.required() : null,
});

export const externalLinksField = (name = "externalLinks") => ({
  name: name,
  type: "array",
  of: [{ type: "urlType" }, { type: "fileType" }],
  validation: (Rule) => Rule.max(1),
});

export const selectField = (name, items = []) => ({
  name: name,
  type: "string",
  validation: (Rule) => Rule.required(),
  options: {
    list: items,
  },
});

export const tripadvisorReviewsField = () => ({
  name: "tripadvisorsReview",
  type: "array",
  of: [{ type: "tripadvisorReview" }],
});

export const featuredNewsPressField = () => ({
  name: "featuredNewsPress",
  title: "Featured News Press",
  type: "array",
  of: [{ type: "newsPress" }],
});

export const floorplanField = () => ({
  name: "floorPlan",
  title: "Floor Plan",
  type: "floorPlan",
});

export const sampleMenuField = () => ({
  name: "sampleMenu",
  title: "Sample Menu",
  type: "sampleMenu",
});

export const reservationField = () => ({
  name: "reservation",
  title: "Reservation",
  type: "reservation",
});

export const vendorField = () => ({
  name: "vendor",
  title: "Vendor",
  type: "vendor",
});

export const hiddenSortOrderField = (overrides = {}) => ({
  name: "order",
  title: "Sort Order",
  type: "number",
  hidden: true,
  ...overrides,
});

exports.sponsorField = () => ({
  name: "sponsor",
  type: "sponsor",
});

export const mapIdField = () => ({
  name: "mapId",
  title: "Map Id",
  type: "string",
  description:
    "ID provided by Tishman used to map business data to interactive map position on direction page",
});

export const onlyHereField = () => ({
  name: "OnlyHereAttractions",
  title: "Only Here Attractions",
  type: "onlyHere",
  validation: (Rule) => Rule.required(),
});

export const flexSpaceField = () => ({
  name: "flexSpaceField",
  title: "Flex Space",
  type: "flexSpace",
});

export const alertField = (required = true) => ({
  name: "alert",
  type: "alert",
  validation: (Rule) => {
    return Rule.custom((fields) => {
      if (!required) return true;
      if (!fields)
        return {
          message: "An alert title is required",
          paths: ["title"],
        };
      if (!fields.title) {
        return {
          message: "An alert title is required",
          paths: ["title"],
        };
      }
      if (!fields.description) {
        return {
          message: "An alert description is required",
          paths: ["description"],
        };
      }
      return true;
    });
  },
});

export const liveEventsField = () => ({
  name: "liveEvents",
  type: "liveEvents",
});

export const recordedContentField = () => ({
  name: "recordedContent",
  type: "recordedContent",
});

export const showAddToCalendarField = () => ({
  name: "showAddToCalendar",
  title: "Show Add to Calendar button",
  type: "boolean",
  description: "A boolean field to hide and show `Add to Calendar Button`",
});

export const eventsCTAField = () => ({
  name: "eventsCTA",
  title: "Event CTA",
  type: "eventCtaUrlType",
  description: "Secondary CTA for event detail and list pages",
});

export const retailersField = () => ({
  name: "retailers",
  type: "array",
  title: "Retailers",
  of: [{ type: "reference", to: [{ type: "business" }] }],
  validation: (Rule) => Rule.required(),
});

export const featuredOfferTitleField = () => ({
  name: "FeaturedOfferTitle",
  type: "string",
  validation: (Rule) => Rule.max(255),
});

export const featuredOfferField = () => ({
  name: "featuredOffer",
  type: "reference",
  to: [{ type: "offer" }],
});

export const FeaturedOfferLocationField = () => ({
  name: "OfferLocation",
  type: "reference",
  description:
    "Location not required with offers that contain single retailer!",
  to: [{ type: "location" }],
  validation: (Rule) =>
    Rule.custom((locations, context) => {
      if (context.document.retailers) {
        return context.document.retailers.length <= 1
          ? true
          : locations
          ? true
          : "Location is required for offers that contain more than 1 retailers!";
      } else return true;
    }),
});

export const offersField = () => ({
  name: "offers",
  type: "array",
  of: [{ type: "reference", to: [{ type: "offer" }] }],
  validation: (Rule) =>
    Rule.custom((offers, context) => {
      if (context.document.featuredOffer) {
        const offerUsedInFeatured = offers.map((offer, index) => {
          if (offer._ref === context.document.featuredOffer._ref) return false;
          return true;
        });

        return offerUsedInFeatured.every((offer) => offer === true)
          ? true
          : "Offer No." +
              (offerUsedInFeatured.indexOf(false) + 1) +
              " is already added in Featured Offer";
      } else return true;
    }),
});

export const offerImageField = () => ({
  name: "OfferImage",
  description: "Required in case of multiple retailers or featured offer!",
  type: "imageType",
  validation: (Rule) =>
    Rule.custom((images, context) => {
      if (context.document.retailers) {
        return context.document.retailers.length <= 1
          ? true
          : images
          ? true
          : "Image is required for offers that contain more than 1 retailers!";
      } else return true;
    }),
});
export const ctaCrads = () => ({
  name: "ctaCards",
  title: "CTA Cards",
  type: "array",
  of: [{ type: "ctaCard" }],
});

export const ctaCard = () => ({
  name: "ctaCard",
  title: "CTA Card",
  type: "ctaCard",
});

export const calloutGridCardsField = (index = "") => ({
  name: `calloutGridCards${index}`,
  description: `Callout Grid Cards ${index}`,
  type: "array",
  of: [{ type: "calloutGridCard" }],
});

export const fullWidthCalloutGridCardField = (index = "") => ({
  name: `calloutGridCardFullWidth${index}`,
  description: `Full Width Grid Card${index}`,
  type: "fullWidthCalloutGridCard",
});
