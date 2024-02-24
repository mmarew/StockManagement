import axios from "axios";
let serverAddress = localStorage.getItem("targetUrl");
let businessId = localStorage.getItem("businessId");
let token = localStorage.getItem("storeToken");
let fetchProducts = async () => {
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
