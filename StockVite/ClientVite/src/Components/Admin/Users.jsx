import { Table, TableCell, TableRow } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

function Users() {
  let token = localStorage.getItem("storeToken");
  let serverAddress = localStorage.getItem("targetUrl");

  useEffect(() => {
    getUsers();
  }, []);
  const [Users, setUsers] = useState([]);
  let getUsers = async () => {
    // alert(serverAddress);
    try {
      let Users = await axios.get(serverAddress + "admin/admin__getUsers", {});

      setUsers(Users.data.data);
    } catch (error) {}
  };

  return (
    <div>
      <Table>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Phone</TableCell>
        </TableRow>
        {Users.map((User, index) => (
          <TableRow key={"User_" + index}>
            <TableCell>{User.employeeName}</TableCell>
            <TableCell>{User.phoneNumber}</TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  );
}

export default Users;
