import { FiShoppingBag } from "react-icons/fi";

export default {
  name: "metaSEO",
  type: "object",
  title: "metaSEO",
  collapsible: true,
  collepsed: true,
  icon: FiShoppingBag,
  options: {
    collapsed: true,
    collapsible: true,
  },
  fields: [
    {
      name: "metaTitle",
      type: "string",
      title: "Meta Title",
    },
    {
      name: "metaDescription",
      type: "string",
      title: "Meta Description",
    },
  ],
};
