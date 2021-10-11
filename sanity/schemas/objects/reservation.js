const reservationType = ["resy", "opentable"];

const reservation = {
  name: "reservation",
  type: "object",
  options: {
    collapsable: true,
    collapsed: true,
  },
  fields: [
    {
      name: "type",
      type: "string",
      options: {
        list: reservationType,
      },
    },
    {
      name: "url",
      type: "url",
    },
  ],
};

export { reservation };
