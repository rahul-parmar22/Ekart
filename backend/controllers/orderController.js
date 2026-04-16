import razorpayInstance from "../config/razorpay.js";
import { Cart } from "../models/cartModel.js";
import { Order } from "../models/orderModel.js";
import crypto from "crypto";
import { User } from "../models/userModel.js";
import { Product } from "../models/productModel.js";

export const createOrder = async (req, res) => {
  try {
    const { products, amount, tax, shipping, currency } = req.body;
    const options = {
      amount: Math.round(Number(amount) * 100), //convert to paise//👉 Razorpay paisa me leta hai (₹1 = 100 paise)
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,   //👉 unique ID tracking ke liye
    };

    const razorpayOrder = await razorpayInstance.orders.create(options); //method chhe yad j rakhvi..order create thata time lage mate await // console log karine joi levu ke shu shu return kare chhe aa means razorpayOrder ma shu shu aavshe em
                                            //👉 Razorpay server ko call kiya...👉 Wo ek official order banata hai
    //save order in DB
    const newOrder = new Order({
      user: req.user._id,
      products,
      amount,
      tax,
      shipping,
      currency,
      status: "Pending", //bydefault pending hashe
      razorpayOrderId: razorpayOrder.id,  //👉 Razorpay ka order ID save (VERY IMPORTANT)
    });

    await newOrder.save();

    res.json({
      success: true,
      order: razorpayOrder,
      dbOrder: newOrder,
    });
  } catch (error) {
    console.error("❌ Error in create Order:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyPayment = async (req, res) => { //👉 Jab payment complete hota hai, frontend yaha hit karta hai
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpya_signature,
      paymentFailed,
    } = req.body;           //handler(response) ma je tame response tya aapo e ahi aave chhe req.body ma..ane direct destructure karie chhie aapane....
    const userId = req.user._id;

    if (paymentFailed) {
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "Failed" },
        { new: true },
      );
      return res
        .status(400)
        .json({ success: false, message: "Payment failed", order });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto                               //👉 Fake payment avoid karne ke liye.. 👉 Sirf Razorpay hi correct signature bana sakta hai    
      .createHmac("sha256", process.env.RAZORPAY_SECRET)  //ahi je razorpay secret chhe e razorpayna dashboard ma tame config karelu hoy to razorpya tyathi aa badhu laine ek generate kare signature and tame aaya manually generate karavo ane banne ne check karo etale khabar padi jay ke jo same hoy to "paid" em 
      .update(sign.toString())
      .digest("hex");

    if (expectedSignature === razorpya_signature) {
 
         // ✅ Step 1: Pehle find karo.. ghani var  be var hit thai jay verify karvanu to tyare be var stock reduce thai jay to no chale..mate check karvu ke order chhe pelathi
const order = await Order.findOne({
  razorpayOrderId: razorpay_order_id,
});

// ❗ Safety check
if(!order){
  return res.status(404).json({message:"Order not found"})
}

// ✅ Step 2: Duplicate check  // ahi check thay jo be var hit thay request to // 
 
if(order.status === "Paid"){  //paid hoy to first time stock reduce karelo hoy to pachho no karvo em
  return res.json({
    success:true,
    message:"Already processed"
  })
}

// ✅ Step 3: STOCK REDUCE  //payment verify thay pachhi j stock reduce thay
for( const item of order.products){
  await Product.updateOne(
    {_id:item.productId},
    {$inc:{productStock:-item.quantity}}
  ); 
}

// ✅ Step 4: AB update karo

const updatedOrder = await Order.findOneAndUpdate(
  {razorpayOrderId: razorpay_order_id},
  {
    status:"Paid",
    razorpayPaymentId:razorpay_payment_id,
    razorpaySignature:razorpya_signature,
  },
  {new:true}
)

      await Cart.findOneAndUpdate(
        { userId },
        { $set: { items: [], totalPrice: 0 } },
      );

      return res.json({
        success: true,
        message: "Payment Successfull",
        order,
      });
    } else {
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "Failed" },
        { new: true },
      );
      return res.status(400).json({
        success: false,
        message: "Inavalid Signature",
      });
    }
  } catch (error) {
    console.error("❌ Error in verify Payment:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyOrder = async (req, res) => {
  try {
    const userId = req.id; //ahi niche find ma userna atyar sudhina badha orderes find kare aa....past ma jetala pan order hoy te badha find kare
    console.log(req.id);

    const orders = await Order.find({ user: userId })
      .populate({
        path: "products.productId", //khali populate('products') karo to kai nahi male..mate destructure karine je field ma ref aapel chhe teno j path aapvu
        select: "productName productPrice productImg", //this method always use in production when we want to add more options like match, sort, etc....populate({ path: "products.productId", select: "productName price", match: { isActive: true }, options: { sort: { price: -1 } } }) aa path vala option ma aavu thay pan simple populate('products.productId', 'productName pPrice') ma te sort vagere add no kari shakvi..to use pramane syntax use karvi
      })
      .populate("user", "firstName lastName email");
    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Admin only
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params; //userId will comes from url
    const orders = await Order.find({ user: userId })
      .populate({
        path: "products.productId",
        select: "productName productPrice productImg",
      }) //fetch Product details
      .populate("user", "firstName lastName email"); //fetch user info

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.log("Error fetching user orders: ", error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "firstName lastName email")  //populate user info
      .populate("products.productId", "productName  productPrice");  //populate product info

      res.status(200).json({
        success:true,
        count:orders.length,
        orders
      })

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch all orders",
      error: error.message,
    });
  }
};


