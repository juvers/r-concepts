import { featuredEventsField, featuredStoriesField, seoField } from "../fields";

export const rockListLP = {
  name: "rockListLP",
  type: "document",
  fields: [featuredEventsField(), featuredStoriesField(), seoField()],
};
