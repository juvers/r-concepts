import { MdQuestionAnswer } from "react-icons/md";
import { faqsField, seoField, galleryField } from "../fields";

export const generalFaqs = {
  name: "generalFaqs",
  title: "Faqs Landing page",
  type: "document",
  description: "General Faws",
  icon: MdQuestionAnswer,
  fields: [galleryField(), faqsField(), seoField()],
  preview: {
    prepare() {
      return {
        title: "General Faqs",
      };
    },
  },
};
