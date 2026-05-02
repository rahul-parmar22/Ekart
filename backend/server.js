import express from "express";
import  "dotenv/config";
import connectDB from "./database/db.js";
import userRoutes from "./routes/userRoute.js";
import productRoute from './routes/productRoute.js'
import cartRoute from './routes/cartRoutes.js'
import orderRoute from './routes/orderRoute.js'
import cors from "cors";
import cookieParser from "cookie-parser";


//dinesh pawar  video for deploying backen on render 
//https://www.youtube.com/watch?v=lDpK8YWmYDA


const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(express.json());
app.use(cors({
   origin: ["https://electronicsitem.netlify.app","http://localhost:5173" ],
   credentials: true
   }));
app.use(cookieParser());  //🔹 2. cookie-parser kya hai?..👉 Ye Express middleware hai...👉 Internally ye cookie package ka hi use karta hai.... now easily access req.cookies.refreshToken


app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product",productRoute);
app.use("/api/v1/cart",cartRoute);
app.use("/api/v1/orders", orderRoute);

const createConnection = async () => {
  try {
    await connectDB();
    app.listen(port, (req, res) =>{
      console.log(`server listening on http://localhost:${port}`)

  const URL = "https://ekart-x65h.onrender.com/ping";

  const ping = async () => {    //for making feature like cron job..for continue server running....
    try { 
      await fetch(URL);
      console.log("Ping sent");
    } catch (err) {
      console.error(err.message);
    }
  };
   ping();
  setInterval(ping, 10 * 60 * 1000);
       
    }
    );
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }   
};

createConnection();
