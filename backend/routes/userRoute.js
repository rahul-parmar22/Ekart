import { Router } from "express";
import { login, register, verify,reVerify, logout, forgotPassword, verifyOTP, changePassword, allUser, getUserById, updateUser } from "../controllers/userController.js";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";


const router = Router();

router.post('/register', register);
router.post('/verify', verify); 
router.post('/reverify', reVerify); 
router.post('/login', login);
router.post('/logout',isAuthenticated, logout);
router.post('/forgot-password', isAuthenticated, forgotPassword);
router.post('/verify-otp/:email', verifyOTP) //aa badha backend na route chhe to aa badha upar url ma no hoy..
router.post('/change-password/:email',changePassword)
router.get('/all-user',isAuthenticated,isAdmin,allUser);
router.get('/get-user/:userId',getUserById);
router.put('/update/:id', isAuthenticated, singleUpload, updateUser)



export default router; 