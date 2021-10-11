import Icon from "../components/icon";
import React from "react";

import FaqArrayPreview from "../components/faqArrayPreview";

const faqItem = {
  name: "faqItem",
  type: "object",
  fields: [
    {
      name: "question",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "answer",
      type: "simpleRichtext",
      validation: (Rule) => Rule.required(),
    },
  ],
};

const faq = {
  name: "faq",
  title: "faq",
  type: "object",
  icon: () => <Icon emoji="⁉️" />,
  preview: {
    select: {
      category: "category",
      faqs: "faqs",
    },
    component: FaqArrayPreview,
  },
  fields: [
    {
      name: "category",
      title: "category",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "faqs",
      title: "faqs",
      type: "array",
      of: [faqItem],
    },
  ],
};
export { faqItem, faq };
