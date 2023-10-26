export default function currentDates() {
  let date = new Date();
  let year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate();
  console.log(month.length);
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  let currentDate = year + "-" + month + "-" + day;
  // let satedDate = $("#dateId").val();
  // console.log("satedDate is = " + satedDate);
  // if (satedDate == "") {
  //   $("#dateId").val(currentDate);
  //   satedDate = currentDate;
  // }
  console.log(currentDate);
  return currentDate;
}
export function DateFormatter(dateTimeString, timeZone) {
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
  if (formattedDate == "1970-01-01") {
    formattedDate = " - - - ";
  }
  return formattedDate;
}
