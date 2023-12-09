import "./App.css";
import Transaction from "./Components/Body/Transaction/Transaction";
import Report from "./Components/Body/Report/Report";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./Components/Body/Profile/Profile";
import AddExpencesTransaction from "./Components/Body/Business/AddExpencesTransaction";
import Business from "./Components/Body/Business/Business";
import Login from "./Components/Body/Login/Login";
import Register from "./Components/Body/Register/Register";
import OpenBusiness from "./Components/Body/Business/OpenBusiness";
import AddTransaction from "./Components/Body/Business/addTransaction";
import SearchProducts from "./Components/Body/Business/SearchManager";
import AddItems from "./Components/Body/Business/AddItems";
import Employee from "./Components/Body/AddEmployee/Employee";
import OpenEmployeersBusiness from "./Components/Body/Business/OpenEmployeersBusiness";
import RegisterEmployersProducts from "./Components/Body/Business/RegisterEmployersProducts";
import Help from "./Components/Hepl/Help";
import AddSingleSales from "./Components/Body/Business/AddSingleSales";
import AddTotalSales from "./Components/Body/Business/AddTotalSales";

import AddSalesTransaction from "./Components/Body/Business/AddSalesTransaction";
import NavBar from "./Components/Nav/MuiNav";
import ForgetPassword from "./Components/Body/ForgetPassword/ForgetPassword";
import OpenBusinessHome from "./Components/Body/Business/OpenBusinessHome";
import Admin from "./Components/Admin/Admin";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/OpenEmployeersBusiness"
            element={<OpenEmployeersBusiness />}
          >
            <Route path="Register" element={<RegisterEmployersProducts />} />
            <Route path="view" element={<Transaction />} />
            {/* <Route path="Search" element={<SearchProducts />} /> */}
          </Route>

          <Route path="/admin" element={<Admin />} />
          <Route
            path="/Transaction"
            element={
              <>
                <Transaction />
              </>
            }
          />
          <Route
            path="/forgetPaassword"
            element={
              <>
                <ForgetPassword />
              </>
            }
          />
          <Route
            path="/Employee"
            element={
              <>
                <Employee />
              </>
            }
          />
          <Route
            path="/Reports"
            element={
              <>
                <Report />
              </>
            }
          />
          <Route
            path="/Profiles"
            element={
              <>
                {window.innerWidth < 768 && <NavBar />}
                <Profile />
              </>
            }
          />
          <Route
            path="/Business"
            element={
              <>
                {window.innerWidth < 768 && <NavBar />}
                <Business />
              </>
            }
          />
          <Route
            path="/help"
            element={
              <>
                {window.innerWidth < 768 && <NavBar />}
                <Help />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Login />
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <Register />
              </>
            }
          />
          <Route
            path="/"
            element={
              <>
                {window.innerWidth < 768 && <NavBar />}
                <Business />
              </>
            }
          />

          <Route path="/OpenBusiness" element={<OpenBusiness />}>
            <Route path="" element={<OpenBusinessHome />} />

            <Route path="additems" element={<AddItems />} />
            <Route path="search" element={<SearchProducts />} />
            <Route path="view" element={<Transaction />} />
            <Route path="Employee" element={<Employee />} />

            <Route path="addTransaction" element={<AddTransaction />}>
              <Route
                path="AddSalesTranaction"
                element={<AddSalesTransaction />}
              >
                <Route path="addSingleSales" element={<AddSingleSales />} />
                <Route path="addTotalSales" element={<AddTotalSales />} />
              </Route>
              <Route
                path="AddCostTransaction"
                element={<AddExpencesTransaction />}
              ></Route>{" "}
            </Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}
export default App;
