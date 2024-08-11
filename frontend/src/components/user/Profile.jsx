import { Fragment } from "react";
import { useSelector } from "react-redux";
import Metadata from "../layout/MetaData";
import { Link } from "react-router-dom";

export function Profile() {
  const { User } = useSelector((state) => state.authState);
  return (
    <Fragment>
      <Metadata title={"Profile"} />
      <div className="row justify-content-around mt-5 user-info">
        <div className="col-12 col-md-3">
          <figure className="avatar avatar-profile">
            <img
              className="rounded-circle img-fluid"
              src={User.avatar ?? "images/default_avatar"}
              alt=""
            />
          </figure>
          <Link
            to={"/myprofile/update"}
            href="#"
            id="edit_profile"
            className="btn btn-primary btn-block my-5"
          >
            Edit Profile
          </Link>
        </div>

        <div className="col-12 col-md-5">
          <h4>Full Name</h4>
          <p>{User.name}</p>

          <h4>Email Address</h4>
          <p>{User.email}</p>

          <h4>Joined</h4>
          <p>{String(User.createdAt).substring(0, 10)}</p>

          <Link to={"/orders"} className="btn btn-danger btn-block mt-5">
            My Orders
          </Link>

          <Link
            to={"/password/change"}
            href="#"
            className="btn btn-primary btn-block mt-3 chgpass"
          >
            Change Password
          </Link>
        </div>
      </div>
    </Fragment>
  );
}
