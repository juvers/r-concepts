import Icon from "../components/icon";
import React from "react";

import DirectionArrayPreview from "../components/directionArrayPreview";

const directionItem = {
  name: "directionItem",
  type: "object",
  fields: [
    {
      name: "place",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "description",
      type: "simpleRichtext",
      validation: (Rule) => Rule.required(),
    },
  ],
};

const direction = {
  name: "direction",
  title: "direction",
  type: "object",
  icon: () => <Icon emoji="⁉️" />,
  preview: {
    select: {
      category: "category",
      directions: "directions",
    },
    component: DirectionArrayPreview,
  },
  fields: [
    {
      name: "category",
      title: "category",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "directions",
      title: "directions",
      type: "array",
      of: [directionItem],
    },
  ],
};
export { directionItem, direction };
