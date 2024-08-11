import { useElements, useStripe } from "@stripe/react-stripe-js";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { validateShipping } from "./ShippingInfo";
import axios from "axios";
import { toast } from "react-toastify";
import { orderCompleted } from "../../redux/cartSlices";
import { clearOrderError } from "../../redux/orderSlices";
import { NewOrder } from "../../redux/orderSlices";
export default function Payment() {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const { User } = useSelector((state) => state.authState);
  const { items, shippingInfo } = useSelector((state) => state.cartState);
  const { error: OrderError } = useSelector((state) => state.orderState);
  const PaymentData = {
    amount: Math.round(orderInfo.totalprice * 100),
    shipping: {
      name: User.name,
      address: {
        city: shippingInfo.city,
        postal_code: shippingInfo.postalCode,
        state: shippingInfo.State,
        country: shippingInfo.country,
        line1: shippingInfo.address,
      },
      phone: shippingInfo.phone,
    },
  };
  const order = {
    orderItems: items,
    shippingInfo,
  };
  if (orderInfo) {
    order.itemsprice = orderInfo.itemprice;
    order.taxprice = orderInfo.TaxPrice;
    order.shippingprice = orderInfo.shippingPrice;
    order.totalprice = orderInfo.totalprice;
  }
  useEffect(() => {
    validateShipping(shippingInfo, navigate);
    if (OrderError) {
      toast(OrderError, {
        position: "bottom-center",
        type: "error",
        onOpen: () => {
          dispatch(clearOrderError);
        },
      });
    }
  }, [navigate, shippingInfo, OrderError, dispatch]);

  const submitHandler = async (e) => {
    e.preventDefault();
    document.querySelector("#pay_btn").disabled = true;

    const data = await axios
      .post(
        "https://mern-wao5.onrender.com/api/v1/payment/process",
        PaymentData,
        {
          withCredentials: true,
        }
      )
      .then((res) => res.data);
    const client_secret = data.client_secret;
    const result = stripe.confirmCardPayment(client_secret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
        billing_details: {
          name: User.name,
          email: User.email,
        },
      },
    });

    if ((await result).error) {
      toast((await result).error.message, {
        type: "error",
        position: "bottom-center",
      });
      document.querySelector("#pay_btn").disabled = false;
    } else {
      if ((await result).paymentIntent.status === "succeeded") {
        toast("Payment Success!", {
          type: "success",
          position: "bottom-center",
        });
        order.paymentInfo = {
          id: (await result).paymentIntent.id,
          status: (await result).paymentIntent.status,
        };
        dispatch(orderCompleted());
        dispatch(NewOrder(order));
        navigate("/order/success");
      } else {
        toast("Please Try again!", {
          type: "warning",
          position: "bottom-center",
        });
      }
    }
  };
  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form onSubmit={submitHandler} className="shadow-lg">
          <h1 className="mb-4">Card Info</h1>
          <div className="form-group">
            <label htmlFor="card_num_field">Card Number</label>
            <CardNumberElement
              type="text"
              id="card_num_field"
              className="form-control"
              value=""
            />
          </div>

          <div className="form-group">
            <label htmlFor="card_exp_field">Card Expiry</label>
            <CardExpiryElement
              type="text"
              id="card_exp_field"
              className="form-control"
              value=""
            />
          </div>

          <div className="form-group">
            <label htmlFor="card_cvc_field">Card CVC</label>
            <CardCvcElement
              type="text"
              id="card_cvc_field"
              className="form-control"
              value=""
            />
          </div>

          <button id="pay_btn" type="submit" className="btn btn-block py-3">
            {`Pay - $${orderInfo.totalprice && orderInfo.totalprice}`}
          </button>
        </form>
      </div>
    </div>
  );
}
