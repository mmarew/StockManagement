import React, { useEffect, useState } from "react";
import "./SearchProducts.css";
import { Button, LinearProgress, TableContainer } from "@mui/material";
import ExportToExcel from "../PDF_EXCEL/PDF_EXCEL";
import EditProducts from "./EditProducts";
import DetailedProducts from "./DetailedProducts";
import DeleteProducts from "./DeleteProducts";
import fetchProducts from "./fetchProducts";
import { ConsumeableContext } from "../Body/UserContext/UserContext";
import { DateFormatter } from "../Body/Date/currentDate";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
function SearchProducts({ InputValue, setSearchTypeValueError }) {
  const { setProcessing } = ConsumeableContext();
  const [ConfirmDelete, setConfirmDelete] = useState({ Verify: false });
  let openedBusiness = localStorage.getItem("openedBusiness");
  const [loadingStatus, setLoadingStatus] = useState("waiting ..... ");
  const [ViewPdoductInfo, setViewPdoductInfo] = useState({
    Open: false,
    Product: {
      productName: "",
      productsUnitPrice: "",
      productsUnitCost: "",
      minimumQty: "",
    },
  });
  const [openEditerModal, setOpenEditerModal] = useState({ open: false });

  const [searchedProducts, setSearchedProducts] = useState([]);
  let callToFetchProducts = async () => {
    setSearchTypeValueError(null);
    setSearchedProducts([]);
    setLoadingStatus("waiting ..... ");
    let Results = await fetchProducts();
    setLoadingStatus("Done");
    setProcessing(false);
    console.log("Results", Results);
    let { Message, data } = Results;
    if (Message == "Success") {
      setSearchedProducts(data);
      if (data.length == 0) {
        // setSearchTypeValueError("you haven't registered products.");
      }
    } else if (Message == "Fail") {
      return setSearchTypeValueError(data);
    } else {
      return setSearchTypeValueError("unknown error");
    }
  };
  useEffect(() => {
    callToFetchProducts();
  }, [, InputValue]);

  return (
    <>
      <div className={"productListWrapper"}>
        {searchedProducts?.length > 0 ? (
          <>
            <ExportToExcel
              data={searchedProducts}
              target={"searchedProducts"}
            />

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Registered Date</TableCell>
                    {openedBusiness === "myBusiness" && (
                      <TableCell>Actions</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchedProducts.map((product, index) => (
                    <TableRow key={"searchedProducts_" + index}>
                      <TableCell>{product.productName}</TableCell>
                      <TableCell>
                        {DateFormatter(product.productRegistrationDate)}
                      </TableCell>
                      {openedBusiness === "myBusiness" && (
                        <TableCell sx={{ display: "flex" }}>
                          <Button
                            onClick={(e) => {
                              setOpenEditerModal({ open: true, item: product });
                            }}
                            variant="outlined"
                            color="primary"
                          >
                            Edit
                          </Button>
                          <Button
                            sx={{ margin: "0 10px" }}
                            onClick={(e) =>
                              setConfirmDelete(() => ({
                                Verify: true,
                                item: product,
                              }))
                            }
                            variant="outlined"
                            color="error"
                          >
                            Delete
                          </Button>

                          <Button
                            sx={{ width: "150px" }}
                            onClick={() => {
                              setViewPdoductInfo((prev) => {
                                return {
                                  ...prev,
                                  Open: true,
                                  Product: product,
                                };
                              });
                            }}
                            variant="outlined"
                          >
                            View Details
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : (
          loadingStatus == "Done" && (
            <div style={{ color: "red", padding: "0 20px" }}>
              No products found
            </div>
          )
        )}
        {ViewPdoductInfo.Open && (
          <DetailedProducts
            data={{
              ViewPdoductInfo,
              setViewPdoductInfo,
              fetchProducts: callToFetchProducts,
            }}
          />
        )}
        {openEditerModal.open && (
          <EditProducts
            data={{
              openEditerModal,
              setOpenEditerModal,
              fetchProducts: callToFetchProducts,
            }}
          />
        )}
        {ConfirmDelete.Verify && (
          <DeleteProducts
            data={{
              ConfirmDelete,
              setConfirmDelete,
              fetchProducts: callToFetchProducts,
            }}
          />
        )}
        {loadingStatus !== "Done" && (
          <h3
            style={{
              width: "100%",
              display: "flex",
              gap: "20px",
              flexDirection: "column",
            }}
          >
            <LinearProgress />
          </h3>
        )}
      </div>
    </>
  );
}
export default SearchProducts;
