import { FiShoppingBag } from "react-icons/fi";

export const gallery = {
  name: "gallery",
  type: "object",
  title: "Gallery",
  icon: FiShoppingBag,
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
      name: "items",
      type: "array",
      title: "Items",
      of: [{ type: "imageType" }, { type: "ambientVideoType" }],
      options: {
        layout: "grid",
      },
    },
  ],
};
