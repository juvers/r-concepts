const { nanoid } = require("nanoid");

import { getRecords, createDocument, cleanUp } from "../utils";

const records = getRecords(`${__dirname}/data.csv`);
const createDocuments = (records) => {
  records.forEach((item) => {
    const b = {
      // _id: item.slug,
      _type: "redirect",
      source: item.source,
      target: item.target,
      statusCode: item.statusCode || "301",
    };
    // console.log(b);
    createDocument(b);
  });
};
// cleanUp("redirect");
createDocuments(records);
