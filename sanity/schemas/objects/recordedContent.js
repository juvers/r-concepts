export const recordedItem = {
  name: "recordedItem",
  type: "object",
  fields: [
    {
      name: "title",
      type: "string",
    },
    {
      name: "subTitle",
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
    },
  },
};

export const recordedContent = {
  name: "recordedContent",
  type: "object",
  title: "Pre-recorded Content",
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
      name: "items",
      type: "array",
      title: "Items",
      of: [{ type: "recordedItem" }],
    },
  ],
};
