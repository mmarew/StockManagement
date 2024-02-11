import React from "react";
import AddExpencesTransaction from "../Expences/AddExpencesTransaction";
import AddTotalSales from "../Transaction/AddTrans/AddTotalSales";
function RegisterEmployersProducts() {
  return (
    <>
      <AddTotalSales />
      <br /> <br />
      <h3>Cost Transaction</h3>
      <br />
      <AddExpencesTransaction />
    </>
  );
  // const [tranactionProducts, setTranactionProducts] = useState({});
  // const [EmployeersProduct, setEmployeersProduct] = useState([]);
  // let getMyEmployersProductsAndCosts = async () => {
  //   let businessId = localStorage.getItem("businessId"),
  //     businessName = localStorage.getItem("businessName"),
  //     businessOwnerId = localStorage.getItem("businessOwnreId");
  //   let responcse = await axios.post(
  //     "http://localhost:2020/getRegisteredProducts",
  //     {
  //       businessName,
  //       businessId,
  //       businessOwnerId,
  //     }
  //   );
  //   let datas = responcse.data.data;
  //   setEmployeersProduct(datas);
  // };
  // let collectProductInputs = (e) => {
  //   console.log(e.target.value);
  //   let targetId = e.target.className;
  //   console.log(targetId);
  //   setTranactionProducts({
  //     ...tranactionProducts,
  //     [e.target.id]: e.target.value,
  //   });
  // };
  // let submitToserver = async (e) => {
  //   e.preventDefault();
  //   let responces = await axios.post(
  //     "http://localhost:2020/registerEmployeersProducts",
  //     {
  //       tranactionProducts,
  //       EmployeersProduct,
  //     }
  //   );
  //   console.log(responces.data.data);
  // };
  // useEffect(() => {
  //   let Dates = currentDates();
  //   console.log(Dates);
  //   $("#dateToRegisterEmployeersBusiness").val(Dates);
  //   getMyEmployersProductsAndCosts();
  // }, []);
  // return (
  //   <div>
  //     <form onSubmit={submitToserver} action="" id="registerEmployeersProducts">
  //       <input type="Date" id="dateToRegisterEmployeersBusiness" />
  //       {EmployeersProduct?.map((items) => {
  //         console.log(items);
  //         return (
  //           <div key={items.ProductId}>
  //             {/* {console.log(products)} */}
  //             <h4>{items.productName}</h4>
  //             <input
  //               required
  //               className={items.ProductId}
  //               onInput={collectProductInputs}
  //               id={"purchase_" + items.ProductId}
  //               placeholder="purchase qty"
  //             />
  //             {/*{(purchase_, sales_, Wrickage_)}*/}
  //             <input
  //               required
  //               className={items.ProductId}
  //               id={"sales_" + items.ProductId}
  //               onInput={collectProductInputs}
  //               placeholder="sales qty"
  //             />
  //             <input
  //               required
  //               className={items.ProductId}
  //               onInput={collectProductInputs}
  //               id={"Wrickage_" + items.ProductId}
  //               placeholder="Wrickage qty"
  //             />
  //             <button type="submit">Submit</button>
  //           </div>
  //         );
  //       })}
  //     </form>
  //   </div>
  // );
}
export default RegisterEmployersProducts;
