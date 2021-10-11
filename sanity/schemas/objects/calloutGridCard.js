export const calloutGridCard = {
  name: "calloutGridCard",
  title: "Callout Grid Card",
  type: "object",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "description",
      type: "string",
      title: "Description",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "image",
      type: "imageType",
      title: "Image",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "link",
      type: "urlType",
      title: "Link",
    },
  ],
};
