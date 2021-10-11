export const hoursAndtext = {
  name: "hoursAndtext",
  title: "Hours with text",
  type: "object",
  fields: [
    {
      name: "hours",
      type: "array",
      of: [{ type: "dayAndTime" }],
    },
    {
      name: "hourText",
      type: "text",
    },
  ],
};
