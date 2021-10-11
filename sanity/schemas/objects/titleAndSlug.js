export const titleAndSlug = {
  name: "titleAndSlug",
  title: "Title/Slug",
  type: "object",
  options: {
    collapsable: true,
    collapsed: true,
  },
  fields: [
    {
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required().max(255),
    },
    {
      name: "slug",
      type: "slug",
      validation: (Rule) => Rule.required(),
      options: {
        source: "titleAndSlug.title",
        maxLength: 200,
        auto: true,
      },
    },
  ],
};
