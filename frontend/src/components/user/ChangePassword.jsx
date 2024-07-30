import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChangePassword as changingpassword } from "../../redux/authSlices";
import { toast } from "react-toastify";
import { clearerror } from "../../redux/authSlices";

export default function ChangePassword() {
  const [OldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const dispatch = useDispatch();
  const { message, error } = useSelector((state) => state.authState);

  const handlerSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("oldPassword", OldPassword);
    formData.append("password", newPassword);
    dispatch(changingpassword(formData));
  };

  useEffect(() => {
    if (message) {
      toast(message, {
        type: "success",
        position: "bottom-center",
      });
      setNewPassword("");
      setOldPassword("");
      return;
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
  }, [message, error, dispatch]);
  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form onSubmit={handlerSubmit} className="shadow-lg">
          <h1 className="mt-2 mb-5">Update Password</h1>
          <div className="form-group">
            <label htmlFor="old_password_field">Old Password</label>
            <input
              type="password"
              id="old_password_field"
              className="form-control"
              value={OldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="new_password_field">New Password</label>
            <input
              type="password"
              id="new_password_field"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn update-btn btn-block mt-4 mb-3">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
