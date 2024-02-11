import React from "react";
import { jwtDecode } from "jwt-decode";
function DecodeJWT(token) {
  //   const token = "your_jwt_token_here";
  const decoded = jwtDecode(token);
  console.log(decoded); // Output the decoded payload to the console or use it as needed
  return decoded;
}

export default DecodeJWT;
