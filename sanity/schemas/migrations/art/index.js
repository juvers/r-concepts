import { nanoid } from "nanoid";

import {
  getRecords,
  getBody,
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
    const d = {
      // _id: item.slug,
      _type: "art",
      category: item.category,
      seo:
        item.metaDescription == ""
          ? {}
          : {
              _type: "metaSEO",
              metaDescription: item.title,
              metaTitle: item.title,
            },
      authors: [
        {
          _key: nanoid(),
          _type: "reference",
          _ref: await getDocumentID("artAuthor", "name", item.artists),
        },
      ],
      excerpt: item.excerpt,
      body: getBody(item.body),
      location: {
        _type: "reference",
        _ref: await getDocumentID("location", "title", item.location),
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
        alt: item.title,
        asset: {
          _ref: await getSanityImage(`${__dirname}/images/${item.poster}`),
          _type: "reference",
        },
      },
      imageGallery: {
        _type: "imageGallery",
        title: item.title,
        images: await getImages(__dirname, item.gallery).then(
          (images) => images
        ),
      },
    };
    // console.log(JSON.stringify(d));
    createDocument(d);
  });
};

createDocuments(records);
// cleanUp("art");
