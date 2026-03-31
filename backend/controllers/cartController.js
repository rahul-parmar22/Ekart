import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";
//stock add karta samye nicheni problem aavi ti 1 day lagyo hto.. frontend and backend banne jagyae hamesha validation lagavvu
// IMOPRTANT::  kyarey pan populate data and non-populate ne bhega nahi karva,,..cart and populate.cart to have aa bhale cart rahya banne pan aana badha destructurena karne badhi method , badha rule badhu badlai jay chhe to hamesha khas dhyan rakhvi.... karan tame only cart rakhyu hoy to teni andar product ne destructure karine access nahi kari shako .....jo cart.popualte vagere hashe toj kari shaksho

export const getCart = async (req, res) => {
  try {
    const userId = req.id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");//aa badha populate karva khub jaruri chhe karan ke pachhi frontend ma aapane aa cart aapvi to res.data.cart ma aapane product.productId.price , name badho product no data show karva mate use karta hovi to tyare error aave ....
    
    if (!cart) {
      return res.json({ success: true, cart: [] });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.body;

    //1. Check if product exist
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 2. Get cart (NO populate ❗) ..find the user's cart (if exist)
   let cart = await Cart.findOne({ userId })
    
    //3. IF cart does not exists, create a new one
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity: 1, price: product.productPrice }],
        totalPrice: product.productPrice,
      });
    } else {
      //4. Check if product already in cart
      const itemIndex = cart.items.findIndex(
        //findIndex() → Array method, pehla matching element ka index return karta hai.. aa index return kare chhe
        (item) => item.productId.toString() === productId, //MongoDB me _id ek ObjectId hota hai, aur frontend se string aata hai...toString() se donu ko string bana kar compare karte hain
      );

      if (itemIndex > -1) {
        //Agar product cart me pehle se hai increase qunatity with stock check → itemIndex = 0 ya higher//Agar product cart me nahi hai → itemIndex = -1
        //if product exists --> just increase contity
      if(cart.items[itemIndex].quantity < product.productStock){ // aa khali backend thi validatio lagavvi chhie ...frontend thi j jyare stock puro thay etale button disabled kari devanu chhe to aa condition to aavshe j nahi pan aato backendma pan validatio lagavel chhe
         cart.items[itemIndex].quantity += 1; // findIndex darek items.findIndex chhe to items ni item ne le ane match karto jay..je pela male te item ni index return kare.. 0,1,2 jo 0 index hoy to pan means ek var to chhej item to means already chhe product items ma to items[itemIndex] karvathi  itemIndex nakho etale je find kari hti product e mali jay ane teni quantity ma +=1 kari nakhvi     
      } else {
        return res.status(400).json({
          success:false,
          message:"Stock limit reached", 
        })
      }
      } else {

        //if new product --> push to cart
        cart.items.push({
          productId,
          quantity: 1,
          price: product.productPrice,
        });
      }

          // 5. ALWAYS recalc total (NO populate dependency ❗)
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

}
    //Save updated cart
    await cart.save();

    //Populate product details before sending response
    // const populatedCart = await Cart.findById(cart._id).populate(
    //   "items.productId", // have items ma productId ni jagyae aakho e productmodel aavi jashe..full detaile te product ni because of population
    // );

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const userId = req.id;
    const { productId, type } = req.body;

    let cart = await Cart.findOne({ userId }).populate("items.productId");

    // console.log(cart); // aa cart aape pan je populate thay object e no show kare terminal ma..mate tene jova mate nicheni method vapravi
    // console.log(JSON.stringify(cart, null, 2)); // aa all indepth data show kare..aa method string ma etale json datama convert karvani chhe pan ..tene console karo etale batave data.. aa tran parameter le ane shenathi shu thay tena mate google karvu.. 2 only extra space aapva mate., prettier formate mate chhe

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.productId._id.toString() === productId,
    ); // aa ek item chhe to aana par populate() nahi chale ..directly .find() se nikale hue object ko populate nahi kar sakte.... karan ke aa ek mongodb collection nathi....mate item ne popualte karvi hoy to have tamare const product = await Product.findById(item.productId); aam karvu pade  to chale
    //populate() only .populate() sirf Mongoose query ya document level pe kaam karta hai, jaise:await Cart.findById(cartId).populate('items.productId');
    console.log(item);

    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });

    if (type === "increase") { //Stock ko sirf cart me add karne se reduce nahi karte..atyare only cart ma add karta samye stock ni value nathi reduce karvani..karan ke diff users cart ma to product nakhta j hoy chhe
                              //Order place: User checkout karta hai → stock check & reduce hota hai... Order cancel/refund: Agar order cancel hota hai → stock wapas increase hota hai.
      if (item.quantity < item.productId.productStock) {
        item.quantity += 1;
      } else {
        return res.status(400).json({
          success: false,
          message: "Cannot increase. Stock limit reached.",
        });
      }
    }

    if (type === "decrease" && item.quantity > 1) item.quantity -= 1;

cart.totalPrice = cart.items
  .filter(item => item.productId.productStock > 0) // only in-stock items
  .reduce((acc, item) => acc + item.price * item.quantity, 0);
    await cart.save();

    cart = await cart.populate("items.productId");

    res.status(200).json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.body;

    let cart = await Cart.findOne({ userId }).populate("items.productId")
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });



const itemToRemove = cart.items.find((item)=> item.productId._id.toString() === productId);

       cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId,
    );


if(itemToRemove) cart.totalPrice -= itemToRemove.price * itemToRemove.quantity
       
    // cart.totalPrice = cart.items.reduce(  // aa pan thay..aanthi pan extra loop chale..uparnama only first find karine delete
    //   (acc, item) => acc + item.price * item.quantity,
    //   0,
    // );

 


    await cart.save();
    console.log( "Cart is this" , cart);
    
    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
