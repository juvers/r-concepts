export const flexSpace = {
  name: "flexSpace",
  type: "object",
  title: "Flex Space",
  fields: [
    {
      name: "bgImage",
      type: "imageType",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "spaceOne",
      type: "space",
      title: "Space One",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "spaceTwo",
      type: "space",
      title: "Space Two",
    },
  ],
};

export const space = {
  name: "space",
  title: "Space",
  type: "object",
  fields: [
    {
      name: "title",
      type: "string",
      validation: (Rule) => Rule.max(50),
    },
    {
      name: "description",
      type: "string",
      validation: (Rule) => Rule.max(75),
    },
    {
      name: "link",
      type: "urlType",
    },
  ],
};
