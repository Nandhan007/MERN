import { Fragment, useEffect, useState } from "react";
import Loader from "../layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  UpdateUser,
  clearUserUpdated,
  clearUserError,
  getUser,
} from "../../redux/userSlices";

export default function UserUpdate() {
  const { loading, isUserUpdated, error, user } = useSelector(
    (state) => state.userState
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: UserId } = useParams();

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("role", role);
    dispatch(UpdateUser({ id: user._id, formData }));
  };

  useEffect(() => {
    if (error) {
      toast(error, {
        position: "bottom-center",
        type: "error",
        onOpen: () => dispatch(clearUserError()),
      });
      return;
    }
    if (isUserUpdated) {
      toast("User Updated Successfully", {
        position: "bottom-center",
        type: "success",
        onOpen: () => dispatch(clearUserUpdated()),
      });
      navigate("/admin/users");
      return;
    }
    dispatch(getUser(UserId));
  }, [dispatch, error, isUserUpdated, navigate, UserId]);

  useEffect(() => {
    if (user._id) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user._id, user.name, user.email, user.role]);
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
            <div className="wrapper my-5">
              <form
                onSubmit={submitHandler}
                className="shadow-lg"
                encType="multipart/form-data"
              >
                <h1 className="mb-4">Update User</h1>

                <div className="form-group">
                  <label htmlFor="name_field">Name</label>
                  <input
                    type="text"
                    id="name_field"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price_field">Email</label>
                  <input
                    type="text"
                    id="price_field"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category_field">Role</label>
                  <select
                    value={role}
                    className="form-control"
                    id="category_field"
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
                <button
                  disabled={loading}
                  id="login_button"
                  type="submit"
                  className="btn btn-block py-3"
                >
                  UPDATE
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}
