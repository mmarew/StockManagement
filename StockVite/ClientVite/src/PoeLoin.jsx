import React from "react";
import { Button, TextField } from "@mui/material";

function AppPOE() {
  return (
    <div>
      <TextField label="Username" />
      <TextField label="Password" type="password" />
      <Button variant="contained" color="primary">
        Log In
      </Button>
    </div>
  );
}

export default AppPOE;
function SignUpForm() {
  const [values, setValues] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <form style={{ width: "200px", margin: "auto" }} onSubmit={handleSubmit}>
      <TextField
        label="First Name"
        value={values.firstName}
        onChange={handleChange("firstName")}
        margin="normal"
        required
        fullWidth
      />
      <TextField
        label="Last Name"
        value={values.lastName}
        onChange={handleChange("lastName")}
        margin="normal"
        required
        fullWidth
      />
      <TextField
        label="Email"
        type="email"
        value={values.email}
        onChange={handleChange("email")}
        margin="normal"
        required
        fullWidth
      />
      <TextField
        label="Password"
        type="password"
        value={values.password}
        onChange={handleChange("password")}
        margin="normal"
        required
        fullWidth
      />
      <TextField
        label="Confirm Password"
        type="password"
        value={values.confirmPassword}
        onChange={handleChange("confirmPassword")}
        margin="normal"
        required
        fullWidth
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Sign Up
      </Button>
    </form>
  );
}

export { SignUpForm };
