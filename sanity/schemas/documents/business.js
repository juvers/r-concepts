import NestedSelect from "../components/nestedSelect";
import {
  MdRestaurant,
  MdShop,
  MdBusiness,
  MdFitnessCenter,
} from "react-icons/md";
import {
  titleAndSlugField,
  hoursField,
  imageField,
  simpleRichtextField,
  imageGalleryField,
  contactsField,
  externalLinkField,
  locationField,
  seoField,
  textField,
  reservationField,
  featuredStoriesField,
  featuredEventsField,
  featuredRetailerField,
  mapIdField,
} from "../fields";

const businessCategory = {
  amenity: {
    title: "Amenity",
    value: "amenity",
    icon: MdFitnessCenter,
    categories: [
      { title: "Banks/ATMs", value: "Banks/ATMs" },
      { title: "Fitness", value: "Fitness" },

      { title: "Health, Bath, & Beauty", value: "Health, Bath, & Beauty" },
      { title: "Services", value: "Services" },
    ],
  },
  dine: {
    title: "Dine",
    value: "dine",
    icon: MdRestaurant,
    categories: [
      { title: "Casual", value: "Casual" },
      { title: "Confections & Desserts", value: "Confections & Desserts" },
      { title: "Bars", value: "Bars" },
      { title: "Fine Dining", value: "Fine Dining" },
      { title: "On The Go", value: "On The Go" },
      { title: "Specialty & Gourmet", value: "Specialty & Gourmet" },
    ],
  },
  shop: {
    title: "Shop",
    value: "shop",
    icon: MdShop,
    categories: [
      { title: "Books & Stationery", value: "Books & Stationery" },
      { title: "Children", value: "Children" },
      { title: "Entertainment", value: "Entertainment" },
      { title: "Eyewear", value: "Eyewear" },
      { title: "Jewelry & Accessories", value: "Jewelry & Accessories" },
      { title: "Men's Fashion", value: "Men's Fashion" },
      { title: "Women's Fashion", value: "Women's Fashion" },
      { title: "Footwear", value: "Footwear" },
      { title: "Gifts & Souvenirs", value: "Gifts & Souvenirs" },
    ],
  },
};

const categoryField = () => ({
  name: "category",
  type: "category",
  validation: (Rule) => Rule.required(),
  options: {
    items: { ...businessCategory },
  },
  inputComponent: NestedSelect,
});

const business = {
  name: "business",
  type: "document",
  title: "Business ",
  icon: MdBusiness,
  fields: [
    titleAndSlugField(),
    textField(),
    imageField("poster"),
    categoryField(),
    hoursField(),
    simpleRichtextField(),
    imageGalleryField(),
    featuredStoriesField(),
    contactsField(),
    externalLinkField("website", false),
    externalLinkField("orderNow", false),
    reservationField(),
    locationField(),
    seoField(),
    mapIdField(),
  ],

  preview: {
    select: {
      title: "titleAndSlug.title",
      subtitle: "titleAndSlug.slug.current",
      media: "poster",
    },
    prepare(selection) {
      const { subtitle } = selection;
      return {
        ...selection,
        ...{
          subtitle: `/${subtitle}`,
        },
      };
    },
  },
};

const businessDirectoryPage = {
  name: "businessDirectoryPage",
  type: "document",
  fields: [
    featuredRetailerField(),
    featuredEventsField(),
    featuredStoriesField(),
    seoField(),
  ],
};

export { business, businessCategory, businessDirectoryPage };
