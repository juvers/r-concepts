import Icon from "../components/icon";
import React from "react";

const QuotePreviewCompoenent = ({ value }) => {
  const { body, author } = value;
  return (
    <div>
      <Icon emoji="❝" />
      {body}
      <Icon emoji="❞" />-{author}
    </div>
  );
};

const quote = {
  name: "quote",
  type: "object",
  description: "Add a quote",
  icon: () => <Icon emoji="❝" />,
  preview: {
    select: {
      body: "body",
      author: "author",
    },
    component: QuotePreviewCompoenent,
  },
  fields: [
    {
      name: "body",
      type: "string",
      validation: (Rule) => Rule.required().max(255),
    },
    {
      name: "author",
      type: "string",
      validation: (Rule) => Rule.required().max(255),
    },
  ],
};

export { quote };
