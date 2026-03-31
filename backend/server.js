import express from "express";
import  "dotenv/config";
import connectDB from "./database/db.js";
import userRoutes from "./routes/userRoute.js";
import productRoute from './routes/productRoute.js'
import cartRoute from './routes/cartRoutes.js'
import orderRoute from './routes/orderRoute.js'
import cors from "cors";

//dinesh pawar  video for deploying backen on render 
//https://www.youtube.com/watch?v=lDpK8YWmYDA


const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(express.json());
app.use(cors({
   origin: "http://localhost:5173",
   credentials: true
   }));
   
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product",productRoute);
app.use("/api/v1/cart",cartRoute);
app.use("/api/v1/orders", orderRoute);

const createConnection = async () => {
  try {
    await connectDB();
    app.listen(port, (req, res) =>
      console.log(`server listening on http://localhost:${port}`),
    );
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }   
};

createConnection();
