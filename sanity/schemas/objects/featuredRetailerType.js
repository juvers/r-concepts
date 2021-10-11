export const featuredRetailerType = {
  name: "featuredRetailerType",
  type: "object",
  fields: [
    {
      name: "eyebrow",
      type: "string",
      validation: (Rule) => Rule.required().max(30),
    },
    {
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required().max(255),
    },
    {
      name: "link",
      type: "urlType",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "poster",
      type: "imageType",
      validation: (Rule) => Rule.required(),
    },
  ],
};

export const featuredRetailer = {
  name: "featuredRetailer",
  type: "object",
  description: "Add 2 Featured Retailers",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Section Title",
    },
    {
      name: "retailers",
      type: "array",
      of: [{ type: "featuredRetailerType" }],
      validation: (Rule) => Rule.max(2),
    },
  ],
};
