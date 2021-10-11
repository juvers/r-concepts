import { MdHome } from "react-icons/md";
import {
  featuredEventsField,
  featuredStoriesField,
  seoField,
  onlyHereField,
  flexSpaceField,
  alertField,
} from "../fields";

export const homePage = {
  name: "homePage",
  type: "document",
  icon: MdHome,
  fields: [
    alertField(false),
    {
      name: "headline",
      title: "Hero Headline",
      type: "string",
      validation: (Rule) => Rule.required().max(255),
    },
    {
      name: "media",
      type: "imageOrVideoType",
      title: "Hero Image / Video",
    },
    onlyHereField(),
    flexSpaceField(),
    featuredEventsField(),
    featuredStoriesField(),
    seoField(),
  ],
  preview: {
    prepare() {
      return { title: "Home Page" };
    },
  },
};
