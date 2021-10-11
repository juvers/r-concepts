import { format } from "date-fns";
import { eventIcon } from "../../components/icon";
import {
  titleAndSlugField,
  featuredField,
  startEndDateTimeField,
  locationField,
  imageField,
  fullRichtextField,
  simpleRichtextField,
  imageGalleryField,
  featuredEventsField,
  podcastField,
  seoField,
  textField,
  selectField,
  sponsorField,
  featuredStoriesField,
  contactsField,
  hourField,
  faqsField,
  liveEventsField,
  recordedContentField,
  alertField,
  showAddToCalendarField,
  eventsCTAField,
} from "../../fields";

const eventAdmissionTypes = [
  "Free and open to the public",
  "Free - signup required",
  "registration",
  "Ticketed event",
  "Open to the public",
  "Free with Top of the Rock purchase",
];

const eventCategories = [
  "Special Events",
  "Culture & Entertainment",
  "Public Art",
  "Style",
  "Food & Drink",
  "Shopping",
  "Family Friendly",
];

const event = {
  name: "event",
  type: "document",
  title: "Event",
  icon: eventIcon,
  initialValue: {
    showAddToCalendar: true,
  },
  fields: [
    titleAndSlugField(),
    startEndDateTimeField(),
    selectField("admissionType", eventAdmissionTypes),
    selectField("category", eventCategories),
    locationField(),
    imageField(),
    textField(),
    fullRichtextField(),
    imageGalleryField(),
    showAddToCalendarField(),
    eventsCTAField(),
    featuredEventsField(),
    podcastField(),
    sponsorField(),
    seoField(),
  ],
  preview: {
    select: {
      title: "titleAndSlug.title",
      subtitle: "slug.current",
      description: "slug.current",
      startDateTime: "startEndDateTime.startDateTime",
      entDateTime: "startEndDateTime.endDateTime",
      media: "photo",
    },
    prepare(selection) {
      const { startDateTime } = selection;
      const dateFormat = "h:mm aaaa 'on' L.d.yy ";
      return Object.assign({}, selection, {
        subtitle: format(
          new Date(startDateTime.replace(".000Z", "")),
          dateFormat
        ),
      });
    },
  },
  orderings: [
    {
      title: "Start Date, New",
      name: "startDateDesc",
      by: [{ field: "startEndDateTime.startDateTime", direction: "desc" }],
    },
    {
      title: "Start Date, Old",
      name: "startDateAsc",
      by: [{ field: "startEndDateTime.startDateTime", direction: "asc" }],
    },
  ],
};

const treeLightingEvent = {
  name: "event.treeLighting",
  type: "document",
  title: "Event TreeLight",
  icon: eventIcon,
  initialValue: {
    showAddToCalendar: true,
  },
  fields: [
    titleAndSlugField(),
    startEndDateTimeField(),
    selectField("admissionType", eventAdmissionTypes),
    selectField("category", eventCategories),
    textField(),
    imageField(),
    simpleRichtextField(),
    locationField(),
    contactsField(),
    hourField(),
    textField("broadcastInfo"),
    faqsField(),
    imageGalleryField(),
    showAddToCalendarField(),
    eventsCTAField(),
    featuredStoriesField(),
    seoField(),
  ],
  preview: {
    select: {
      title: "titleAndSlug.title",
      subtitle: "slug.current",
      description: "slug.current",
      startDateTime: "startEndDateTime.startDateTime",
      entDateTime: "startEndDateTime.endDateTime",
      media: "photo",
    },
    prepare(selection) {
      const { startDateTime, entDateTime } = selection;
      const dateFormat = "h:mm aaaa 'on' L.d.yy ";
      return Object.assign({}, selection, {
        subtitle: format(new Date(startDateTime), dateFormat),
      });
    },
  },
  orderings: [
    {
      title: "Start Date, New",
      name: "startDateDesc",
      by: [{ field: "startEndDateTime.startDateTime", direction: "desc" }],
    },
    {
      title: "Start Date, Old",
      name: "startDateAsc",
      by: [{ field: "startEndDateTime.startDateTime", direction: "asc" }],
    },
  ],
};

const subnavItem = {
  name: "subnavItem",
  type: "object",
  fields: [
    {
      name: "label",
      type: "string",
      title: "Item Text",
      description: "The visible text for the nav item",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      type: "slug",
      title: "Anchor Slug",
      description:
        "The hash value that will be appended to the end of the page url, i.e. #live-events",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "targetSection",
      type: "string",
      title: "Target Section",
      description: "The section on the page that this link should link to",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          {
            title: "Event Details",
            value: "details",
          },
          {
            title: "Live Events",
            value: "live-events",
          },
          {
            title: "Recorded Events",
            value: "recorded-events",
          },
        ],
      },
    },
  ],
  preview: {
    select: {
      title: "label",
    },
  },
};

const virtualEvent = {
  name: "event.virtual",
  type: "document",
  title: "Event Virtual",
  icon: eventIcon,
  initialValue: {
    showAddToCalendar: true,
  },
  fields: [
    alertField(false),
    titleAndSlugField(),
    {
      type: "array",
      name: "subnavItems",
      title: "Subnav Items",
      description: "Items for the page's sub navigation",
      options: {
        sotrable: true,
      },
      of: [{ type: "subnavItem" }],
    },
    startEndDateTimeField(),
    selectField("admissionType", eventAdmissionTypes),
    selectField("category", eventCategories),
    textField(),
    imageField(),
    simpleRichtextField(),
    locationField(),
    contactsField(),
    hourField(),
    faqsField(),
    imageGalleryField(),
    showAddToCalendarField(),
    eventsCTAField(),
    featuredStoriesField(),
    liveEventsField(),
    recordedContentField(),
    seoField(),
  ],
  preview: {
    select: {
      title: "titleAndSlug.title",
      subtitle: "slug.current",
      description: "slug.current",
      startDateTime: "startEndDateTime.startDateTime",
      entDateTime: "startEndDateTime.endDateTime",
      media: "photo",
    },
    prepare(selection) {
      const { startDateTime, entDateTime } = selection;
      const dateFormat = "h:mm aaaa 'on' L.d.yy ";
      return Object.assign({}, selection, {
        subtitle: format(
          new Date(startDateTime.replace(".000Z", "")),
          dateFormat
        ),
      });
    },
  },
  orderings: [
    {
      title: "Start Date, New",
      name: "startDateDesc",
      by: [{ field: "startEndDateTime.startDateTime", direction: "desc" }],
    },
    {
      title: "Start Date, Old",
      name: "startDateAsc",
      by: [{ field: "startEndDateTime.startDateTime", direction: "asc" }],
    },
  ],
};
export {
  eventAdmissionTypes,
  eventCategories,
  event,
  treeLightingEvent,
  virtualEvent,
  subnavItem,
};
