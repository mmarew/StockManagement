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

export default currentDates;
