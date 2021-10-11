import { FiShoppingBag } from "react-icons/fi";

export default {
  name: "imageGallery",
  type: "object",
  title: "Image Gallery",
  icon: "FiShoppingBag",
  options: {
    collapsed: true,
    collapsible: true,
  },
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
    },
    {
      name: "images",
      type: "array",
      title: "Images",
      of: [{ type: "imageType" }],
      options: {
        layout: "grid",
      },
    },
  ],
};
