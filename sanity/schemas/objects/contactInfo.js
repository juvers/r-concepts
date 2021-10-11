import React from "react";
import Icon from "../components/icon";

const contactType = ["phone", "email"];

const contactInfo = {
  name: "contactInfo",
  type: "object",
  options: {
    collapsable: true,
    collapsed: true,
  },
  fields: [
    {
      name: "type",
      type: "string",
      options: {
        list: contactType,
      },
    },
    {
      name: "value",
      type: "string",
    },
  ],
  preview: {
    select: {
      type: "type",
      value: "value",
    },
    prepare({ type, value }) {
      return {
        media: () =>
          type == "phone" ? <Icon emoji="☎️" /> : <Icon emoji="📭" />,
        title: value,
      };
    },
  },
};

export { contactInfo };
