import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "@mui/material";
import { DateFormatter } from "../Body/Date/currentDate";
import { getCollectedMoney } from "../CreditMGMT/GetCreditLists";
import CurrencyFormatter from "../Utilities/Utility";
const headers = {
  dailySales: [
    { label: "NO", key: "NO" },
    { label: "product Name", key: "productName" },
    { label: "Registration Date", key: "productRegistrationDate" },
    { label: "purchased Qty", key: "purchaseQty" },
    { label: " Unit Cost", key: "productsUnitCost" },
    { label: "Total Cost", key: "totalCost" },
    { label: "Unit Price", key: "unitPrice" },
    { label: "Sales Qty", key: "salesQty" },
    { label: "Sales in money", key: "salesInMoney" },
    { label: "Credits ales Qty", key: "creditsalesQty" },
    { label: "Sales Type Values", key: "salesTypeValues" },
    { label: "Credit Payment Date", key: "creditPaymentDate" },
    { label: "Registered by", key: "employeeName" },
    { label: "Description", key: "Description" },
  ],
  creditsales: [
    { label: "NO", key: "NO" },
    { label: "Product Name", key: "productName" },
    { label: "Description", key: "Description" },
    { label: "Registered Time ", key: "registeredTimeDaily" },
    { label: "Registration Date", key: "productRegistrationDate" },
    { label: "Unit Price", key: "unitPrice" },

    {
      label: "Credit Sales Qty",
      key: "creditsalesQty",
    },
    { label: "Total Money", key: "TotalMoney" },
    { label: "Collected Money", key: "collectedMoney" },
    { label: "To Be collected", key: "ToBeCollected" },
  ],
  searchedProducts: [
    { label: "No", key: "NO" },
    { label: "Product Name", key: "productName" },
    { label: "Unit Cost", key: "productsUnitCost" },
    { label: "Unit Price", key: "productsUnitPrice" },
    { label: "Registration Date", key: "productRegistrationDate" },
  ],

  searchedExpences: [
    { label: "NO", key: "NO" },
    { label: "Expences Name", key: "costName" },
    { label: "Registration Date", key: "expItemRegistrationDate" },
    { label: "Registered By", key: "employeeName" },
  ],

  expencesTransactions: [
    { label: "NO", key: "NO" },
    { label: "Expences Name", key: "costName" },
    { label: "Expences Amount", key: "costAmount" },
    { label: "Expences Description", key: "costDescription" },

    { label: "Registeration Date", key: "costRegisteredDate" },
  ],
};
const ExportToExcel = ({ data, target }) => {
  const exportToExcel = () => {
    let headerLabels = headers[target]?.map((header) => header.label);
    let dataValues = [];
    if (target == "expencesTransactions") {
      dataValues = data?.map((item, i) => {
        return headers[target]?.map((header, index) => {
          if (header.key == "NO") {
            return index + i + 1;
          } else if (header.key == "costRegisteredDate") {
            return DateFormatter(item[header.key]);
          }
          return item[header.key];
        });
      });
    } else if (target == `searchedProducts`) {
      dataValues = data?.map((item, i) => {
        return headers[target]?.map((header, index) => {
          if (header.key == "NO") return index + i + 1;
          else if (header.key == "productRegistrationDate")
            return DateFormatter(item[header.key]);
          return item[header.key];
        });
      });
    } else if (target == "creditsales") {
      dataValues = data.soldInDaily_SoldOncredits.map((item, i) => {
        return headers[target]?.map((header, index) => {
          if (header.key == "ToBeCollected") {
            return CurrencyFormatter(
              Number(item.unitPrice) * Number(item.creditsalesQty) -
                getCollectedMoney(item, "Single", data.partiallyPaidInTotal)
            );
          } else if (header.key == "collectedMoney") {
            return CurrencyFormatter(
              getCollectedMoney(item, "Single", data.partiallyPaidInTotal)
            );
          } else if (header.key == "TotalMoney") {
            return CurrencyFormatter(
              Number(item.unitPrice) * Number(item.creditsalesQty)
            );
          } else if (
            header.key == "registeredTimeDaily" ||
            header.key == "productRegistrationDate"
          ) {
            return DateFormatter(item[header.key]);
          } else if (header.key == "NO") {
            return i + index + 1;
          }
          return item[header.key];
        });
      });
    } else if (target == "dailySales") {
      dataValues = data.map((item, i) => {
        return headers[target]?.map((header, index) => {
          if (header.key == "NO") {
            return i + index + 1;
          } else if (
            header.key == "productRegistrationDate" ||
            header.key == "creditPaymentDate"
          ) {
            return DateFormatter(item[header.key]);
          } else if (header.key == "totalCost") {
            return Number(item.productsUnitCost) * Number(item.purchaseQty);
          } else if (header.key == "salesInMoney") {
            let { creditsalesQty, salesQty, unitPrice } = item;
            return (Number(creditsalesQty) + Number(salesQty)) * unitPrice;
          }
          return item[header.key];
        });
      });
    } else if (target == "searchedExpences") {
      dataValues = data.map((item, i) => {
        return headers[target]?.map((header, index) => {
          if (header.key == "NO") {
            return index + i + 1;
          } else if (header.key == "expItemRegistrationDate") {
            return DateFormatter(item[header.key]);
          }
          return item[header.key];
        });
      });
    }

    const worksheet = XLSX.utils.aoa_to_sheet([headerLabels, ...dataValues]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const fileName = "data.xlsx";

    saveAs(dataBlob, fileName);
  };

  return <Button onClick={exportToExcel}>Export to Excel</Button>;
};

export default ExportToExcel;
