import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { orderDetailed } from "../../redux/orderSlices";
import Loader from "../layout/Loader";

export default function OrderDescription() {
  const { orderDetail = {}, loading } = useSelector(
    (state) => state.orderState
  );
  const { User } = useSelector((state) => state.authState);
  const {
    shippingInfo = {},
    paymentInfo = {},
    orderStatus = "Processing",
    orderItems = [],
  } = orderDetail;
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(orderDetailed(id));
  }, [dispatch, id]);
  const isPaid =
    paymentInfo && paymentInfo.status == "succeeded" ? true : false;

  return loading ? (
    <Loader />
  ) : (
    <Fragment>
      <div className="row d-flex justify-content-between">
        <div className="col-12 col-lg-8 mt-5 order-details">
          <h1 className="my-5">Order # {orderDetail._id}</h1>

          <h4 className="mb-4">Shipping Info</h4>
          <p>
            <b>Name:</b> {User.name}
          </p>
          <p>
            <b>Phone:</b> {shippingInfo.phoneNo}
          </p>
          <p className="mb-4">
            <b>Address:</b>
            {shippingInfo.address},{shippingInfo.city}, {shippingInfo.country},{" "}
            {shippingInfo.postalCode}
          </p>
          <p>
            <b>Amount:</b> ${orderDetail.totalprice}
          </p>

          <hr />

          <h4 className="my-4">Payment</h4>
          <p className={isPaid ? "greenColor" : "redColor"}>
            <b>{isPaid ? "PAID" : "NOT PAID"}</b>
          </p>

          <h4 className="my-4">Order Status:</h4>
          <p
            className={orderStatus == "Processing" ? "redColor" : "greenColor"}
          >
            <b>{orderStatus}</b>
          </p>

          <h4 className="my-4">Order Items:</h4>

          <hr />
          <div className="cart-item my-1">
            {orderItems &&
              orderItems.map((orderItem, index) => (
                <div className="row my-5" key={index}>
                  <div className="col-4 col-lg-2">
                    <img
                      src={orderItem.image}
                      alt={orderItem.name}
                      height="45"
                      width="65"
                    />
                  </div>

                  <div className="col-5 col-lg-5">
                    <Link to={`/product/${orderItem.product}`}>
                      {orderItem.name}
                    </Link>
                  </div>

                  <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                    <p>${orderItem.price}</p>
                  </div>

                  <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                    <p>{orderItem.quantity} Piece(s)</p>
                  </div>
                </div>
              ))}
          </div>
          <hr />
        </div>
      </div>
    </Fragment>
  );
}
