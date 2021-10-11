import { MdPages } from "react-icons/md";
import { featuredEventsField, featuredStoriesField, seoField } from "../fields";

export const communityLP = {
  name: "communityLP",
  title: "Community LP",
  type: "document",
  icon: MdPages,
  preview: {
    prepare() {
      return { title: "Community LP" };
    },
  },
  fields: [featuredEventsField(), featuredStoriesField(), seoField()],
};
