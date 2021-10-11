import { documentTypes } from "../documentTypes";
import React from "react";

const decorators = [
  { title: "String", value: "strong" },
  { title: "Emphasis", value: "em" },
];
const styles = [
  { title: "Normal", value: "normal" },
  { title: "H2", value: "h2" },
  { title: "H3", value: "h3" },
  { title: "H4", value: "h4" },
  { title: "H5", value: "h5" },
  { title: "H6", value: "h6" },
];

const simpleRichtext = {
  name: "simpleRichtext",
  type: "array",
  of: [
    {
      type: "block",
      // lists: [],
      styles: [],
      marks: {
        decorators: decorators,
      },
    },
  ],
};

const fullRichtext = {
  name: "fullRichtext",
  type: "array",
  of: [
    {
      type: "block",
      styles: [],
      marks: {
        decorators: decorators,
      },
    },
    {
      title: "image",
      type: "imageType",
    },
    {
      type: "fileType",
      title: "File",
    },
    {
      type: "youtube",
      title: "Youtube",
    },
    {
      type: "vimeo",
      title: "Vimeo",
    },
  ],
};

const externalLink = {
  name: "link",
  type: "object",
  title: "External link",
  blockEditor: { icon: () => <div>🌏</div> },
  fields: [
    {
      name: "href",
      title: "URL",
      type: "url",
    },
    {
      title: "Open in new tab",
      name: "blank",
      type: "boolean",
    },
  ],
};
const internalLink = {
  name: "internalLink",
  title: "Internal Document",
  type: "object",
  blockEditor: { icon: () => <div>🔗</div> },
  fields: [
    {
      name: "item",
      type: "reference",
      to: [...documentTypes],
    },
  ],
};

const link = [externalLink, internalLink];

const maxRichtext = {
  name: "maxRichtext",
  type: "array",
  of: [
    {
      type: "block",
      styles: styles,
      marks: {
        decorators: decorators,
        annotations: link,
      },
    },
    {
      title: "gallery",
      type: "gallery",
    },
    {
      type: "fileType",
      title: "File",
    },
    {
      type: "youtube",
      title: "Youtube",
    },
    {
      type: "vimeo",
      title: "Vimeo",
    },
    {
      name: "imageContentsBlock",
      type: "imageContentsBlock",
    },
    { name: "quote", type: "quote" },
  ],
};
export { simpleRichtext, fullRichtext, maxRichtext, decorators };
