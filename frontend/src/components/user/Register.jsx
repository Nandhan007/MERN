import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, clearerror } from "../../redux/authSlices";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Metadata from "../layout/MetaData";

export function Register() {
  const [UserData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    "images/default_avatar.jpg"
  );
  const dispatch = useDispatch();
  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.authState
  );
  const navigate = useNavigate();

  const onChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState == 2) {
          setAvatarPreview(reader.result);
          setAvatar(e.target.files[0]);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUserData({ ...UserData, [e.target.name]: e.target.value });
    }
  };
  const handlerSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", UserData.name);
    formData.append("email", UserData.email);
    formData.append("password", UserData.password);
    formData.append("avatar", avatar);
    console.log(UserData);
    dispatch(register(formData));
  };

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
    if (isAuthenticated) {
      navigate("/");
    }
  }, [error, isAuthenticated, dispatch, navigate]);
  return (
    <Fragment>
      <Metadata title="Register" />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form
            onSubmit={handlerSubmit}
            className="shadow-lg"
            encType="multipart/form-data"
          >
            <h1 className="mb-3">Register</h1>

            <div className="form-group">
              <label htmlFor="email_field">Name</label>
              <input
                type="name"
                name="name"
                onChange={onChange}
                id="name_field"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                name="email"
                onChange={onChange}
                id="email_field"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password_field">Password</label>
              <input
                type="password"
                name="password"
                onChange={onChange}
                id="password_field"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="avatar_upload">Avatar</label>
              <div className="d-flex align-items-center">
                <div>
                  <figure className="avatar mr-3 item-rtl">
                    <img
                      src={avatarPreview}
                      className="rounded-circle"
                      alt="image"
                    />
                  </figure>
                </div>
                <div className="custom-file">
                  <input
                    type="file"
                    name="avatar"
                    onChange={onChange}
                    className="custom-file-input"
                    id="customFile"
                  />
                  <label className="custom-file-label" htmlFor="customFile">
                    Choose Avatar
                  </label>
                </div>
              </div>
            </div>

            <button
              id="register_button"
              type="submit"
              className="btn btn-block py-3"
              disabled={loading}
            >
              REGISTER
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
}
