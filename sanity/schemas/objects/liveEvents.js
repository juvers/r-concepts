export const liveEventCard = {
  name: "liveEventCard",
  type: "object",
  fields: [
    {
      name: "poster",
      type: "imageType",
    },
    {
      name: "title",
      type: "string",
    },
    {
      name: "subTitle",
      type: "string",
    },
    {
      name: "moreInfo",
      type: "string",
    },
    {
      name: "link",
      type: "urlType",
    },
  ],
  preview: {
    select: {
      title: "title",
      media: "poster",
    },
  },
};

export const liveEvents = {
  name: "liveEvents",
  type: "object",
  title: "Live Events",
  options: {
    collapsed: true,
    collapsible: true,
  },
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
    },
    {
      name: "subTitle",
      type: "string",
      title: "Sub Title",
    },
    {
      name: "items",
      type: "array",
      title: "Items",
      of: [{ type: "liveEventCard" }],
    },
  ],
};
