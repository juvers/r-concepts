import React from "react";
import PropTypes from "prop-types";
import { withDocument } from "part:@sanity/form-builder";
import FormField from "part:@sanity/components/formfields/default";
import PatchEvent, { set, unset } from "part:@sanity/form-builder/patch-event";

// 1. Import react-timepicker CSS

const createPatchFrom = (value) =>
  PatchEvent.from(value === "" ? unset() : set(value));

class TimeInput extends React.Component {
  // 5. Declare shape of React properties
  static propTypes = {
    type: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
    }).isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  };

  timeInput = React.createRef();

  // 6. Called by the Sanity form-builder when this input should receive focus
  focus = () => {
    this.timeInput.current.focus();
  };

  // 7. Function called whenever an editor changes a value
  handleTimeChange = (event) => {
    const { value } = event.target;
    const { onChange } = this.props;

    onChange(createPatchFrom(value));
  };

  render = () => {
    const { type, value } = this.props;
    return (
      <FormField label={type.title} description={type.description}>
        <div>
          <input
            type="time"
            value={value || "00:00"}
            onChange={this.handleTimeChange}
            ref={this.timeInput}
          />
        </div>
      </FormField>
    );
  };
}

export default withDocument(TimeInput);
