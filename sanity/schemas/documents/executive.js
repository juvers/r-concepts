import { executiveIcon } from "../components/icon";

export const executive = {
  name: "executive",
  type: "document",
  title: "Executive",
  icon: executiveIcon,
  fields: [
    {
      name: "name",
      type: "string",
      title: "Name",
    },
    {
      name: "title",
      type: "string",
      title: "Title",
    },
    {
      name: "bio",
      type: "simpleRichtext",
      title: "Bio",
    },
    {
      name: "image",
      type: "imageType",
      title: "Photo",
    },
  ],
};
