import * as React from "react";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";

const BadgeIcons = () => {
  return (
    <Badge badgeContent={4} color="primary">
      <MailIcon />
    </Badge>
  );
};
export default BadgeIcons;
