import { useEffect } from "react";
import { validateShipping } from "./ShippingInfo";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Checkoutsteps from "./Checkoutsteps";

export default function ConfirmOrder() {
  const { shippingInfo, items } = useSelector((state) => state.cartState);
  const navigate = useNavigate();
  const { User } = useSelector((state) => state.authState);
  let itemprice = items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const shippingPrice = itemprice > 200 ? 0 : 25;
  let TaxPrice = Number(0.05 * itemprice);
  const totalprice = Number(itemprice + shippingPrice + TaxPrice).toFixed(2);
  itemprice = itemprice.toFixed(2);
  TaxPrice = Number(TaxPrice).toFixed(2);

  const processPayment = () => {
    const data = {
      itemprice,
      shippingPrice,
      TaxPrice,
      totalprice,
    };
    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    navigate("/payment");
  };

  useEffect(() => {
    validateShipping(shippingInfo, navigate);
  }, [navigate, shippingInfo]);
  return (
    <>
      <Checkoutsteps shipping={true} confirm={true} payment={false} />
      <div className="row d-flex justify-content-between">
        <div className="col-12 col-lg-8 mt-5 order-confirm">
          <h4 className="mb-3">Shipping Info</h4>
          <p>
            <b>Name:</b> {User.name}
          </p>
          <p>
            <b>Phone:</b> {shippingInfo.phoneNo}
          </p>
          <p className="mb-4">
            <b>Address:</b> {shippingInfo.address}, {shippingInfo.city}{" "}
            {shippingInfo.postalCode},{shippingInfo.State},{" "}
            {shippingInfo.country}{" "}
          </p>

          <hr />
          <h4 className="mt-4">Your Cart Items:</h4>

          <hr />
          <div className="cart-item my-1">
            {items.map((item, i) => (
              <div className="row" key={i}>
                <div className="col-4 col-lg-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    height="45"
                    width="65"
                  />
                </div>

                <div className="col-5 col-lg-6">
                  <Link to={`/product/${item.product}`}>{item.name}</Link>
                </div>

                <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                  <p>
                    {item.quantity} x ${item.price} ={" "}
                    <b>${(item.quantity * item.price).toFixed(2)}</b>
                  </p>
                </div>
              </div>
            ))}
          </div>
          <hr />
        </div>

        <div className="col-12 col-lg-3 my-4">
          <div id="order_summary">
            <h4>Order Summary</h4>
            <hr />
            <p>
              Subtotal:{" "}
              <span className="order-summary-values">${itemprice}</span>
            </p>
            <p>
              Shipping:{" "}
              <span className="order-summary-values">${shippingPrice}</span>
            </p>
            <p>
              Tax: <span className="order-summary-values">${TaxPrice}</span>
            </p>

            <hr />

            <p>
              Total: <span className="order-summary-values">${totalprice}</span>
            </p>

            <hr />
            <button
              id="checkout_btn"
              className="btn btn-primary btn-block"
              onClick={processPayment}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
