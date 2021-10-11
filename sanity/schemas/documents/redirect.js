import { locationIcon } from "../components/icon";
import { selectField, stringField } from "../fields";

const statusCodeItems = [
  { title: "Permanent", value: "301" },
  { title: "Temporary", value: "302" },
];

const redirect = {
  name: "redirect",
  type: "document",
  icon: locationIcon,
  fields: [
    stringField("source"),
    stringField("target"),
    selectField("statusCode", statusCodeItems),
  ],
};

export { redirect };
