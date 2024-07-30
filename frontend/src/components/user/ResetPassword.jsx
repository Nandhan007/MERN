import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ResetPassword as resetpassword } from "../../redux/authSlices";
import { toast } from "react-toastify";
import { clearerror } from "../../redux/authSlices";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function Resetpassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const { error, isAuthenticated } = useSelector((state) => state.authState);
  const handlerSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    dispatch(resetpassword({ formData, token }));
    console.log(token);
  };
  useEffect(() => {
    if (isAuthenticated) {
      toast("Password reset success", {
        position: "bottom-center",
        type: "success",
        onOpen: () => {
          dispatch(clearerror());
        },
      });
      navigate("/");
    }
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
  }, [error, dispatch, isAuthenticated, navigate]);
  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form onSubmit={handlerSubmit} className="shadow-lg">
          <h1 className="mb-3">New Password</h1>

          <div className="form-group">
            <label htmlFor="password_field">Password</label>
            <input
              type="password"
              id="password_field"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm_password_field">Confirm Password</label>
            <input
              type="password"
              id="confirm_password_field"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            id="new_password_button"
            type="submit"
            className="btn btn-block py-3"
          >
            Set Password
          </button>
        </form>
      </div>
    </div>
  );
}
