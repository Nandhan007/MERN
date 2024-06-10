import { Fragment, useEffect, useState } from "react";
import Metadata from "./MetaData";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../redux/productsSlices";
import Loader from "./Loader";
import Product from "../Product/productCard";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";

export default function Home() {
  const dispatch = useDispatch();
  const { loading, products, error, totalcount, resperpage } = useSelector(
    (state) => state.productsState
  );
  const [currentPage, setCurrentPage] = useState(1);
  const keyword = null;
  const price = null;
  const category = null;
  const Rating = null;
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
  }, [error, dispatch, currentPage]);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <Metadata title={"Buy Products"} />
          <h1 id="products_heading">Latest Products</h1>
          <section id="products" className="container mt-5">
            <div className="row">
              {products &&
                products.map((product, index) => (
                  <Product col={3} product={product} key={index} />
                ))}
            </div>
          </section>
          {totalcount > 0 && totalcount > resperpage ? (
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
