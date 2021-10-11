export const titlePlainBodyType = {
  name: "titlePlainBodyType",
  type: "object",
  options: {
    collapsible: true,
    collepsed: true,
  },
  fields: [
    {
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required().max(255),
    },
    {
      name: "bodyCopy",
      type: "text",
      validation: (Rule) => Rule.required(),
    },
  ],
};
