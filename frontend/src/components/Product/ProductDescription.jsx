import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearProductDetail,
  clearReviewSubmitted,
  CreateReview,
  getSingleProduct,
} from "../../redux/productSlices";
import { useParams } from "react-router-dom";
import Loader from "../layout/Loader";
import { toast } from "react-toastify";
import MetaData from "../layout/MetaData";
import { addToCart } from "../../redux/cartSlices";
import { Modal } from "react-bootstrap";
import ProductReview from "./productReview";

export default function ProductDescription() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { loading, product, error, isReviewed } = useSelector(
    (state) => state.productState
  );
  const [quantity, setQuantity] = useState(1);
  const [show, setShow] = useState(false);
  const [comments, setComments] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "bottom-center",
      });
      return;
    }
    if (isReviewed) {
      toast("Review Successfully Submitted", {
        position: "bottom-center",
        type: "success",
        onOpen: () => dispatch(clearReviewSubmitted()),
      });
    }
    if (!product._id || isReviewed) {
      dispatch(getSingleProduct(id));
    }

    return () => {
      dispatch(clearProductDetail());
    };
  }, [id, dispatch, error, isReviewed]);

  const QuantityPlus = () => {
    const count = document.querySelector(".count");
    if (product.stock == 0 || product.stock <= count.valueAsNumber) {
      return;
    }
    const qty = count.valueAsNumber + 1;
    setQuantity(qty);
  };
  const QuantityMinus = () => {
    const count = document.querySelector(".count");
    if (count.valueAsNumber === 1) {
      return;
    }
    setQuantity(count.valueAsNumber - 1);
  };
  const [rating, setRating] = useState(1);

  const reviewHandler = () => {
    handleClose();
    const formdata = new FormData();
    formdata.append("rating", rating);
    formdata.append("comments", comments);
    formdata.append("productId", id);
    dispatch(CreateReview(formdata));
  };
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={product.name ? product.name : ""} />
          <div className="row f-flex justify-content-around">
            <div className="col-12 col-lg-5 img-fluid" id="product_image">
              <img
                src={product.images ? product.images[0].image : ""}
                alt={product.name}
                height="500"
                width="500"
              />
            </div>

            <div className="col-12 col-lg-5 mt-5">
              <h3>{product.name}</h3>
              <p id="product_id">Product # {product._id}</p>

              <hr />

              <div className="rating-outer">
                <div
                  className="rating-inner"
                  style={{ width: `${(product.ratings / 5) * 100}%` }}
                ></div>
              </div>
              <span id="no_of_reviews">({product.numofReviews} Reviews)</span>

              <hr />

              <p id="product_price">{product.price}</p>
              <div className="stockCounter d-inline">
                <span className="btn btn-danger minus" onClick={QuantityMinus}>
                  -
                </span>

                <input
                  type="number"
                  className="form-control count d-inline"
                  value={quantity}
                  readOnly
                />

                <span className="btn btn-primary plus" onClick={QuantityPlus}>
                  +
                </span>
              </div>
              <button
                type="button"
                id="cart_btn"
                className="btn btn-primary d-inline ml-4"
                disabled={product.stock == 0 ? true : false}
                onClick={() => {
                  dispatch(addToCart({ id: product._id, quantity }));
                  toast("Cart added successfully", {
                    position: "bottom-center",
                    type: "success",
                  });
                }}
              >
                Add to Cart
              </button>

              <hr />

              <p>
                Status:{" "}
                <span
                  id="stock_status"
                  className={product.stock > 0 ? "greenColor" : "redColor"}
                >
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </p>

              <hr />

              <h4 className="mt-2">Description:</h4>
              <p>{product.description}</p>
              <hr />
              <p id="product_seller mb-3">
                Sold by: <strong>{product.seller}</strong>
              </p>

              <button
                id="review_btn"
                type="button"
                className="btn btn-primary mt-4"
                data-toggle="modal"
                data-target="#ratingModal"
                onClick={handleShow}
              >
                Submit Your Review
              </button>

              <div className="row mt-2 mb-5">
                <div className="rating w-50">
                  <div
                    className="modal fade"
                    id="ratingModal"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="ratingModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="ratingModalLabel">
                            Submit Review
                          </h5>
                          <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <ul className="stars">
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                          </ul>

                          <textarea
                            name="review"
                            id="review"
                            className="form-control mt-3"
                          ></textarea>

                          <button
                            className="btn my-3 float-right review-btn px-4 text-white"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Submit Review</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <ul className="stars">
                        {[1, 2, 3, 4, 5].map((star, index) => (
                          <li
                            className={`star ${star <= rating ? "orange" : ""}`}
                            key={index}
                            onClick={() => setRating(star)}
                            onMouseOver={(e) =>
                              e.target.classList.add("yellow")
                            }
                            onMouseOut={(e) =>
                              e.target.classList.remove("yellow")
                            }
                          >
                            <i className="fa fa-star"></i>
                          </li>
                        ))}
                      </ul>

                      <textarea
                        onChange={(e) => setComments(e.target.value)}
                        name="review"
                        id="review"
                        className="form-control mt-3"
                      ></textarea>
                      <button
                        onClick={reviewHandler}
                        disabled={loading}
                        aria-label="Close"
                        className="btn my-5 float-right review-btn px-4 text-white"
                      >
                        Submit
                      </button>
                    </Modal.Body>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
          {product.reviews && product.reviews.length > 0 ? (
            <ProductReview review={product.reviews} />
          ) : null}
        </Fragment>
      )}
    </Fragment>
  );
}
