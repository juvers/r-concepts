const { nanoid } = require("nanoid");

const getHours = (data) => {
  return data.hours.split(";").map((hour) => {
    const p = hour.split("|");
    return {
      _key: nanoid(),
      _type: "dayAndTime",
      closesAt: p[2],
      day: p[0],
      opensAt: p[1],
    };
  });
};

const getContactsInfo = (data) => {
  return data.contactsInfo.split(";").map((c) => {
    const p = c.split("|");
    return {
      _key: nanoid(),
      _type: "contactInfo",
      type: p[0],
      value: p[1],
    };
  });
};

import {
  getRecords,
  getBody,
  createDocumentWithImage,
  getDocumentID,
  cleanUp,
  getImages,
  getSanityImage,
  createDocument,
} from "../utils";

const records = getRecords(`${__dirname}/data.csv`);
// console.log(records);

const createDocuments = (records) => {
  records.forEach(async (item) => {
    const b = {
      // _id: item.slug,
      _type: "business",
      excerpt: item.excerpt,
      hours: getHours(item),
      contactsInfo: getContactsInfo(item),
      website: { _type: "urlType", url: item.website, caption: item.title },
      body: getBody(item.body),
      seo:
        item.metaDescription == ""
          ? {}
          : {
              _type: "metaSEO",
              metaDescription: item.metaDescription,
              metaTitle: item.metaTitle,
            },
      location: {
        _type: "reference",
        _ref: await getDocumentID("location", "title", item.location),
      },
      category: {
        category: item.category,
        subCategory: item.subCategory.split(";"),
      },
      titleAndSlug: {
        _type: "titleAndSlug",
        slug: {
          _type: "slug",
          current: item.slug,
        },
        title: item.title,
      },
      poster: {
        _type: "imageType",
        alt: item.posterAlt,
        asset: {
          _ref: await getSanityImage(`${__dirname}/images/${item.poster}`),
          _type: "reference",
        },
      },
    };
    // console.log(b);
    createDocument(b);
  });
};
// cleanUp("business");
createDocuments(records);
