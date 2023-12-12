import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
} from "../controllers/ProductController.js";
import { verifyToken } from "../middlewares/Auth.js";
import { upload } from "../utils/multer.js";
const ProductRoute = express.Router();

ProductRoute.post(
  "/products",
  upload.single("file"),
  verifyToken,
  createProduct
);
ProductRoute.get("/products", getAllProducts);
ProductRoute.get("/products/:id", getOneProduct);
ProductRoute.put(
  "/products/:id",
  upload.single("file"),
  verifyToken,
  updateProduct
);
ProductRoute.delete("/products/:id", verifyToken, deleteProduct);

export default ProductRoute;
