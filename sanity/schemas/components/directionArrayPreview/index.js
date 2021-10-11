import React from "react";
import Button from "part:@sanity/components/buttons/default";

import { FiBookOpen, FiBook } from "react-icons/fi";
const arrayDropDown = {
  cursor: "pointer",
  zIndex: "1",
};
const openStyle = {
  display: "block",
};
const closeStyle = {
  display: "none",
};

const DirectionList = (props) => {
  const { category, directions } = props.directionCategories;
  const [open, setOpen] = React.useState();
  const directionItems = directions ? directions.map((direction) => <li>{direction.place}</li>) : null;

  return (
    <>
      {category}
      <Button
        kind="simple"
        style={arrayDropDown}
        icon={open ? FiBookOpen : FiBook}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      ></Button>
      <ol style={open ? openStyle : closeStyle}>{directionItems}</ol>
    </>
  );
};

const DirectionArrayPreview = (props) => {
  return <DirectionList directionCategories={props.value} />;
};

export default DirectionArrayPreview;
