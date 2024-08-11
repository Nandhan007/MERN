import "./App.css";
import ProductDescription from "./components/Product/ProductDescription.jsx";
import ProductSearch from "./components/Product/productSearch.jsx";
import Footer from "./components/layout/Footer.jsx";
import Header from "./components/layout/Header.jsx";
import Home from "./components/layout/Home.jsx";
import PropTypes from "prop-types";
import { HelmetProvider } from "react-helmet-async";
import {
  Routes,
  Route,
  BrowserRouter as Router,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Login } from "./components/user/Login.jsx";
import { Register } from "./components/user/Register.jsx";
import { useEffect, useState } from "react";
import store from "./store.jsx";
import { loadUser } from "./redux/authSlices.jsx";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { clearerror } from "./redux/authSlices.jsx";
import { Profile } from "./components/user/Profile.jsx";
import { ProtectedRoute } from "./components/routes/ProtectedRouter.jsx";
import { UpdateProfile } from "./components/user/UpdateProfile.jsx";
import ChangePassword from "./components/user/ChangePassword.jsx";
import { Forgetpassword } from "./components/user/ForgetPassword.jsx";
import Resetpassword from "./components/user/ResetPassword.jsx";
import Cart from "./components/cart/CartDescription.jsx";
import ShippingInfo from "./components/cart/ShippingInfo.jsx";
import ConfirmOrder from "./components/cart/Confirm.jsx";
import Payment from "./components/cart/Payment.jsx";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./components/cart/OrderSuccess.jsx";
import { UserOrders } from "./components/orders/MyOrders.jsx";
import OrderDescription from "./components/orders/OrdersDescription.jsx";
import Dashboard from "./components/admin/Dashboard.jsx";
import ProductList from "./components/admin/ProductList.jsx";
import NewProduct from "./components/admin/NewProduct.jsx";
import UpdateProduct from "./components/admin/UpdateProduct.jsx";
import OrderList from "./components/admin/OrderList.jsx";
import UpdateOrder from "./components/admin/UpdateOrder.jsx";
import UserList from "./components/admin/UserList.jsx";
import UserUpdate from "./components/admin/UpdateUser.jsx";
import ReviewList from "./components/admin/ReviewsList.jsx";
function App() {
  const dispatch = useDispatch();
  const [stripeApi, setStripeApi] = useState("");
  const { error } = useSelector((state) => state.authState);
  useEffect(() => {
    if (error) {
      toast(error, {
        position: "bottom-center",
        type: "error",
        onOpen: () => {
          dispatch(clearerror());
        },
      });
      return;
    }
    store.dispatch(loadUser());
    async function getStripeApi() {
      const data = await axios
        .get("https://mern-wao5.onrender.com/api/v1/stripeapi", {
          withCredentials: true,
        })
        .then((res) => res.data);
      setStripeApi(data.stripeApiKey);
    }
    getStripeApi();
  }, []);
  return (
    <>
      <Router>
        <HelmetProvider>
          <Header />
          <MainContent stripeApi={stripeApi} />
          <Footer />
        </HelmetProvider>
      </Router>
    </>
  );
}
MainContent.propTypes = {
  stripeApi: PropTypes.string.isRequired,
};
function MainContent({ stripeApi }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  return (
    <>
      <div className={`container container-fluid ${isAdmin ? "" : "vh-150"}`}>
        <ToastContainer theme="dark" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search/:keyword" element={<ProductSearch />} />
          <Route path="/product/:id" element={<ProductDescription />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/myprofile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/myprofile/update" element={<UpdateProfile />} />
          <Route
            path="/password/change"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route path="/password/forgot" element={<Forgetpassword />} />
          <Route path="/password/reset/:token" element={<Resetpassword />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/shipping"
            element={
              <ProtectedRoute>
                <ShippingInfo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order/confirm"
            element={
              <ProtectedRoute>
                <ConfirmOrder />
              </ProtectedRoute>
            }
          />
          {stripeApi && (
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <Elements stripe={loadStripe(stripeApi)}>
                    <Payment />
                  </Elements>
                </ProtectedRoute>
              }
            />
          )}
          <Route
            path="/order/success"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <UserOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order/:id"
            element={
              <ProtectedRoute>
                <OrderDescription />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      {/* Admin Routes */}
      <Routes>
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute isAdmin={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute isAdmin={true}>
              <ProductList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products/create"
          element={
            <ProtectedRoute isAdmin={true}>
              <NewProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/product/:id"
          element={
            <ProtectedRoute isAdmin={true}>
              <UpdateProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute isAdmin={true}>
              <OrderList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders/:id"
          element={
            <ProtectedRoute isAdmin={true}>
              <UpdateOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute isAdmin={true}>
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/user/:id"
          element={
            <ProtectedRoute isAdmin={true}>
              <UserUpdate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute isAdmin={true}>
              <ReviewList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
export default App;
