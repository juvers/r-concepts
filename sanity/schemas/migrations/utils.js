import { nanoid } from "nanoid";
import client from "part:@sanity/base/client";
import { createReadStream } from "fs";
import { basename } from "path";
import fs from "fs";
const parse = require("csv-parse/lib/sync");
const { default: PQueue } = require("p-queue");
const queue = new PQueue({
  concurrency: 1,
  interval: 1000 / 4,
});

exports.getRecords = (f) => {
  const data = fs.readFileSync(f, "utf8");
  // console.log(data);
  return parse(data, { columns: true });
};

export const getSanityImage = (f) => {
  const data = fs.readFileSync(f);
  const filename = basename(f);
  return client.assets.upload("image", data, { filename }).then((i) => i._id);
};

export const getImages = async (dirname, gallery) => {
  const images = gallery.split("|");
  if (images.length <= 1) return [];
  return Promise.all(
    images.map(async (image) => {
      const f = `${dirname}/images/${image}`;
      const imageID = await getSanityImage(f);
      return {
        _type: "imageType",
        _key: nanoid(),
        asset: {
          _type: "reference",
          _ref: imageID,
        },
        alt: image,
      };
    })
  );
};

exports.getBody = (body) => {
  return [
    {
      children: [{ _type: "span", _key: nanoid(), text: body, marks: [] }],
      markDefs: [],
      _type: "block",
      _key: nanoid(),
      style: "normal",
    },
  ];
};

exports.createDocumentWithImage = (item) => {
  const f = item.poster.asset._ref;
  client.assets
    .upload("image", createReadStream(f), {
      filename: basename(f),
    })
    .then((imageAsset) => {
      item.poster.asset._ref = imageAsset._id;
      client.createOrReplace(item);
    });
};

exports.createDocument = (document) => {
  queue.add(() =>
    client.create(document).then((res) => {
      console.log(`Document create ID is ${res._id}`);
    })
  );
};

exports.getDocumentID = (
  documentType,
  documentFieldName,
  documentFieldValue
) => {
  return client
    .fetch(
      `*[_type=="${documentType}" && ${documentFieldName}=="${documentFieldValue}"]{_id}`
    )
    .then((l) => {
      if (l.length >= 1) {
        return l[0]._id;
      }
    })
    .catch((err) => {
      console.log(documentFieldValue);
      // Promise.reject(new Error(`can't find ${documentFieldValue}`));
      console.log(err);
    });
};

exports.cleanUp = (type) => {
  let q = `*[_type=='${type}' && _id in path('drafts.**')]{_id}`;
  client.fetch(q).then((documents) => {
    documents.forEach((document) => {
      console.log(document);
      queue.add(() =>
        client.delete(document._id).catch((err) => {
          console.log("<<", document, err);
        })
      );
    });
  });
  q = `*[_type=='${type}']{_id}`;
  client.fetch(q).then((documents) => {
    documents.forEach((document) => {
      console.log(document);
      client.delete(document._id).catch((err) => {
        console.log("<<", document, err.details.description);
      });
    });
  });
};
