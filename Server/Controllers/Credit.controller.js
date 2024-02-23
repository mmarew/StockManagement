const serviceData = require("../Services/credit.service");
const getCreditListFromService = (request, response) => {
  const { businessId, fromDate, toDate } = request.body;
  serviceData.getCreditList(request).then((data) => {
    response.json(data);
  });
};
const updatePartiallyPaidInfo = (request, response) => {
  let Results = serviceData.updatePartiallyPaidInfo(request.body);
  let { Type } = Results;
  if (Type === "error") return response.status(500).json(Results);

  response.json(Results);
};
const confirmPayments = (request, response) => {
  let Results = serviceData.confirmPayments(request.body);
  let { Type } = Results;
  if (Type === "error") return response.status(500).json(Results);
  response.json(Results);
};
module.exports = {
  confirmPayments,
  getCreditList: getCreditListFromService,
  updatePartiallyPaidInfo,
};
