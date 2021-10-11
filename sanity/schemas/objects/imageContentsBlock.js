import Icon from "../components/icon";
import React from "react";

const row = {
  display: "flex",
};
const column = {
  flex: "50%",
};
const ImageContentsBlockPreview = (props) => {
  const { contents, photo } = props.value;
  console.log(props);
  if (contents && photo) {
    return (
      <div style={row}>
        <div style={column}>
          <img src={photo} />
        </div>

        <div style={column}>{contents}</div>
      </div>
    );
  } else {
    return "";
  }
};

const imageContentsBlock = {
  name: "imageContentsBlock",
  type: "object",
  icon: () => <Icon emoji="📝" />,
  preview: {
    select: {
      contents: "contents",
      photo: "photo.asset.url",
    },
    component: ImageContentsBlockPreview,
  },
  fields: [
    {
      name: "photo",
      type: "imageTypeSide",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "contents",
      type: "array",
      validation: (Rule) => Rule.required(),
      of: [
        {
          type: "block",
          styles: [],
        },
      ],
    },
  ],
};

export { imageContentsBlock };
