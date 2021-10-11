import { FiFile } from "react-icons/fi";
export default {
  name: "fileType",
  title: "File",
  type: "file",
  icon: FiFile,
  options: {
    collapsed: true,
    collapsible: true,
    accept: ".pdf", // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Unique_file_type_specifiers
  },
  fields: [
    {
      name: "caption",
      type: "string",
      validation: (Rule) => Rule.required(),
      options: {
        isHighlighted: true,
      },
    },
  ],
};
