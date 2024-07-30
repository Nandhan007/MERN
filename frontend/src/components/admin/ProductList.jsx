import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { clearError, getAdminProducts } from "../../redux/productsSlices";
import { MDBDataTable } from "mdbreact";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";
import { clearDeletedProduct, DeleteProduct } from "../../redux/productSlices";

export default function ProductList() {
  const { products, error, loading } = useSelector(
    (state) => state.productsState
  );
  const { isProductDeleted, error: DeleteError } = useSelector(
    (state) => state.productState
  );
  const dispatch = useDispatch();
  const deleteHandler = (e, id) => {
    e.preventDefault();
    dispatch(DeleteProduct(id));
  };
  useEffect(() => {
    if (error || DeleteError) {
      toast(error || DeleteError, {
        position: "bottom-center",
        type: "error",
        onOpen: () => {
          dispatch(clearError());
        },
      });
      return;
    }
    if (isProductDeleted) {
      toast("Product Deleted Successfully", {
        position: "bottom-center",
        type: "success",
        onOpen: () => dispatch(clearDeletedProduct()),
      });
      return;
    }
    dispatch(getAdminProducts());
  }, [dispatch, error, isProductDeleted, DeleteError]);
  const getProducts = () => {
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
          label: "Price",
          field: "price",
          sort: "asc",
        },
        {
          label: "Stock",
          field: "stock",
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

    products.forEach((product) => {
      data.rows.push({
        id: product._id,
        name: product.name,
        price: `$${product.price}`,
        stock: product.stock,
        action: (
          <Fragment>
            <Link
              to={`/admin/product/${product._id}`}
              className="btn btn-primary"
            >
              <i className="fa fa-pencil"></i>
            </Link>
            <button
              onClick={(e) => deleteHandler(e, product._id)}
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
        <h1 className="my-4">Product List</h1>
        <Fragment>
          {loading ? (
            <Loader />
          ) : (
            <MDBDataTable
              data={getProducts()}
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
