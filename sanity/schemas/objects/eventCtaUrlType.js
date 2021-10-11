export const eventCtaUrlType = {
  name: "eventCtaUrlType",
  title: "Event CTA URL",
  type: "object",
  fields: [
    {
      name: "url",
      type: "url",
      validation: (Rule) => Rule.uri({ allowRelative: true }),
    },
    {
      name: "caption",
      type: "string",
      validation: (Rule) => Rule.max(20),
    },
  ],
};
