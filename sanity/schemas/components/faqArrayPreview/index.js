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

const FaqList = (props) => {
  const { category, faqs } = props.faqCategories;
  const [open, setOpen] = React.useState();
  const faqItems = faqs ? faqs.map((faq) => <li>{faq.question}</li>) : null;

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
      <ol style={open ? openStyle : closeStyle}>{faqItems}</ol>
    </>
  );
};

const FaqArrayPreview = (props) => {
  return <FaqList faqCategories={props.value} />;
};

export default FaqArrayPreview;
