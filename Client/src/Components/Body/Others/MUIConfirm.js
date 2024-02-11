// import React, { useState } from "react";
// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   TextField,
// } from "@mui/material";
// import { ButtonProcessing } from "../../utility/Utility";
// import DeleteBusiness from "../Business/DeleteBusiness";
// import UpdateBusinesssName from "../Business/UpdateBusinesssName";
// import { RemoveMyEmployeersBusiness } from "../Business/Business/__Business";
// import { ConsumeableContext } from "../UserContext/UserContext";
// function MUIConfirm({
//   Action,
//   open,
//   setOpen,
//   targetdBusiness,
//   ShowSuccessError,
//   setSuccessError,
//   DialogMessage,
//   setConfirmDelete,
//   ConfirmDelete,
// }) {
//   const { Proccessing, setProccessing } = ConsumeableContext();
//   let [userPassword, setUserPassword] = useState();
//   const handleClose = async (confirmed) => {
//     setSuccessError({});
//     let { businessId, businessName, getBusiness } = targetdBusiness;
//     // setOpen({ ...open, open: false });

//     if (confirmed) {
//       if (Action == "deleteProducts") {
//         setConfirmDelete({ ...ConfirmDelete, userPassword, Verify: true });
//       } else if (Action == "deleteCosts") {
//         setConfirmDelete({ ...ConfirmDelete, Verify: true, userPassword });
//       } else if (Action == "deleteBusiness") {
//         // Handle confirmed action here
//         let responce = await DeleteBusiness(
//           businessId,
//           businessName,
//           getBusiness,
//           userPassword,
//           setOpen,
//           setProccessing
//         );
//         if (responce == "deletedWell")
//           setSuccessError({
//             ...ShowSuccessError,
//             show: true,
//             message: "SUCCESS",
//           });
//         else
//           setSuccessError({
//             ...ShowSuccessError,
//             show: true,
//             message: responce,
//           });
//       } else if (Action == "RemoveEmployerBusiness") {
//         console.log("targetdBusiness", targetdBusiness);
//         const { ownerId, getBusiness } = targetdBusiness;
//         let responce = await RemoveMyEmployeersBusiness(
//           businessId,
//           ownerId,
//           businessName,
//           getBusiness
//         );
//         if (responce.data.data == "NoDataLikeThis") {
//           console.log("nodata");
//           getBusiness();
//           return;
//         }
//         let affectedRows = responce.data.data[0].affectedRows;
//         console.log("affectedRows ==", affectedRows);
//         if (affectedRows > 0) {
//           getBusiness();
//           setSuccessError({
//             ...ShowSuccessError,
//             show: true,
//             message: "SUCCESS",
//           });
//         }
//         console.log(responce);
//       }
//     }
//     // setSuccessError({});
//     // setOpen(false);
//   };

//   return (
//     <div>
//       <Dialog open={open.open}>
//         <DialogTitle>Confirm Action</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to {DialogMessage}?
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <form
//             style={{
//               width: "80%",
//               margin: "auto",
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//             onSubmit={(e) => {
//               e.preventDefault();
//               handleClose(true);
//             }}
//           >
//             <TextField
//               type="password"
//               value={userPassword}
//               onChange={(e) => setUserPassword(e.target.value)}
//               fullWidth
//               required
//               label={"Enter Password to verify"}
//             />
//             <br />
//             {!Proccessing ? (
//               <div>
//                 <Button
//                   color="error"
//                   variant="contained"
//                   onClick={() => setOpen(false)}
//                 >
//                   Cancel
//                 </Button>
//                 &nbsp; &nbsp; &nbsp;
//                 <Button variant="contained" type="submit">
//                   Confirm
//                 </Button>
//               </div>
//             ) : (
//               <ButtonProcessing />
//             )}
//             <br />
//           </form>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }

// export default MUIConfirm;
import React from "react";

function MUIConfirm() {
  return <div>MUIConfirm</div>;
}

export default MUIConfirm;
