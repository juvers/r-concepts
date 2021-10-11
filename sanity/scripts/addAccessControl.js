// https://api.sanity.io/v1/projects/bs9rmafh
const sanityClient = require("@sanity/client");
const { uniq } = require("lodash");
const accessControlToken = process.env.SANITY_TOKEN;
const dataset = process.env.SANITY_DATASET;
const config = require("../sanity.json");

if (!accessControlToken) {
  throw new Error("Could not find token from SANITY_TOKEN");
}
const client = sanityClient({
  projectId: config.api.projectId,
  dataset: dataset || config.api.dataset,
  token: accessControlToken,
  useCdn: false,
});

const editorMemberIds = [
  "poop8e4l1", // ABevilaqua@tishmanspeyer.com
];

function createJournalistGroup() {
  return {
    _id: `_.groups.editors`,
    _type: "system.group",
    grants: [
      {
        filter: "_id in path('*')",
        permissions: ["update", "read"],
      },
      {
        filter: "_id in path('drafts.*')",
        permissions: ["create", "update", "read"],
      },
      {
        filter: "_type in ['sanity.fileAsset', 'sanity.imageAsset']",
        permissions: ["create", "update", "read"],
      },
      {
        filter:
          "_type in ['event', 'business', 'art', 'story', 'newsPress', 'podcast',]",
        permissions: ["create"],
      },
    ],
    members: editorMemberIds,
  };
}

function createOrReplaceGroup(groupDoc) {
  client.createOrReplace(groupDoc).then((res) => {
    console.log(`Created or replaced system group ${res._id}`);
  });
}

createOrReplaceGroup(createJournalistGroup());
