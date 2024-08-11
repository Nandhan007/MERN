import { Link } from "react-router-dom";
import Search from "./Search";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown, DropdownItem, DropdownMenu, Image } from "react-bootstrap";
import { logout } from "../../redux/authSlices";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { isAuthenticated, User } = useSelector((state) => state.authState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartItems } = useSelector((state) => state.cartState);

  const handlerLogout = () => {
    navigate("/login");
    dispatch(logout());
  };

  return (
    <nav className="navbar row">
      <div className="col-12 col-md-3">
        <div className="navbar-brand">
          <Link to={`/`}>
            <img width="200px" src="/images/E-cart.png" />
          </Link>
        </div>
      </div>

      <div className="col-12 col-md-6 mt-2 mt-md-0">
        <Search />
      </div>
      <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
        {isAuthenticated ? (
          <Dropdown className="d-inline">
            <Dropdown.Toggle
              variant="default text-white pr-5"
              id="dropdown-basic"
            >
              <figure className="avatar avatar-nav">
                <Image
                  width="50px"
                  src={User.avatar ?? "images/default_avatar.jpg"}
                />
              </figure>
              <span>{User.name}</span>
            </Dropdown.Toggle>
            <DropdownMenu>
              {User.role === "admin" && (
                <DropdownItem
                  onClick={() => {
                    navigate("/admin/dashboard");
                  }}
                >
                  Dashboard
                </DropdownItem>
              )}
              <DropdownItem
                onClick={() => {
                  navigate("/myprofile");
                }}
              >
                Profile
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  navigate("/orders");
                }}
              >
                Orders
              </DropdownItem>
              <DropdownItem className="text-danger" onClick={handlerLogout}>
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <Link to={"/login"} className="btn" id="login_btn">
            Login
          </Link>
        )}
        <Link to={"/cart"} id="cart" className="ml-3">
          Cart
        </Link>
        <span className="ml-1" id="cart_count">
          {cartItems.length}
        </span>
      </div>
    </nav>
  );
}
