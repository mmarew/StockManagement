// import {
//   TableContainer,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   colors,
//   Box,
// } from "@mui/material";
// import axios from "axios";
// import React, { useEffect, useState } from "react";

// import { DateFormatter } from "../Date/currentDate";
// import { ConsumeableContext } from "../UserContext/UserContext";

// function CheckIfUnreportedData({ Notifications }) {
//   let { numberOfNotifications, setNumberOfNotifications } = Notifications;
//   let { setShowProgressBar, setProccessing } = ConsumeableContext();

//   let serverAddress = localStorage.getItem("targetUrl");
//   const [unreportedData, setUnreportedData] = useState([]);

//   let BusinessId = localStorage.getItem("businessId");
//   let businessName = localStorage.getItem("businessName");

//   let getUnreportedDataToTotalSales = async () => {
//     setShowProgressBar(true);
//     let results = await axios.post(serverAddress + "CheckIfUnreportedData", {
//       BusinessId,
//       businessName,
//     });
//     setShowProgressBar(false);
//     console.log("results CheckIfUnreportedData", results.data.data);
//     setUnreportedData(results.data.data);
//   };

//   useEffect(() => {
//     getUnreportedDataToTotalSales();
//   }, []);
//   useEffect(() => {
//     setNumberOfNotifications((prev) => {
//       return { ...prev, Reports: unreportedData?.length };
//     });
//   }, [unreportedData]);

//   return (
//     <div>
//       {unreportedData?.length > 0 ? (
//         <Box>
//           <h5 style={{ color: "red" }}>
//             You have unreported data in your daily sales journal. please report
//             it first
//           </h5>
//           <TableContainer>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Product&nbsp;&nbsp;Name</TableCell>
//                   <TableCell sx={{ padding: "40px" }}>Date</TableCell>
//                   <TableCell>Price&nbsp;&nbsp;</TableCell>
//                   <TableCell>Sales&nbsp;&nbsp;Quantity</TableCell>
//                   <TableCell>Description&nbsp;&nbsp;&nbsp;</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {unreportedData?.map((data) => (
//                   <TableRow key={data.dailySalesId}>
//                     <TableCell>
//                       {JSON.parse(data.itemDetailInfo).productName}
//                     </TableCell>
//                     <TableCell>
//                       {" "}
//                       {DateFormatter(data.registeredTimeDaily)}
//                     </TableCell>
//                     <TableCell>
//                       {JSON.parse(data.itemDetailInfo).productsUnitPrice}
//                     </TableCell>
//                     <TableCell>{data.purchaseQty}</TableCell>
//                     <TableCell>{data.Description}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Box>
//       ) : (
//         <h4>You haven't unreported data </h4>
//       )}
//     </div>
//   );
// }

// export default CheckIfUnreportedData;
