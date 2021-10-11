const imageType = {
  name: "imageType",
  type: "image",
  options: {
    hotspot: true,
    collapsed: true,
    collapsible: true,
  },
  fields: [
    {
      name: "alt",
      type: "string",
      title: "Alt Text",
      options: {
        isHighlighted: true,
      },
    },
    {
      name: "caption",
      type: "string",
      title: "Caption",
      options: {
        isHighlighted: true,
      },
    },
  ],
  validation: (Rule) =>
    Rule.custom((fields, context) => {
      const { alt, asset } = fields;
      if (asset && !alt) {
        return "An alt value is required with every image";
      }
      return true;
    }),
};

const imageTypeSide = {
  name: "imageTypeSide",
  type: "image",
  options: {
    hotspot: true,
    collapsed: true,
    collapsible: true,
  },
  fields: [
    {
      name: "align",
      type: "string",
      title: "Choose image side",
      validation: (Rule) => Rule.required(),
      options: {
        isHighlighted: true,
        layout: "radio",
        list: ["left", "right"],
      },
    },
    {
      name: "alt",
      type: "string",
      title: "Alt Text",
      validation: (Rule) => Rule.required(),
      options: {
        isHighlighted: true,
      },
    },
    {
      name: "caption",
      type: "string",
      title: "Caption",
      options: {
        isHighlighted: true,
      },
    },
  ],
};

export { imageType, imageTypeSide };
