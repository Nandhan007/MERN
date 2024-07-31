import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { clearUserError, getUsers } from "../../redux/userSlices";
import { MDBDataTable } from "mdbreact";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";
import { clearUserDeleted, DeleteUser } from "../../redux/userSlices";

export default function UserList() {
  const { error, loading, isUserDeleted, users } = useSelector(
    (state) => state.userState
  );

  const dispatch = useDispatch();
  const deleteHandler = (e, id) => {
    e.preventDefault();
    dispatch(DeleteUser(id));
  };
  useEffect(() => {
    if (error) {
      toast(error, {
        position: "bottom-center",
        type: "error",
        onOpen: () => {
          dispatch(clearUserError());
        },
      });
      return;
    }
    if (isUserDeleted) {
      toast("User Deleted Successfully", {
        position: "bottom-center",
        type: "success",
        onOpen: () => dispatch(clearUserDeleted()),
      });
      return;
    }
    dispatch(getUsers());
  }, [dispatch, error, isUserDeleted]);
  const UserLists = () => {
    const data = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Email",
          field: "email",
          sort: "asc",
        },
        {
          label: "Role",
          field: "role",
          sort: "asc",
        },
        {
          label: "Action",
          field: "action",
          sort: "asc",
        },
      ],
      rows: [],
    };

    users.forEach((user) => {
      data.rows.push({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        action: (
          <Fragment>
            <Link to={`/admin/user/${user._id}`} className="btn btn-primary">
              <i className="fa fa-pencil"></i>
            </Link>
            <button
              onClick={(e) => deleteHandler(e, user._id)}
              className="btn btn-danger px-2 py-1 ml-2"
            >
              <i className="fa fa-trash"></i>
            </button>
          </Fragment>
        ),
      });
    });
    return data;
  };
  return (
    <div className="row">
      <div className="col-12 col-md-2">
        <Sidebar />
      </div>
      <div className="col-12 col-md-10">
        <h1 className="my-4">User List</h1>
        <Fragment>
          {loading ? (
            <Loader />
          ) : (
            <MDBDataTable
              data={UserLists()}
              striped
              bordered
              hover
              className="px-3"
            />
          )}
        </Fragment>
      </div>
    </div>
  );
}
