import T from "@sanity/base/initial-value-template-builder";

import S, { listItem } from "@sanity/desk-tool/structure-builder";
import {
  eventAdmissionTypes,
  eventCategories,
} from "../schemas/documents/event/detail";

import { businessCategory } from "../schemas/documents/business";
import { newsPressCategory } from "../schemas/documents/newsPress";
import { attractionPages } from "../schemas/documentTypes";

const eventTypesByAdmission = eventAdmissionTypes.map((admission) => ({
  id: `event-${admission}`,
  title: `${admission}[Admission]`,
  schemaType: "event",
  value: (parameters) => ({ admissionType: admission }),
}));

const eventTypesByCategory = eventCategories.map((category) => ({
  id: `event-${category}`,
  title: `${category}[Category]`,
  schemaType: "event",
  value: (parameters) => ({ category: category }),
}));

const specialEvent = [
  {
    id: `event-special`,
    title: `Special event`,
    schemaType: "event",
    value: (parameters) => ({ specialEvent: true }),
  },
];
const businessByCategory = Object.keys(businessCategory).map((category) => ({
  id: `business-${category}`,
  title: businessCategory[category].title,
  icon: businessCategory[category].icon,
  description: `Create ${category} business`,
  schemaType: "business",
  value: (params) => ({
    category: {
      _type: "object",
      category: params.category ? params.category : category,
    },
  }),
}));

const newsPressByCategory = newsPressCategory.map((category) => ({
  id: `newspress-${category}`,
  title: `${category}`,
  description: `Create ${category} newspress`,
  schemaType: "newsPress",
  value: (params) => ({
    category: category,
  }),
}));

const hideDocTypes = (listItem) =>
  ![
    "generalFaqs",
    "executive",
    ...attractionPages.map((item) => item.type),
  ].includes(listItem.getId());

export default [
  // ...eventTypesByAdmission,
  // ...eventTypesByCategory,
  // ...specialEvent,
  ...businessByCategory,
  ...newsPressByCategory,
  ...T.defaults().filter(hideDocTypes),
];
