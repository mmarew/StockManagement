const { getCreditList } = require("../Services/credit.service");
const getCreditListFromService = (request, response) => {
  const { businessId, fromDate, toDate } = request.body;
  getCreditList(request).then((data) => {
    response.json(data);
  });
};
module.exports.getCreditList = getCreditListFromService;
