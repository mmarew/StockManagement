function DateFormatter(dateTimeString, timeZone) {
  console.log("dateTimeString==", new Date(dateTimeString));
  let date = new Date(dateTimeString);
  let Year = date.getFullYear();
  let Month = date.getMonth();
  let Day = date.getDate();

  let formattedDate =
    Year +
    "-" +
    (Month + 1).toString().padStart(2, "0") +
    "-" +
    Day.toString().padStart(2, "0");

  console.log("formattedDate", formattedDate);

  return formattedDate;
}

module.exports.DateFormatter = DateFormatter;
// export default DateFormatter;
