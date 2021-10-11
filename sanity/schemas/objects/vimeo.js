import { FiShoppingBag, FiYoutube } from "react-icons/fi";
import React from "react";
import Vimeo from "@u-wave/react-vimeo";

const Preview = ({ value }) => {
  const { url } = value;
  return <Vimeo video={url} />;
};
export default {
  name: "vimeo",
  type: "object",
  title: "vimeo",
  icon: FiShoppingBag,
  preview: {
    select: {
      url: "url",
    },
    component: Preview,
  },
  fields: [
    {
      name: "url",
      title: "url",
      type: "url",
      validation: (Rule) => Rule.required(),
    },
  ],
};
