import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { clearOrderError, GetOrders } from "../../redux/orderSlices";
import { MDBDataTable } from "mdbreact";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";
import { clearDeleteOrder, DeleteOrders } from "../../redux/orderSlices";

export default function OrderList() {
  const {
    error,
    loading,
    isOrderDeleted,
    adminOrders = [],
  } = useSelector((state) => state.orderState);

  const dispatch = useDispatch();
  const deleteHandler = (e, id) => {
    e.preventDefault();
    dispatch(DeleteOrders(id));
  };
  useEffect(() => {
    if (error) {
      toast(error, {
        position: "bottom-center",
        type: "error",
        onOpen: () => {
          dispatch(clearOrderError());
        },
      });
      return;
    }
    if (isOrderDeleted) {
      toast("Order Deleted Successfully", {
        position: "bottom-center",
        type: "success",
        onOpen: () => dispatch(clearDeleteOrder()),
      });
      return;
    }
    dispatch(GetOrders());
  }, [dispatch, error, isOrderDeleted]);
  const getOrders = () => {
    const data = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Number of Items",
          field: "numOfItems",
          sort: "asc",
        },
        {
          label: "Amount",
          field: "amount",
          sort: "asc",
        },
        {
          label: "Status",
          field: "status",
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

    adminOrders.forEach((order) => {
      data.rows.push({
        id: order._id,
        numOfItems: order.orderItems.length,
        amount: `$${order.totalprice}`,
        status: (
          <p
            style={{
              color: order.orderStatus.includes("Processing") ? "red" : "green",
            }}
          >
            {order.orderStatus}
          </p>
        ),
        action: (
          <Fragment>
            <Link to={`/admin/orders/${order._id}`} className="btn btn-primary">
              <i className="fa fa-pencil"></i>
            </Link>
            <button
              onClick={(e) => deleteHandler(e, order._id)}
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
        <h1 className="my-4">Order List</h1>
        <Fragment>
          {loading ? (
            <Loader />
          ) : (
            <MDBDataTable
              data={getOrders()}
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
