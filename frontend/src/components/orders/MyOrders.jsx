import { Fragment, useEffect } from "react";
import Metadata from "../layout/MetaData";
import { MDBDataTable } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { MyOrder } from "../../redux/orderSlices";
import { Link } from "react-router-dom";

export function UserOrders() {
  const { userOrders } = useSelector((state) => state.orderState);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(MyOrder());
  }, [dispatch]);

  const setOrders = () => {
    const data = {
      columns: [
        {
          label: "Order ID",
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
          label: "Actions",
          field: "action",
          sort: "asc",
        },
      ],
      rows: [],
    };
    userOrders.forEach((userOrder) => {
      data.rows.push({
        id: userOrder._id,
        numOfItems: userOrder.orderItems.length,
        amount: `$${userOrder.totalprice}`,
        status:
          userOrder.orderStatus && userOrder.orderStatus == "Processing" ? (
            <p style={{ color: "red" }}>{userOrder.orderStatus}</p>
          ) : (
            <p style={{ color: "green" }}>{userOrder.orderStatus}</p>
          ),
        action: (
          <Link to={`/order/${userOrder._id}`} className="btn btn-primary">
            <i className="fa fa-eye"></i>
          </Link>
        ),
      });
    });
    return data;
  };

  return (
    <Fragment>
      <Metadata title="MyOrders" />
      <h1 className="mt-5">My Orders</h1>
      <MDBDataTable
        className="px-3 ordertable"
        bordered
        striped
        hover
        data={setOrders()}
      />
    </Fragment>
  );
}
