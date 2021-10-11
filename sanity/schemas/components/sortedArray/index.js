import React from "react";
import resolveUploader from "@sanity/form-builder/lib/sanity/uploads/resolveUploader";

import ArrayInput, { Props } from "@sanity/form-builder/lib/inputs/ArrayInput";

export default class SortedArray extends React.Component {
  setInput = (input) => {
    this.input = input;
  };
  focus() {
    this.input.focus();
  }
  // insert = (itemValue, position, atIndex) => {
  //   console.log("here..................");
  //   const { onChange } = this.props;
  //   onChange(
  //     PatchEvent.from(
  //       setIfMissing([]),
  //       insert([itemValue], position, [atIndex])
  //     )
  //   );
  // };
  handleAppend = (value) => {
    console.log("Adding");
    console.log(value);
    this.insert(value, "after", -1);
    this.handleFocusItem(value);
  };
  render() {
    return (
      <ArrayInput
        ref={this.setInput}
        {...this.props}
        onAppendItem={this.handleAppend}
        resolveUploader={resolveUploader}
      />
    );
  }
}
