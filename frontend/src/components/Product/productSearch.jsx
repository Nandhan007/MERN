import { Fragment, useEffect, useState } from "react";
import Metadata from "../layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../redux/productsSlices";
import Loader from "../layout/Loader";
import Product from "../Product/productCard";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import { useParams } from "react-router-dom";
import Tooltip from "rc-tooltip";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";

export default function ProductSearch() {
  const dispatch = useDispatch();
  const { keyword } = useParams();
  const { loading, products, error, totalcount, resperpage, searchCount } =
    useSelector((state) => state.productsState);
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 1000]);
  const [priceChanged, setpriceChanged] = useState(price);
  const [category, setCategory] = useState(null);
  const [Rating, setRating] = useState(null);
  const categories = [
    "Electronics",
    "Headphones",
    "Accessories",
    "MobilePhones",
    "Laptops",
    "Foods",
    "Books",
    "Clothes/Shoes",
    "Beauty/Health",
    "Sports",
    "Outdoor",
    "Home",
  ];
  const setPage = (pgno) => {
    setCurrentPage(pgno);
  };
  useEffect(() => {
    if (error) {
      return toast.error(error, {
        position: "bottom-center",
      });
    }

    dispatch(getProducts({ currentPage, keyword, price, category, Rating }));
  }, [error, dispatch, currentPage, keyword, priceChanged, category, Rating]);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <Metadata title={"Buy Products"} />
          <h1 id="products_heading">Search Products</h1>
          <section id="products" className="container mt-5">
            <div className="row">
              <div className="col-6 col-md-3 mt-5 mb-5">
                {/* Price Filter */}
                <div
                  className="px-5"
                  onMouseUp={() => {
                    setpriceChanged(price);
                  }}
                >
                  <Slider
                    range={true}
                    marks={{
                      1: "$1",
                      1000: "$1000",
                    }}
                    min={1}
                    max={1000}
                    defaultValue={price}
                    onChange={(price) => setPrice(price)}
                    handleRender={(renderProps) => {
                      return (
                        <Tooltip
                          overlay={`${renderProps.props["aria-valuenow"]}`}
                        >
                          <div {...renderProps.props}></div>
                        </Tooltip>
                      );
                    }}
                  />
                </div>
                <hr className="my-5" />
                {/* Categories Filter */}
                <div className="mt-5">
                  <h3 className="mb-3">Categories</h3>
                  <ul className="pl-0">
                    {categories.map((categorie, index) => (
                      <li
                        key={index}
                        style={{ cursor: "pointer", listStyle: "none" }}
                        onClick={() => setCategory(categorie)}
                      >
                        {categorie}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Rating Filter */}
                <div className="mt-5">
                  <h3 className="mb-3">Categories</h3>
                  <ul className="pl-0">
                    {[5, 4, 3, 2, 1].map((star, index) => (
                      <li
                        key={index}
                        style={{ cursor: "pointer", listStyle: "none" }}
                        onClick={() => setRating(star)}
                      >
                        <div className="rating-outer">
                          <div
                            className="rating-inner"
                            style={{ width: `${star * 20}%` }}
                          ></div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-6 col-md-9">
                <div className="row">
                  {products &&
                    products.map((product, index) => (
                      <Product col={4} product={product} key={index} />
                    ))}
                </div>
              </div>
            </div>
          </section>
          {searchCount > 0 && searchCount > resperpage ? (
            <div className="d-flex justify-content-center mt-5">
              <Pagination
                activePage={currentPage}
                onChange={setPage}
                totalItemsCount={totalcount}
                itemsCountPerPage={resperpage}
                nextPageText={"Next"}
                firstPageText={"First"}
                lastPageText={"Last"}
                itemClass="page-item"
                linkClass="page-link"
              />
            </div>
          ) : null}
        </Fragment>
      )}
    </Fragment>
  );
}
