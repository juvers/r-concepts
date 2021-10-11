import { featuredEventsField, seoField } from "../../fields";
import { MdPages } from "react-icons/md";

export const eventLP = {
  name: "eventLP",
  type: "document",
  icon: MdPages,
  preview: {
    prepare() {
      return { title: "Event LP" };
    },
  },
  fields: [featuredEventsField(), seoField()],
};
