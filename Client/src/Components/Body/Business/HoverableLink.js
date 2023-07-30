import React, { useState } from "react";
import { Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import OpenBusinesscss from "./OpenBusiness.module.css";
function HoverableLink(props) {
  const [open, setOpen] = useState(false);

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  const handleClick = (e) => {
    setOpen(!open);
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <Tooltip title={props.title} open={open} onClose={() => setOpen(false)}>
      <Link
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className={OpenBusinesscss.openBusinessTab}
        name={props.name}
        to={props.to}
        id={props.id}
      >
        {props.children}
      </Link>
    </Tooltip>
  );
}

export default HoverableLink;
