const { getExpensesLists } = require("../Services/Expences.service");
let getExpensesListsController = async (req, res) => {
  let result = await getExpensesLists(req.query, req.body);
  res.json(result);
};
module.exports = { getExpensesListsController };