export const getSalesData = async(req,res)=>{
  try {
    const totalUsers = await User.countDocuments({});
    const totalProducts = await Product.countDocuments({});
  const totalOrders = await Order.countDocuments({status:"Paid"}); 
 
  // Total sales amount 

  const totalSaleAgg = await Order.aggregate([
    {$match: {status:"Paid"}}, 
    {$group: {_id: null, total:{$sum:"$amount"}}} //jo ahi _id hoy, kai pan set kari shako id ma...pan je je uparna document je match thaine aavya hoy to teni same id nu ek group bane ane tena par bajuni field apply thay...like jo _id:"$status" ("$" aapvu pade..to e samje ke je order chhe tena document ni status field ne select karvanu chhe em..same koi pan field ne access karva "$" use karvu) aapel hoy to status ma failed vala, pending vala and paid vala traney nu gorup bane ane enu total thay amount alag alag ane array aape ...kaik aavo [{ _id: 'Failed', total: 1600 },{ _id: 'Pending', total: 500 },{ _id: 'Paid', total: 7100 }] have aa array ne destructure karine nichhe chhe em ...
  ])
  console.log(totalSaleAgg);
  
     //Aggregation hamesha array return kare chhe..MongoDB हर stage को एक pipe में भेजता है।..data → stage1 → stage2 → stage3 → result.. etale aggregation pipelining
       // totalSalesAgg aavo data return karshe kaik.. [{ _id:null, total:1200 }]
  const totalSales = totalSaleAgg[0]?.total || 0;

  
  //sales grouped by date(last 30 days)
const thirtyDaysAgo = new Date() // new Date() current date and time aape 2026-03-11T10:30:00.000Z // 2026-03-11(date) // T -> ahithi date and time nokha pade // 10:30:00.00(h, m,second and milsec)
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate()-30) // getDate यह month का day number देता है।  2026-03-11 hoy to getdate 11 aape...tarikh aape aajni em... emathi 30 minus karo etale minus ma value aave pan जब तुम setDate() में negative value देते हो तो वह previous month में adjust कर देता है।..setDate(5)  hoy to means जब तुम setDate() में negative value देते हो तो वह previous month में adjust कर देता है। lai le...jo minus hoy to previous month mathi adjust kari le
console.log("30 days ago:", thirtyDaysAgo);
//aa bdhi method ma type khas dhyan rakhva..like backend ma createdAt e Date()  hovo joie nahi ke string...me dummy data direct compass thi add karyo to tya createdAt:"2026-02-09T08:55:11.705Z" karyu pan aa have string chhe..mate  createdAt: new Date(2026-02-09T08:55:11.705Z) aavu karvu pade..to khas dhyan rakhvu....aavi string date ne toLocaleString thi data kadhi shako pan aggreagation  vagere query lagava mate data type Date() joie


const salesByDate = await Order.aggregate([
  {$match:{status:"Paid", createdAt:{$gte: thirtyDaysAgo}}}, //aa first stage match karine aape data..means find jevu kam hoy aanu..
  { $group:{ //data nu group banave..niche je _id hoy tena pramane data nu group banave ahi same date na data nu group banshe 
    _id:{
      $dateToString:{format:"%Y-%m-%d", date:"$createdAt"} // $createdAt to $ show kare chhe ke aa order schema chhe teno cretedAt em..
    },            // ahi upar  format ma Y e capital hovo joie
    amount:{$sum:"$amount"},  //same group na data par operations kare
  }
}, 
{$sort:{_id:1}}
])
console.log("salesByDate", salesByDate);

const formattedSales = salesByDate.map((item)=>({
  date:item._id,
  amount:item.amount
  }))
console.log(formattedSales);

res.json({
  success:true,
  totalUsers,
totalProducts,
totalOrders,
totalSales,
sales:formattedSales
})

  } catch (error) {
    console.error("Error fetching sales data:", error)
    res.status(500).json({
      success:false,
      message:error.message
    })
  }
}