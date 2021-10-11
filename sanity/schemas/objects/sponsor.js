const sponsor = {
  name: "sponsor",
  title: "sponsor",
  type: "object",
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    {
      name: "primary",
      type: "array",
      of: [{ type: "imageType" }],
    },
    {
      name: "secondary",
      type: "array",
      of: [{ type: "imageType" }],
    },
  ],
};

export { sponsor };
