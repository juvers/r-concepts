import React from "react";
import PropTypes, { func, string, array } from "prop-types";
import Select from "part:@sanity/components/selects/default";
import Checkbox from "part:@sanity/components/toggles/checkbox";
import Fieldset from "part:@sanity/components/fieldsets/default";

import {
  PatchEvent,
  set,
  setIfMissing,
  unset,
} from "part:@sanity/form-builder/patch-event";

import style from "./nestedSelect.css";

const EMPTY_ITEM = { title: "Select one", value: undefined };

const toSelectItems = (items) => {
  if (items === undefined) return [];
  if (Array.isArray(items)) {
    return items.map(({ title, value }) => ({ value: value, title: title }));
  }

  return Object.entries(items).map(([key, value]) => {
    return { title: value.title, value: key };
  });
};

const NestedSelect = React.forwardRef((props, ref) => {
  const { value, type, onChange, markers, ...rest } = props;

  // Check if second field allows multiple selections
  const isMulti = type.fields[1] && type.fields[1].type.jsonType === "array";

  // Retrieve field names for render
  const [{ name: firstFieldName }, { name: secondFieldName }] = type.fields;

  // Declare first options and the currently selected first option
  const firstOptions = type.options.items;
  const currentFirstSelect =
    (value && firstOptions[value[firstFieldName]]) || null;

  // Declare second options and the currently selected second option(s)
  const secondOptions = currentFirstSelect ? currentFirstSelect.categories : [];
  const currentSecondSelect =
    currentFirstSelect &&
    currentFirstSelect.categories.filter((item) => {
      if (isMulti) {
        // If allowing multiple selections, filter out all the first option's categories
        // that match in the value set
        return (
          value[secondFieldName] &&
          value[secondFieldName].indexOf(item.value) >= 0
        );
      } else {
        // If only one selection allowed, get string value from the value set
        return item.value === value[secondFieldName];
      }
    });

  const handleSelectChange = ({
    value,
    fieldName,
    isMulti = false,
    inputTypeName = "",
  }) => {
    if (fieldName === firstFieldName) {
      // Change occurred with the first value, send new value with a resetted second value

      const newValue = {};
      newValue[firstFieldName] = value;
      onChange(
        PatchEvent.from(
          setIfMissing({ _type: inputTypeName }),
          value ? set(newValue) : unset()
        )
      );
    }
    if (fieldName === secondFieldName) {
      // Change occured with the second field, update second field

      onChange(
        PatchEvent.from(
          setIfMissing({ _type: inputTypeName }),
          typeof value === "undefined"
            ? unset([secondFieldName])
            : set(value, [secondFieldName])
        )
      );
    }
  };

  const handleCheckBoxChange = ({ event, value, secondFieldName }) => {
    const checked = event.target.checked;

    // Generate array of selected value strings
    let newSelectedValues = currentSecondSelect
      ? currentSecondSelect.map((item) => item.value)
      : [];

    // This value is already set as selected
    const alreadySelected = newSelectedValues.indexOf(`${value}`) >= 0;

    if (checked && !alreadySelected) {
      // Checked value that is currently not a selected value, concatenate to new set
      newSelectedValues = newSelectedValues.concat(value);
    } else if (!checked && alreadySelected) {
      // Value is unchecked but it's still set as selected
      newSelectedValues = newSelectedValues.filter((item) => item !== value);
    } else {
      // Nothing to do, stop here
      return;
    }
    // Update new values
    onChange(PatchEvent.from(set(newSelectedValues, [secondFieldName])));
  };

  // Prep first options for select render
  const firstSelectOptions = toSelectItems(firstOptions);

  // Retrieve first item value for render
  const firstItemValueObj =
    firstSelectOptions.find(
      (item) =>
        item && currentFirstSelect && item.value === currentFirstSelect.value
    ) || {};

  return (
    <Fieldset
      ref={ref}
      legend={type.title}
      description={type.description}
      markers={markers}
      {...rest}
    >
      <div key={firstFieldName}>
        <Select
          label={firstFieldName}
          name={firstFieldName}
          value={firstItemValueObj}
          onChange={(item) =>
            handleSelectChange({
              ...item,
              fieldName: firstFieldName,
              isMulti,
              inputTypeName: type.name,
            })
          }
          items={[EMPTY_ITEM].concat(firstSelectOptions)}
        />
      </div>
      {isMulti ? (
        <ul key={secondFieldName} className={style.checkBox}>
          {secondOptions.map((item) => (
            <li key={item.value}>
              <Checkbox
                checked={
                  currentSecondSelect.find((j) => j.value === item.value) !==
                  undefined
                }
                onChange={(event) =>
                  handleCheckBoxChange({
                    event,
                    value: item.value,
                    currentFirstSelect,
                    currentSecondSelect,
                    secondFieldName,
                  })
                }
                label={item.title}
              ></Checkbox>
            </li>
          ))}
        </ul>
      ) : (
        <div key={secondFieldName}>
          <Select
            label={secondFieldName}
            name={secondFieldName}
            value={currentSecondSelect && currentSecondSelect[0]}
            items={[EMPTY_ITEM].concat(secondOptions)}
            onChange={(item) =>
              handleSelectChange({
                ...item,
                fieldName: secondFieldName,
                isMulti,
                inputTypeName: type.name,
              })
            }
          />
        </div>
      )}
    </Fieldset>
  );
});

NestedSelect.propTypes = {
  value: PropTypes.object,
  type: {
    fields: PropTypes.arrayOf(PropTypes.objectOf(string)),
    options: PropTypes.objectOf(PropTypes.objectOf(string)),
  },
  onChange: func,
};

export default NestedSelect;
