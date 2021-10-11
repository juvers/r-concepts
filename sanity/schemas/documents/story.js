import { storyIcon } from "../components/icon";
import { MdPages } from "react-icons/md";
import { format } from "date-fns";

import {
  titleAndSlugField,
  imageField,
  stringArrayField,
  publishAtField,
  textField,
  maxRichtextField,
  imageGalleryField,
  externalLinkField,
  featuredStoriesField,
  seoField,
  featuredStoryField,
  selectField,
} from "../fields";

export const storyCategories = [
  "Arts & Culture",
  "Shopping",
  "Food & Drinks",
  "Events",
];
export const story = {
  name: "story",
  type: "document",
  icon: storyIcon,
  fields: [
    titleAndSlugField(),
    selectField("category", storyCategories),
    imageField("poster"),
    publishAtField(),
    stringArrayField("authors", false),
    textField(),
    maxRichtextField(),
    imageGalleryField(),
    featuredStoriesField(),
    externalLinkField("externalLink", false),
    seoField(),
  ],
  orderings: [
    {
      title: "Publish Date, New",
      name: "publishDateDesc",
      by: [{ field: "publishAt", direction: "desc" }],
    },
    {
      title: "Publish Date, Old",
      name: "publishDateAsc",
      by: [{ field: "publishAt", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "titleAndSlug.title",
      publishAt: "publishAt",
      media: "poster",
    },
    prepare({ title, publishAt, media }) {
      return {
        title: title,
        subtitle: format(new Date(publishAt), "h:mm aaaa 'on' L.d.yy "),
        media,
      };
    },
  },
};

export const storyLP = {
  name: "storyLP",
  type: "document",
  icon: MdPages,
  preview: {
    prepare() {
      return { title: "Story LP" };
    },
  },
  fields: [featuredStoryField(), seoField()],
};
