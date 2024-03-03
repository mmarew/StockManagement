import axios from "axios";
let fetchProducts = async () => {
  let serverAddress = localStorage.getItem("targetUrl");
  let businessId = localStorage.getItem("businessId");
  let token = localStorage.getItem("storeToken");
  if (!token) return { Message: "Fail", data: "Login First" };
  if (!businessId) return { Message: "Fail", data: "Login First" };
  try {
    let response = await axios.get(serverAddress + "products/searchProducts", {
      params: { token, businessId },
    });
    let copy = [];
    let products = response.data.products;

    products?.map((each) => {
      each.updateMode = false;
      copy.push(each);
    });
    return { Message: "Success", data: copy };
  } catch (error) {
    return { Message: "Fail", data: error.message };
  }
};
export default fetchProducts;
