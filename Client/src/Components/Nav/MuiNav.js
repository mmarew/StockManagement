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
import { InitialContext } from "../Body/UserContext/UserContext";
import { useEffect } from "react";
import axios from "axios";

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
    $(".Lists").removeClass("active");
    $(e.target).addClass("active");
  };
  const savedContext = useContext(InitialContext);
  const [ownersName, setownersName] = savedContext;
  console.log(savedContext);
  let serverAddress = localStorage.getItem("targetUrl");
  let navigate = useNavigate();
  let savedToken = localStorage.getItem("storeToken");
  let VerifyLogin = async () => {
    console.log("savedStore ===== " + savedToken);
    if (savedToken == null || savedToken == "") {
      navigate("/login");
      return;
    }
    let response = await axios.post(serverAddress + "verifyLogin/", {
      token: savedToken,
    });
    if (response.data.data == "alreadyConnected") {
      let employeeName = response.data.result[0].employeeName;
      employeeName = employeeName.split(" ")[0];
      setownersName(employeeName);
      // navigate("/");
    } else {
      Navigate("/Login");
    }
  };
  useEffect(() => {
    VerifyLogin();
  }, []);
  return (
    <>
      <div className="navBar">
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              {/* <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton> */}
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
                    Business
                  </Link>
                  <Link
                    onClick={hundleNavigationBar}
                    className="Lists"
                    to="/help"
                  >
                    Help
                  </Link>
                  <Link
                    onClick={hundleNavigationBar}
                    className="Lists ownerName"
                    to="/Profiles"
                  >
                    Profile
                  </Link>
                </div>
              </Typography>
              {/* <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search> */}
            </Toolbar>
          </AppBar>
        </Box>
      </div>
    </>
  );
}
