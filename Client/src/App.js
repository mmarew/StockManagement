import "./App.css";
import Transaction from "./Pages/Transaction";
import Report from "./Pages/Report";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./Pages/Profile";
import ExpencesTransaction from "./Components/Transaction/ExpencesTransaction";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import AddTransaction from "./Pages/OpenBusiness/AddTransaction/addTransaction";
import AddTotalSales from "./Pages/OpenBusiness/AddTransaction/AddTotalSales";
import Items from "./Pages/OpenBusiness/Items";
import Employee from "./Pages/Employee";
import Help from "./Pages/Help";
import AddSalesTransaction from "./Pages/OpenBusiness/AddTransaction/AddSalesTransaction";
import NavBar from "./Components/Nav/MuiNav";
import ForgetPassword from "./Pages/ForgetPassword";
import OpenBusinessHome from "./Pages/OpenBusinessHome";
import Admin from "./Pages/Admin";
import Business from "./Pages/Business";
import OpenBusiness from "./Pages/OpenBusiness/OpenBusiness";
import RegisterEmployersProducts from "./Pages/RegisterEmployersProducts";
import AddSingleSales from "./Pages/OpenBusiness/AddTransaction/AddSingleSales";
import SearchManager from "./Pages/OpenBusiness/SearchManager";
import OpenEmployeersBusiness from "./Pages/OpenEmployeersBusiness";
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
          <Route path="/login" element={<Login />} />
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
            <Route path="Items" element={<Items />} />
            <Route path="search" element={<SearchManager />} />
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
                path="ExpencesTransaction"
                element={<ExpencesTransaction />}
              ></Route>{" "}
            </Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}
export default App;
