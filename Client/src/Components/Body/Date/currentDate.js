function currentDates() {
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
export let DateFormatter = (dateTimeString) => {
  // const dateTimeString = "2023-08-05T21:00:00.000Z";
  const date = new Date(dateTimeString);
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  const formattedDate = date.toLocaleDateString("en-US", options);
  return formattedDate;
  console.log(formattedDate);
};

export default currentDates;
