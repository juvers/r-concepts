import { MdPlace } from "react-icons/md";

/**
 * range definition
 * @param {Number} start
 * @param {Number} stop
 * @param {Number} step
 * @return {Array.<Number>}
 */
const range = (start, stop, step) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

const capacityOptions = [
  "Full Floor Event",
  "Dinner & Dancing",
  "Reception",
  "Reception & Seated",
  "Reception & Dancing",
  "Theater",
  "Seated Inside",
  "Seated Outside",
  "Cocktail Reception",
  "Seated Dinner",
  "Semi-Private Event",
];
export const capacityOption = {
  name: "capacityOption",
  type: "object",
  icon: MdPlace,
  fields: [
    {
      name: "capacityType",
      type: "string",
      options: {
        list: capacityOptions,
      },
    },
    {
      name: "value",
      title: "value",
      type: "number",
      validation: (Rule) => Rule.required().integer().positive(),
      options: {
        list: range(10, 510, 1),
      },
    },
  ],
};

export const floorPlan = {
  name: "floorPlan",
  type: "object",
  title: "Floor Plan",
  icon: MdPlace,
  options: {
    collapsed: true,
    collapsible: true,
  },
  fields: [
    {
      name: "photo",
      title: "Floor Plan Image",
      type: "imageType",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "info",
      title: "Info",
      type: "text",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "squareFeet",
      title: "Square Feet",
      type: "number",
      validation: (Rule) => Rule.required().integer().positive(),
    },
    {
      name: "dimensions",
      title: "Dimensions",
      type: "string",
    },
    {
      name: "ceilings",
      title: "Ceillings",
      type: "string",
    },
    {
      name: "capacity",
      type: "array",
      of: [{ type: "capacityOption" }],
    },
  ],
};
