import React from "react";
import moment from "moment";
import { DateTimeInput } from "@sanity/form-builder/lib/inputs/DateInputs";
import BaseDateTimeInput from "@sanity/form-builder/lib/inputs/DateInputs/BaseDateTimeInput";
/*
 *  This is a hack to override the exisitng datetime pickers
 *  so that they display time in utc instead of converting utc to localtime
 *  and vice versa.
 *
 *  The reason we need to do this is because Gatsby's graphql date
 *  formatter function uses `moment.utc()`, and the current RC frontend
 *  is making extensive use of that function. So we have to keep everything
 *  in utc in both the frontend and the backend.
 *
 *  Otherwise, when the user enters in time they believe is in New York time,
 *  it will get converted to utc for storage in the db. And when we format the
 *  utc time in the frontend, it stays in UTC even though the user intended to
 *  enter it in New York time.
 *
 *  This addresses #1614
 */

const getFormat = (dateFormat, timeFormat) =>
  dateFormat + (timeFormat ? ` ${timeFormat}` : "");

class UTCBaseDateTimeInput extends BaseDateTimeInput {
  handleInputChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const inputValue = event.currentTarget.value;
    const { onChange, dateFormat, timeFormat } = this.props;
    const parsed = moment.utc(
      inputValue,
      getFormat(dateFormat, timeFormat),
      true
    );
    if (parsed.isValid()) {
      this.setState({ inputValue: null });
      onChange(parsed);
    } else {
      this.setState({ inputValue: inputValue });
    }
  };
}

class UTCDateTimeInput extends DateTimeInput {
  render() {
    const { value } = this.props;
    const component = super.render();
    return (
      <UTCBaseDateTimeInput {...component.props} value={moment.utc(value)} />
    );
  }
}

export default UTCDateTimeInput;
