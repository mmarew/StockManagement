function DateFormatter(dateTimeString) {
  const date = new Date(dateTimeString);
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  const formattedDate = date
    .toLocaleDateString("en-US", options)
    .split("/")
    .reverse()
    .join("-");
  console.log(formattedDate);
  return formattedDate;
}
module.exports.DateFormatter = DateFormatter;
// export default DateFormatter;
