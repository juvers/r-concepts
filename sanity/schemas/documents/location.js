import { locationIcon } from "../components/icon";
import { titleField, stringField } from "../fields";

const location = {
  name: "location",
  type: "document",
  icon: locationIcon,
  fields: [titleField(), stringField("address1"), stringField("address2")],
};

export { location };
