import axios from "axios";
import {
  productFail,
  productRequest,
  productSuccess,
} from "../slices/productSlices";

export const getProducts = async (dispatch) => {
  try {
    dispatch(productRequest());
    const { data } = await axios.get("http://localhost:8000/api/v1/products/");
    dispatch(productSuccess(data));
  } catch (error) {
    dispatch(productFail(error.response.data.message));
  }
};
