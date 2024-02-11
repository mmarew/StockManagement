function NameValidators(Values, setBusinessNameError) {
  //  e.target.value;

  let filteredName = Values.replace(/[^a-zA-Z0-9_ ]/g, "");

  if (filteredName != Values) {
    setBusinessNameError(`Business name must be from a-z , 0-9 and space only`);
    return "wrong naming rule";
  }
  setBusinessNameError(null);
}

export default NameValidators;
