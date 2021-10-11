import { GrMapLocation } from "react-icons/gr";
import { directionsField } from "../fields";


export const directions = {
  name: "directions",
  type: "document",
  title: "Directions",
  icon: GrMapLocation,
  fields: [directionsField()],
  preview: {
    prepare() {
      return {
        title: "Directions",
      };
    },
  },
};
