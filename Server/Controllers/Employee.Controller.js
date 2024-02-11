const {
  getBusinessEmployee,
  addEmployee,
  removeEmployees,
  searchEmployee,
} = require("../Services/Employee.service");

let getBusinessEmployeeController = async (req, res) => {
  let responces = await getBusinessEmployee(req.body);
  res.json(responces);
};
// addEmployee, removeEmployees;
const addEmployeeController = async (req, res) => {
  let Results = await addEmployee(req.body);
  res.json(Results);
};
const removeEmployeesController = async (req, res) => {
  // console.log("req.body", req.body);
  Results = await removeEmployees(req.body);
  res.json(Results);
};
let searchEmployeeController = async (req, res) => {
  Results = await searchEmployee(req.body);
  res.json(Results);
};
module.exports = {
  getBusinessEmployeeController,
  searchEmployeeController,
  addEmployeeController,
  removeEmployeesController,
};
