export const fullWidthCalloutGridCard = {
  name: "fullWidthCalloutGridCard",
  title: "Full Width Callout Grid Card",
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
      type: "imageTypeSide",
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
