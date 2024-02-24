let myEnv = import.meta.env;
function Localstorage() {
  let setLocalStorage = (targetItem, targetValue) => {
      localStorage.setItem(targetItem, targetValue);
    },
    getLocalStorage = (targetItem) => {
      localStorage.getItem(targetItem);
    };

  setLocalStorage("targetUrl", myEnv.VITE_APP_targetUrl);
  return [setLocalStorage, getLocalStorage];
}
export default Localstorage;
