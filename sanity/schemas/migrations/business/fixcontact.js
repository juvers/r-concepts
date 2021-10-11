import client from "part:@sanity/base/client";

const fetchDocuments = () =>
  client.fetch(`*[_type in ['business']  && contactsInfo[0].type!="phone" ] {_id,contactsInfo}`);

const buildPatches = (docs) =>
  docs.map((doc) => {
    console.log(doc._id, doc.contactsInfo);
    return {
      id: doc._id,
      patch: {
        unset:["contactsInfo"] ,
        // this will cause the transaction to fail if the documents has been
        // modified since it was fetched.
        ifRevisionID: doc._rev,
      },
    };
  });

const createTransaction = (patches) =>
  patches.reduce(
    (tx, patch) => tx.patch(patch.id, patch.patch),
    client.transaction()
  );

const commitTransaction = (tx) => tx.commit();

const migrateNextBatch = async () => {
  const documents = await fetchDocuments();
  const patches = buildPatches(documents);
  if (patches.length === 0) {
    console.log("No more documents to migrate!");
    return null;
  }
  console.log(
    `Migrating batch:\n %s`,
    patches
      .map((patch) => `${patch.id} => ${JSON.stringify(patch.patch)}`)
      .join("\n")
  );
  const transaction = createTransaction(patches);
  // await commitTransaction(transaction);
};

migrateNextBatch().catch((err) => {
  console.error(err);
  process.exit(1);
});
