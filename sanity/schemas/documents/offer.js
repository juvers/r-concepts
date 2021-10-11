import { MdLocalOffer, MdPages } from "react-icons/md";
import {
  seoField,
  titleAndSlugField,
  retailersField,
  featuredOfferField,
  offersField,
  startEndDateTimeField,
  featuredOfferTitleField,
  FeaturedOfferLocationField,
  simpleRichtextField,
  offerImageField,
  externalLinkField,
} from "../fields";

export const offer = {
  title: "Offers",
  name: "offer",
  type: "document",
  icon: MdLocalOffer,
  fields: [
    titleAndSlugField(),
    offerImageField(),
    retailersField(),
    startEndDateTimeField(),
    FeaturedOfferLocationField(),
    simpleRichtextField("description"),
    { name: "Note", type: "string" },
    externalLinkField("Learn_More_URL", false),
    seoField(),
  ],
  preview: {
    select: {
      title: "titleAndSlug.title",
    },
    prepare({ title }) {
      return {
        title: title,
      };
    },
  },
};

export const offerLP = {
  name: "offerLP",
  type: "document",
  icon: MdPages,
  preview: {
    prepare() {
      return { title: "Offer LP" };
    },
  },
  fields: [
    featuredOfferTitleField(),
    featuredOfferField(),
    offersField(),
    seoField(),
  ],
};
