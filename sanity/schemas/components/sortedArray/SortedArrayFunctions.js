import React from "react";
import PropTypes from "prop-types";
import SearchableSelect from "part:@sanity/components/selects/searchable";
import DefaultArrayFunctions from "part:@sanity/form-builder/input/array/functions-default";
import styles from "./SortedArrayFunctions.css";
import PatchEvent, {
  set,
  unset,
  insert,
  setIfMissing,
} from "part:@sanity/form-builder/patch-event";
import { FOCUS_TERMINATOR, startsWith } from "@sanity/util/paths";

const SearchItem = (item) => <div className={styles.item}>{item.title}</div>;

// eslint-disable-next-line react/no-multi-comp
export default class SortedArrayFunctions extends React.Component {
  static propTypes = {
    type: PropTypes.shape({
      of: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string,
          type: PropTypes.shape({
            name: PropTypes.string.isRequired,
          }).isRequired,
        })
      ),
    }).isRequired,
    value: PropTypes.array,
    readOnly: PropTypes.bool,
    onAppendItem: PropTypes.func.isRequired,
    onCreateValue: PropTypes.func.isRequired,
    onFocusItem: PropTypes.func,
  };

  static defaultProps = {
    value: [],
    readOnly: false,
  };

  constructor(props) {
    super(props);

    this.state = { results: this.getMatchingResults("", props.type) };
  }

  handleInsertItem = (type) => {
    alert("this");
    const { onCreateValue, onAppendItem } = this.props;
    const item = onCreateValue(type);

    onAppendItem(item);
  };

  getMatchingResults = (query, type) => {
    return type.of
      .filter((memberDef) =>
        (memberDef.title || memberDef.type.name).toLowerCase().includes(query)
      )
      .map((memberDef) => ({
        title: memberDef.title || memberDef.type.name,
        type: memberDef.type,
      }));
  };

  handleSearch = (query) => {
    this.setState({ results: this.getMatchingResults(query, this.props.type) });
  };

  handleChange = (value) => {
    this.handleInsertItem(value.type);
  };

  insert = (itemValue, position, atIndex) => {
    // alert("Insert");
    console.log(itemValue, position, atIndex);
    PatchEvent.from(setIfMissing([]), insert([itemValue], position, [atIndex]));
  };
  handleAppend = (value) => {
    this.insert(value, "after", -1);
    this.handleFocusItem(value);
  };
  handleFocus = () => {
    console.log(this.props.onFocus);
    this.props.onFocus([FOCUS_TERMINATOR]);
  };
  handleFocusItem = (item) => {
    console.log("handleFocusItem", this.props.onFocus);
    this.handleFocus([{ _key: item._key }, FOCUS_TERMINATOR]);
  };
  render() {
    const { type, readOnly } = this.props;
    console.log(type.of.length, readOnly);
    // if (readOnly || type.of.length <= 3) {
    //   return <DefaultArrayFunctions {...this.props} />;
    // }

    return (
      // <DefaultArrayFunctions
      //   {...this.props}
      //   onAppendItem={this.handleAppend}
      //   onFocusItem={this.handleFocusItem}
      // >
      <DefaultArrayFunctions {...this.props}>
        <div className={styles.searchableSelect}>
          <SearchableSelect
            className={styles.searchableSelectInput}
            placeholder="Type to search…"
            onSearch={this.handleSearch}
            onChange={this.handleChange}
            renderItem={SearchItem}
            items={this.state.results}
          />
        </div>
      </DefaultArrayFunctions>
    );
  }
}
