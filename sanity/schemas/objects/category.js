const category = {
  name: "category",
  type: "object",
  fields: [
    {
      name: "category",
      title: "Category",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "subCategory",
      title: "Sub Category",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    },
  ],
};

export { category };
