import React from "react";

function ErrorHandler(error, setErrorsOrSuccess) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (error.response.status === 404) {
      // Not found error
      setErrorsOrSuccess({
        Message: "Not Found",
        Detail: "The resource you are looking for could not be found.",
      });
    } else {
      // Other HTTP errors
      setErrorsOrSuccess({
        Message: "HTTP Error",
        Detail: `Status: ${error.response.status}, ${error.response.statusText}`,
      });
    }
  } else if (error.request) {
    // The request was made but no response was received
    setErrorsOrSuccess({
      Message: "Connection Error",
      Detail: "Unable to connect to the server.",
    });
  } else {
    // Something happened in setting up the request that triggered an Error
    setErrorsOrSuccess({
      Message: "Request Error",
      Detail: error.message,
    });
  }
}

export default ErrorHandler;
