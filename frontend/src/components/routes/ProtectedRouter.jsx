import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../layout/Loader";

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};
export function ProtectedRoute({ children, isAdmin = false }) {
  const { isAuthenticated, loading, User } = useSelector(
    (state) => state.authState
  );
  const navigate = useNavigate();
  if (!isAuthenticated && !loading) {
    navigate("/login");
  }
  if (isAuthenticated) {
    if (isAdmin && User.role !== "admin") {
      return navigate("/");
    }
    return children;
  }
  if (loading) {
    return <Loader />;
  }
}
