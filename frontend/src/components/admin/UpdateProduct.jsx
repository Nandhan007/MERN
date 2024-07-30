import { Fragment, useEffect, useState } from "react";
import Loader from "../layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  clearUpdatedProduct,
  getSingleProduct,
  updateProduct,
} from "../../redux/productSlices";
import { clearProductError } from "../../redux/productSlices";

export default function UpdateProduct() {
  const { loading, isProductUpdated, error, product } = useSelector(
    (state) => state.productState
  );
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [seller, setSeller] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [imagesCleared, setImagesCleared] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: productId } = useParams();
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

  const onImageChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagePreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, file]);
        }
      };
      reader.readAsDataURL(file);
    });
  };
  const ImageClear = () => {
    setImages([]);
    setImagePreview([]);
    setImagesCleared(true);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("price", price);
    formdata.append("description", description);
    formdata.append("seller", seller);
    formdata.append("stock", stock);
    formdata.append("category", category);
    images.forEach((image) => {
      formdata.append("images", image);
    });
    formdata.append("imageCleared", imagesCleared);
    dispatch(updateProduct({ id: product._id, formdata }));
  };

  useEffect(() => {
    if (error) {
      toast(error, {
        position: "bottom-center",
        type: "error",
        onOpen: () => dispatch(clearProductError()),
      });
      return;
    }
    if (isProductUpdated) {
      toast("Product Updated Successfully", {
        position: "bottom-center",
        type: "success",
        onOpen: () => dispatch(clearUpdatedProduct()),
      });
      navigate("/admin/products");
      return;
    }
    dispatch(getSingleProduct(productId));
  }, [dispatch, error, isProductUpdated, navigate, productId]);

  useEffect(() => {
    if (product._id) {
      setName(product.name);
      setPrice(product.price);
      setDescription(product.description);
      setSeller(product.seller);
      setStock(product.stock);
      setCategory(product.category);
      let Images = [];
      product.images.forEach((image) => {
        Images.push(image.image);
      });
      setImagePreview(Images);
    }
  }, [product]);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="row">
          <div className="col-12 col-md-2">
            <Sidebar />
          </div>
          <div className="col-12 col-md-10">
            <div className="wrapper my-5">
              <form
                onSubmit={submitHandler}
                className="shadow-lg"
                encType="multipart/form-data"
              >
                <h1 className="mb-4">Update Product</h1>

                <div className="form-group">
                  <label htmlFor="name_field">Name</label>
                  <input
                    type="text"
                    id="name_field"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price_field">Price</label>
                  <input
                    type="text"
                    id="price_field"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description_field">Description</label>
                  <textarea
                    className="form-control"
                    id="description_field"
                    rows="8"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="category_field">Category</label>
                  <select
                    value={category}
                    className="form-control"
                    id="category_field"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((item, i) => (
                      <option key={i} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="stock_field">Stock</label>
                  <input
                    type="number"
                    id="stock_field"
                    className="form-control"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="seller_field">Seller Name</label>
                  <input
                    type="text"
                    id="seller_field"
                    className="form-control"
                    value={seller}
                    onChange={(e) => setSeller(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Images</label>

                  <div className="custom-file">
                    <input
                      type="file"
                      name="product_images"
                      className="custom-file-input"
                      id="customFile"
                      multiple
                      onChange={onImageChange}
                    />
                    <label className="custom-file-label" htmlFor="customFile">
                      Choose Images
                    </label>
                  </div>
                  {imagePreview.length > 0 && (
                    <span
                      className="mr-2"
                      style={{ cursor: "pointer" }}
                      onClick={ImageClear}
                    >
                      <i className="fa fa-trash"></i>
                    </span>
                  )}
                  {imagePreview.map((image, i) => (
                    <img
                      className="mt-3 mr-2"
                      key={i}
                      src={image}
                      alt="Image Preview"
                      width={55}
                      height={52}
                    />
                  ))}
                </div>

                <button
                  disabled={loading}
                  id="login_button"
                  type="submit"
                  className="btn btn-block py-3"
                >
                  UPDATE
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}
