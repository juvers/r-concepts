import { FiYoutube } from "react-icons/fi";
export const videoType = {
  name: "videoType",
  type: "object",
  icon: FiYoutube,
  options: {
    collapsed: true,
    collapsible: true,
  },
  fields: [
    {
      name: "url",
      type: "url",
      title: "URL",
    },
    {
      name: "poster",
      title: "poster",
      type: "imageType",
    },
  ],
};

export const ambientVideoType = {
  name: "ambientVideoType",
  type: "object",
  icon: FiYoutube,
  options: {
    collapsed: true,
    collapsible: true,
  },
  fields: [
    {
      name: "videoFile",
      type: "file",
    },
    {
      name: "poster",
      type: "imageType",
    },
  ],
};
