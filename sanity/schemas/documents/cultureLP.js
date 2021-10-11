import {
  featuredEventsField,
  featuredStoriesField,
  heroCTAField,
  imageGalleryField,
  seoField,
  ctaCrads,
  ctaCard,
} from "../fields";
import { MdPages } from "react-icons/md";

export const cultureLP = {
  name: "cultureLP",
  type: "document",
  icon: MdPages,
  preview: {
    prepare() {
      return { title: "Culture LP" };
    },
  },
  fields: [featuredEventsField(), featuredStoriesField(), seoField()],
};

export const gessoAudioTour = {
  name: "gessoAudioTour",
  type: "document",
  fields: [
    imageGalleryField(),
    heroCTAField(),
    ctaCard(),
    ctaCrads(),
    featuredStoriesField(),
    seoField(),
  ],
};
