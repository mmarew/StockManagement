const {
  getBusinessEmployeeController,
  searchEmployeeController,
  addEmployeeController,
  removeEmployeesController,
} = require("../Controllers/Employee.Controller");
const { authMiddleware, authMiddleware2 } = require("../middleware/Auth");

let Router = require("express").Router();
Router.post(
  "/getBusinessEmployee",
  authMiddleware,
  getBusinessEmployeeController
);
Router.post("/searchEmployee/", authMiddleware, searchEmployeeController);
Router.post("/addEmployee/", authMiddleware, addEmployeeController);
Router.post(
  "/removeEmployees/",
  authMiddleware,
  authMiddleware2,
  removeEmployeesController
);
// Router.get("/");
// addEmployee, removeEmployees; addEmployeeController,
//   removeEmployeesController,
module.exports = Router;
