import React from "react";
import { jwtDecode } from "jwt-decode";
function DecodeJWT(token) {
  //   const token = "your_jwt_token_here";
  const decoded = jwtDecode(token);
  return decoded;
}

export default DecodeJWT;
