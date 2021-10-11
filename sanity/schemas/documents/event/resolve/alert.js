// resolveDocumentActions.js

// import the default document actions
import defaultResolve from "part:@sanity/base/document-actions";

import { SetSlug, DialogAction } from "../action/alert";

export default function resolveDocumentActions(props) {
  return [...defaultResolve(props)];
  // return [...defaultResolve(props), SetSlug, DialogAction];
}
