import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import $ from "jquery";
import Typography from "@mui/material/Typography";
import { Link, useNavigate } from "react-router-dom";
import VerifyLogin from "../../Pages/VerifyLogin";
import { ConsumeableContext } from "../Body/UserContext/UserContext";
import { useEffect } from "react";
import BusinessLogo from "../../Components/ICONS/BusinessJS/businessBlack.svg";
import HelpLogo from "../../Components/ICONS/BusinessJS/SupportBlack.svg";
import ProfileLogo from "../../Components/ICONS/BusinessJS/ProfileBlack.svg";
import "./Nav.css";

export default function NavBar() {
  let hundleNavigationBar = (e) => {
    $(".Lists").removeClass("activeNav");
    $(e.currentTarget).addClass("activeNav");
  };
  const savedContext = ConsumeableContext();
  const { ownersName, setownersName } = savedContext;
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
