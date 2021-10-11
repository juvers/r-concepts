import { MdPlace } from "react-icons/md";

export const sampleMenu = {
  name: "sampleMenu",
  type: "object",
  title: "Sample Menu",
  icon: MdPlace,
  options: {
    collapsed: true,
    collapsible: true,
  },
  fields: [
    {
      name: "pdf",
      title: "Menu PDF",
      type: "fileType",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "menuPhotos",
      title: "Menu Photos",
      type: "array",
      of: [{ type: "imageType" }],
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: "gallery",
      title: "Menu Gallery",
      type: "imageGallery",
    },
  ],
};
