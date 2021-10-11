import { documentTypes } from "../documentTypes";

export const cta = {
  name: "cta",
  title: "cta",
  type: "object",
  preview: {},
  fields: [
    {
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required().max(25),
    },
    {
      name: "page",
      type: "reference",
      to: [...documentTypes],
    },
  ],
};

export const ctaCard = {
  name: "ctaCard",
  type: "object",
  fields: [
    {
      name: "photo",
      type: "imageType",
    },
    {
      name: "title",
      type: "string",
      // validation: (Rule) => Rule.required().max(255),
    },
    {
      name: "description",
      type: "string",
      // validation: (Rule) => Rule.required().max(255),
    },
    {
      name: "link1",
      type: "urlType",
    },
    {
      name: "link2",
      type: "urlType",
    },
  ],
};
