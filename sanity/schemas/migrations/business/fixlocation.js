import client from "part:@sanity/base/client";

const fetchDocuments = () =>
  client.fetch(`*[_type in ['business']] {_id, location}`);

const buildPatches = (docs) =>
  docs.map((doc) => {
    console.log(doc._id, doc.location);
    return {
      id: doc._id,
      patch: {
        set: {
          "location._ref":
            doc.location._ref == "5UsmSq33r3obGsh0BsHSJJ"
              ? "WTarinHvhtzFdAnLnR7hqY"
              : doc.location._ref,
        },
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
  await commitTransaction(transaction);
};

migrateNextBatch().catch((err) => {
  console.error(err);
  process.exit(1);
});
