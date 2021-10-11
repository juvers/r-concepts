import { newsPressIcon } from "../components/icon";

import {
  publishAtField,
  textField,
  externalLinksField,
  selectField,
  titleField,
} from "../fields";

const newsPressSources = [
  "NYCGo.com",
  "Food & Wine",
  "Conde Nast Traveler",
  "Zagat",
  "Brides",
  "Beyond Times Square",
  "Galerie",
  "Reuters",
  "TODAY",
  "CNN",
  "New York Post",
  "Travel + Leisure",
  "Architectural Digest",
  "PR Newswire",
  "The New York Times",
  "Shanghai Daily",
  "Martha Stewart Weddings",
  "Commercial Property Executive",
  "The Wall Street Journal",
  "Real Estate Weekly",
  "Modern Luxury",
  "Metro",
  "Commercial Observer",
  "Urban Land Institute",
  "Time Out New York",
  "Town and Country Magazine",
  "Grub Street",
  "6sqft",
  "Women’s Wear Daily  ",
];

export const newsPressCategory = ["category one", "category two"];

export const newsPress = {
  name: "newsPress",
  type: "document",
  icon: newsPressIcon,
  fields: [
    titleField(),
    publishAtField(),
    textField(),
    externalLinksField(),
    selectField("source", newsPressSources),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "source",
    },
  },
};
