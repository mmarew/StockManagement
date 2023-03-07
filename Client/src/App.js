import "./App.css";
import Transaction from "./Components/Body/Transaction/Transaction";
import Report from "./Components/Body/Report/Report";
import Nav from "./Components/Nav/Nav";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Profile from "./Components/Body/Profile/Profile";
import Business from "./Components/Body/Business/Business";
import Login from "./Components/Body/Login/Login";
import Register from "./Components/Body/Register/Register";
import OpenBusiness from "./Components/Body/Business/OpenBusiness";
import AddTransaction from "./Components/Body/Business/addTransaction";
import SearchProducts from "./Components/Body/Business/SearchProducts";
import AddItems from "./Components/Body/Business/AddItems";
import Employee from "./Components/Body/AddEmployee/Employee";
import OpenEmployeersBusiness from "./Components/Body/Business/OpenEmployeersBusiness";
import RegisterEmployersProducts from "./Components/Body/Business/RegisterEmployersProducts";
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
            <Route path="view" element={<SearchProducts />} />
            <Route path="Search" element={<Transaction />} />
          </Route>
          <Route
            path="/Transaction"
            element={
              <>
                <Nav />
                <Transaction />
              </>
            }
          />
          <Route
            path="/Employee"
            element={
              <>
                <Nav />
                <Employee />
              </>
            }
          />
          <Route
            path="/Reports"
            element={
              <>
                <Nav />
                <Report />
              </>
            }
          />
          <Route
            path="/Profiles"
            element={
              <>
                <Nav />
                <Profile />
              </>
            }
          />
          <Route
            path="/Business"
            element={
              <>
                <Nav />
                <Business />
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
                <Nav />
                <Business />
              </>
            }
          />
          <Route path="/OpenBusiness" element={<OpenBusiness />}>
            <Route path="additems" element={<AddItems />} />
            <Route path="search" element={<SearchProducts />} />
            <Route path="view" element={<Transaction />} />
            <Route path="Employee" element={<Employee />} />
            <Route
              path="/OpenBusiness/addTransaction"
              element={<AddTransaction />}
            />
          </Route>
        </Routes>
        {/* <Routes>
  <Route path="/" element={<Dashboard />}>
    <Route
      path="messages"
      element={<DashboardMessages />}
    />
    <Route path="tasks" element={<DashboardTasks />} />
  </Route>
  <Route path="about" element={<AboutPage />} />
</Routes> */}
      </Router>
    </div>
  );
}
export default App;
