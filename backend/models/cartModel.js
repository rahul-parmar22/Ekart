import mongoose from "mongoose";

const cartSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
           },
items:[
    {
      productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
      },
      quantity:{
        type:Number,
        required:true,
        default:1
      },
      price:{         // aa price pan upar je item chhe teni j price chhe...pan jo admin productPrice change kare to bill aa old price nu j bane ..karan ke user e item aa old price ne dhyan ma rakhine add kari hoy item cart ma ...to ui ma bhale prodcut price vadheli batave pan bill aa price pramane bantu hoy  chhe  item.price*item.quantity 
                      //pan aa price ma ek scenario chhe ke jyare user cart ma item add kare ane tyare je price hoy ej price pachhi tene dekhade e price ne according bill ma badhi item batavta hoy...to aa price e chhe... 
        type:Number,
        required:true 
      }
    }
],
totalPrice:{ // upar chhe e badhi itemni ni badhi quantity sathe multiply karine totalPrice
    type:Number,
    default:0,

}


},{  timestamps:true})


export const Cart= mongoose.model("Cart", cartSchema)