import { Fragment, useEffect, useState } from "react";
import Loader from "../layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  UpdateOrders,
  clearUpdateOrder,
  clearOrderError,
  orderDetailed,
} from "../../redux/orderSlices";

export default function UpdateProduct() {
  const { loading, isOrderUpdate, error, orderDetail } = useSelector(
    (state) => state.orderState
  );
  const { User } = useSelector((state) => state.authState);
  const {
    orderItems = [],
    shippingInfo = {},
    paymentInfo = {},
    totalprice = 0,
  } = orderDetail;
  const isPaid = paymentInfo.status == "succeeded" ? true : false;
  const [orderStatus, setOrderStatus] = useState("Processing");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: orderId } = useParams();

  const submitHandler = (e) => {
    e.preventDefault();
    let orderData = {};
    orderData.orderStatus = orderStatus;
    dispatch(UpdateOrders({ id: orderDetail._id, orderData }));
  };

  useEffect(() => {
    if (error) {
      toast(error, {
        position: "bottom-center",
        type: "error",
        onOpen: () => dispatch(clearOrderError()),
      });
      return;
    }
    if (isOrderUpdate) {
      toast("Product Updated Successfully", {
        position: "bottom-center",
        type: "success",
        onOpen: () => dispatch(clearUpdateOrder()),
      });
      navigate("/admin/orders");
      return;
    }
    dispatch(orderDetailed(orderId));
  }, [dispatch, error, isOrderUpdate, navigate, orderId]);

  useEffect(() => {
    if (orderDetail._id) {
      setOrderStatus(orderDetail.orderStatus);
    }
  }, [orderDetail._id, orderDetail.orderStatus]);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="row">
          <div className="col-12 col-md-2">
            <Sidebar />
          </div>
          <div className="col-12 col-md-10">
            <div className="row d-flex justify-content-around">
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
                  {shippingInfo.address},{shippingInfo.city},{" "}
                  {shippingInfo.country}, {shippingInfo.postalCode}
                </p>
                <p>
                  <b>Amount:</b> ${totalprice}
                </p>

                <hr />

                <h4 className="my-4">Payment</h4>
                <p className={isPaid ? "greenColor" : "redColor"}>
                  <b>{isPaid ? "PAID" : "NOT PAID"}</b>
                </p>

                <h4 className="my-4">Order Status:</h4>
                <p
                  className={
                    orderStatus == "Processing" ? "redColor" : "greenColor"
                  }
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
              <div className="col-12 col-lg-3 mt-5">
                <h1 className="my-4">Order Status</h1>
                <div className="form-group">
                  <select
                    name="status"
                    className="form-control"
                    onChange={(e) => setOrderStatus(e.target.value)}
                    value={orderStatus}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                <button
                  className="btn btn-primary btn-block"
                  onClick={submitHandler}
                  disabled={loading}
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}
