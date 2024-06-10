import "./App.css";
import ProductDescription from "./components/Product/ProductDescription.jsx";
import ProductSearch from "./components/Product/productSearch.jsx";
import Footer from "./components/layout/Footer.jsx";
import Header from "./components/layout/Header.jsx";
import Home from "./components/layout/Home.jsx";
import { HelmetProvider } from "react-helmet-async";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Login } from "./components/user/Login.jsx";
import { Register } from "./components/user/Register.jsx";
import { useEffect } from "react";
import store from "./store.jsx";
import { loadUser } from "./redux/authSlices.jsx";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { clearerror } from "./redux/authSlices.jsx";
function App() {
  const dispatch = useDispatch();
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
  }, []);
  return (
    <>
      <Router>
        <HelmetProvider>
          <Header />
          <div className="container container-fluid">
            <ToastContainer theme="dark" />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search/:keyword" element={<ProductSearch />} />
              <Route path="/product/:id" element={<ProductDescription />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
          <Footer />
        </HelmetProvider>
      </Router>
    </>
  );
}

export default App;
