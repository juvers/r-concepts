export const vendor = {
  name: "vendor",
  type: "object",
  fields: [
    {
      name: "vendorListPdf",
      type: "fileType",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "vendorListImages",
      type: "array",
      of: [{ type: "imageType" }],
    },
  ],
};
