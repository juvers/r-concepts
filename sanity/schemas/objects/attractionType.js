export const attractionType = {
  name: "attractionType",
  type: "object",
  title: "Only Here Attraction",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Attraction Title",
    },
    {
      name: "image",
      type: "imageType",
    },
    {
      name: "link",
      type: "linkType",
      title: "Page link",
      validation: (Rule) => Rule.required(),
    },
  ],
};

export const linkType = {
  name: "linkType",
  title: "Link",
  type: "object",
  fields: [
    {
      name: "url",
      type: "url",
      validation: (Rule) =>
        Rule.uri({
          relativeOnly: true,
        }),
    },
    {
      name: "label",
      type: "string",
    },
  ],
};

export const onlyHere = {
  name: "onlyHere",
  type: "object",
  fields: [
    {
      name: "sectionCaption",
      type: "string",
      title: "Section Caption",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "attractionList",
      type: "array",
      of: [{ type: "attractionType" }],
      validation: (Rule) => Rule.required().unique(),
    },
  ],
};
