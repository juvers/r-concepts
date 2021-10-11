import { FiYoutube } from "react-icons/fi";
import React from "react";

import getYouTubeId from "get-youtube-id";
import Youtube from "react-youtube";

const Preview = ({ value }) => {
  const { url } = value;
  const id = getYouTubeId(url);
  return <Youtube videoId={id} />;
};
export default {
  name: "youtube",
  type: "object",
  title: "youtube",
  icon: FiYoutube,
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
