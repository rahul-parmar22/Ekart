import mongoose from 'mongoose';

const productSchema =new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:'User'
    },
    productName:{
        type:String, required:true
    },
    productDesc:{type:String, required:true},
    productImg:[
        {
            url:{type:String, required:true},
            publicId:{type:String, required:true}
        }
    ],
    productPrice:{  //only ek product ni price
        type:Number,

    },
    category:{type:String},
    brand:{type:String},
    productStock:{
        type:Number,
        required:true,
        default:0,
    }
},
{
  timestamps:true
},);

export const Product= mongoose.model('Product', productSchema); 
