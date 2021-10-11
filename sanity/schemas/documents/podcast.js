import { podcastIcon } from "../components/icon";
import { MdPages } from "react-icons/md";
import {
  titleAndSlugField,
  imageField,
  stringArrayField,
  textField,
  selectField,
  podcastsField,
} from "../fields";

const podcastHost = [
  { title: "apple", value: "apple" },
  { title: "spotify", value: "spotify" },
  { title: "audible", value: "audible" },
  { title: "soundcloud", value: "soundcloud" },
];

const podcastSource = {
  name: "podcastSource",
  type: "object",
  fields: podcastHost.map((field) => ({
    name: field.title,
    type: "url",
  })),
};

const podcastSourceField = () => ({
  name: "podcastSource",
  type: "podcastSource",
});

const podcastCategories = [
  "Art",
  "Business",
  "Comedy",
  "Education",
  "Government",
  "Health & Fitness",
  "Kids & Family",
  "Music",
  "News",
  "Leisure",
  "Science",
  "Society & Culture",
  "Sports",
  "Tech",
  "TV & Film",
];

const podcast = {
  name: "podcast",
  type: "document",
  icon: podcastIcon,
  fields: [
    titleAndSlugField(),
    imageField("poster"),
    podcastSourceField(),
    selectField("category", podcastCategories),
    stringArrayField("authors"),
    textField(),
  ],
  preview: {
    select: {
      title: "titleAndSlug.title",
      media: "poster",
      authors: "authors",
    },
    prepare(selection) {
      const { title, authors, media } = selection;
      return {
        title: title,
        subtitle: authors ? authors.join(", ") : "",
        media: media,
      };
    },
  },
};

const podcastLP = {
  name: "podcastLP",
  type: "document",
  icon: MdPages,
  preview: {
    prepare() {
      return { title: "Podcasts LP" };
    },
  },
  fields: [podcastsField()],
};

export { podcastSource, podcast, podcastLP };
