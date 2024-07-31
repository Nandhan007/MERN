import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import { Fragment, useEffect, useState } from "react";
import { MDBDataTable } from "mdbreact";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";
import {
  clearReviewDeleted,
  DeleteReviews,
  GetReviews,
  clearProductError,
} from "../../redux/productSlices";

export default function ReviewList() {
  const { error, loading, isReviewDeleted, reviews } = useSelector(
    (state) => state.productState
  );
  const [productId, setProductId] = useState("");
  const dispatch = useDispatch();
  const deleteHandler = (e, id, productId) => {
    e.preventDefault();
    dispatch(DeleteReviews({ id, productId }));
  };
  useEffect(() => {
    if (error) {
      toast(error, {
        position: "bottom-center",
        type: "error",
        onOpen: () => {
          dispatch(clearProductError());
        },
      });
      return;
    }
    if (isReviewDeleted) {
      toast("Review Deleted Successfully", {
        position: "bottom-center",
        type: "success",
        onOpen: () => dispatch(clearReviewDeleted()),
      });
      dispatch(GetReviews(productId));
      setProductId("");
      return;
    }
  }, [dispatch, error, isReviewDeleted, productId]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(GetReviews(productId));
  };
  const ReviewsList = () => {
    const data = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "User",
          field: "user",
          sort: "asc",
        },
        {
          label: "Rating",
          field: "rating",
          sort: "asc",
        },
        {
          label: "Comments",
          field: "comments",
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

    reviews.forEach((review) => {
      data.rows.push({
        id: review._id,
        user: review.user.name,
        rating: review.rating,
        comments: review.comments,
        action: (
          <Fragment>
            <button
              onClick={(e) => deleteHandler(e, review._id, productId)}
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
        <h1 className="my-4">Reviews List</h1>
        <div className="row justify-content-center mt-5">
          <div className="col-5">
            <form onSubmit={submitHandler}>
              <div className="formgroup">
                <label>Product ID</label>
                <input
                  type="text"
                  disabled={loading}
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="form-control"
                />
              </div>
              <button className="btn btn-primary btn-block py-2">Search</button>
            </form>
          </div>
        </div>
        <Fragment>
          {loading ? (
            <Loader />
          ) : (
            <MDBDataTable
              data={ReviewsList()}
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
