import "./App.css";
import Transaction from "./Components/Transaction/Transaction";
import Report from "./Components/Body/Report/Report";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./Components/Body/Profile/Profile";
import AddExpencesTransaction from "./Components/Expences/AddExpencesTransaction";
import Login from "./Pages/Login/Login";
import Register from "./Components/Body/Register/Register";
import AddTransaction from "./Components/Transaction/AddTrans/addTransaction";
import AddTotalSales from "./Components/Transaction/AddTrans/AddTotalSales";
import AddItems from "./Components/Products/AddItems";
import Employee from "./Components/Employee/Employee";
import Help from "./Components/Hepl/Help";
import OpenEmployeersBusiness from "./Components/OPEN/OpenEmployeersBusiness";
import AddSalesTransaction from "./Components/Transaction/AddTrans/AddSalesTransaction";
import NavBar from "./Components/Nav/MuiNav";
import ForgetPassword from "./Components/Body/ForgetPassword/ForgetPassword";
import OpenBusinessHome from "./Components/OPEN/OpenBusinessHome";
import Admin from "./Components/Admin/Admin";
import Business from "./Pages/Business";
import OpenBusiness from "./Components/OPEN/OpenBusiness";
import RegisterEmployersProducts from "./Components/Products/RegisterEmployersProducts";
import AddSingleSales from "./Components/Transaction/AddTrans/AddSingleSales";
import SearchManager from "./Components/Search/SearchManager";
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
            <Route path="additems" element={<AddItems />} />
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
