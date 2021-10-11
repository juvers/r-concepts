import UTCDateTimeInput from "part:@sanity/UTCDateInput";

const dateOptions = {
  dateFormat: "MMMM Do yyy",
  timeFormat: "hh:mm a",
  timeStep: 15,
  calendarTodayLabel: "Today",
};

export const startEndDateTime = {
  name: "startEndDateTime",
  type: "object",
  options: {
    collapsable: true,
    collapsed: true,
  },
  fields: [
    {
      name: "startDateTime",
      type: "datetime",
      validation: (Rule) => Rule.required(),
      options: { ...dateOptions },
      inputComponent: UTCDateTimeInput,
    },
    {
      name: "endDateTime",
      type: "datetime",
      validation: (Rule) =>
        Rule.required().min(Rule.valueOfField("startDateTime")),
      options: { ...dateOptions },
      inputComponent: UTCDateTimeInput,
    },
  ],
};
