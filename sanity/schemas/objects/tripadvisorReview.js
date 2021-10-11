export const tripadvisorReview = {
  name: "tripadvisorReview",
  type: "object",
  fields: [
    {
      name: "review",
      type: "string",
      validation: (Rule) => Rule.required().max(255),
    },
    {
      name: "source",
      type: "string",
      validation: (Rule) => Rule.required().max(255),
    },
  ],
};
