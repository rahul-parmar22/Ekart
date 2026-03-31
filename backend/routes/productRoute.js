import { Router } from "express";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import { multipleUpload } from "../middleware/multer.js";
import { addProduct, deleteProduct, getAllProduct, updateProduct } from "../controllers/productController.js";
              
const router = Router();

router.post("/add",isAuthenticated, isAdmin,multipleUpload,  addProduct);
router.get('/getallproducts', getAllProduct) //no any middleware use because any visited person get and see product
router.delete('/delete/:productId',isAuthenticated, isAdmin,  deleteProduct)
router.put('/update/:productId', isAuthenticated, isAdmin, multipleUpload, updateProduct)

export default router;
