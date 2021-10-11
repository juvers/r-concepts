import React from "react";
import { useDocumentOperation } from "@sanity/react-hooks";

export function SetSlug(props) {
  const { patch, publish } = useDocumentOperation(props.id, props.type);
  const [isPublishing, setIsPublishing] = React.useState(false);
  React.useEffect(() => {
    // if the isPublishing state was set to true and the draft has changed
    // to become `null` the document has been published
    if (isPublishing && !props.draft) {
      setIsPublishing(false);
    }
  }, [props.draft]);

  return {
    disabled: publish.disabled,
    label: isPublishing ? "Publishing..." : "Publish",
    onHandle: () => {
      // window.alert(` Hello from custom action!`);
      setIsPublishing(true);
      patch.execute([{ set: { slug: "slug-one" } }]);

      publish.execute();

      props.onComplete();
    },
  };
}

export function DialogAction({ id, type, published, draft }) {
  const doc = draft || published;

  const [isDialogOpen, setDialogOpen] = React.useState(false);

  const { patch } = useDocumentOperation(id, type);

  return {
    label: `Edit title`,
    onHandle: () => {
      setDialogOpen(true);
    },
    dialog: isDialogOpen && {
      type: "modal",
      onClose: () => {
        setDialogOpen(false);
      },
      content: (
        <>
          <h2>Edit title field</h2>
          <input
            type="text"
            value={(doc && doc.title) || ""}
            onChange={(event) =>
              patch.execute([{ set: { title: event.currentTarget.value } }])
            }
          />
          <button onClick={() => setDialogOpen(false)}>Done</button>
        </>
      ),
    },
  };
}
