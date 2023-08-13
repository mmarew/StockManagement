function Localstorage() {
  let setLocalStorage = (targetItem, targetValue) => {
      localStorage.setItem(targetItem, targetValue);
    },
    getLocalStorage = (targetItem) => {
      localStorage.getItem(targetItem);
    };
  // setLocalStorage("targetUrl", "https://mar.masetawosha.com/");
  setLocalStorage("targetUrl", "http://localhost:2020/");
  return [setLocalStorage, getLocalStorage];
}
export default Localstorage;
