import alertIcon from "../components/icon";

const alertType = [
  { title: "Informative", value: "Informative" },
  { title: "Warning", value: "Warning" },
  { title: "Error", value: "Error" },
  { title: "Other", value: "Other" },
];

const alert = {
  name: "alert",
  type: "object",
  icon: alertIcon,
  options: {
    collapsed: true,
    collapsable: true,
  },
  fields: [
    {
      name: "title",
      type: "string",
    },
    {
      name: "description",
      type: "string",
    },
    {
      name: "link",
      type: "urlType",
    },
    {
      name: "type",
      type: "string",
      options: { list: alertType },
    },
  ],
};

export { alert };
