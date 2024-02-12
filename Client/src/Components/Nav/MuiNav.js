import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import $ from "jquery";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useContext } from "react";
import VerifyLogin from "../../Pages/Login/VerifyLogin";
import {
  ConsumeableContext,
  InitialContext,
} from "../Body/UserContext/UserContext";
import { useEffect } from "react";
import axios from "axios";
import BusinessLogo from "../../Components/ICONS/BusinessJS/businessBlack.svg";
import HelpLogo from "../../Components/ICONS/BusinessJS/SupportBlack.svg";
import ProfileLogo from "../../Components/ICONS/BusinessJS/ProfileBlack.svg";
import "./Nav.css";
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function NavBar() {
  let hundleNavigationBar = (e) => {
    console.log(e.target);
    $(".Lists").removeClass("activeNav");
    $(e.currentTarget).addClass("activeNav");
  };
  const savedContext = ConsumeableContext();
  const { ownersName, setownersName } = savedContext;
  console.log(savedContext);
  let serverAddress = localStorage.getItem("targetUrl");
  let navigate = useNavigate();
  let savedToken = localStorage.getItem("storeToken");

  useEffect(() => {
    let verify = VerifyLogin();
    verify.then((res) => {
      if (!res) {
        navigate("/login");
      }
    });
  }, []);
  return (
    <div className="NavBar">
      <Box sx={{}}>
        <AppBar position="static" sx={{ backgroundColor: "#fff" }}>
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "block", sm: "block" } }}
            >
              <div className="navLinks">
                <Link
                  onClick={hundleNavigationBar}
                  className="Lists"
                  to="/Business"
                >
                  <div className="logoAndTitleWrapper">
                    <img className="listImg" src={BusinessLogo} />
                    <span>Business</span>
                  </div>
                </Link>
                <Link
                  onClick={hundleNavigationBar}
                  className="Lists"
                  to="/help"
                >
                  <div className="logoAndTitleWrapper">
                    <img className="listImg" src={HelpLogo} />
                    <span>Help</span>
                  </div>
                </Link>
                <Link
                  onClick={hundleNavigationBar}
                  className="Lists ownerName"
                  to="/Profiles"
                >
                  <div className={"logoAndTitleWrapper"}>
                    <img className="listImg" src={ProfileLogo} />
                    <span>Profile</span>
                  </div>
                </Link>
              </div>
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}
