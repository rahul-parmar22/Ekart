import { Product } from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

//findById()  // single document object aape, no match hoy to null //findById() internally findOne({ _id: id }) ka shortcut hai
//find(filter, projection, options)      //multiple documents aape + projection(kaunse fields chahiye ({ name: 1, price: 1 })) e aape, select valu , no male data to [] return kre
//to jya jya single find karvanu chhe tya findById use karel chhe

export const addProduct = async (req, res) => {
  try {
    const { productName, productDesc, productPrice, category, brand , productStock} =
      req.body;
    const userId = req.id;
    if (!productName || !productDesc || !productPrice || !category || !brand ||!productStock) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //Handle multiple image uploads
    let productImg = [];
    //req.files multer middleware use karyu route ma tyathi aave chhe
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri, {
          //cloudinary from utils folder file
          folder: "mern_products", //cloudinary folder name // aa folder banshe ane ema image save thashe
        });

        productImg.push({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    }

    //create a product in DB
    const newProduct = await Product.create({
      userId,
      productName,
      productDesc,
      productPrice, // 1,45,600 aa string kevay// 145600 aa num kevay...backend ma comma aapine pass no karvi value..tya only num aapva then , frontend ma show karti vakhte format mate ek fun aave teno use kari levo
     productStock, 
      category,
      brand,
      productImg, //array of objects looks like, [{url,publicId},{url,publicId} ]
    });

    return res.status(200).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProduct = async (_, res) => {
  try {
    const products = await Product.find();

    if (!products) {
      return res.status(404).json({
        success: false,
        message: "No product available",
        products: [],
      });
    }
    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    //Delete images from cloudinary
    if (product.productImg && product.productImg.length > 0) {
      for (let img of product.productImg) {
        const result = await cloudinary.uploader.destroy(img.publicId);
      }
    }

    //Delete product from mongodb
    await Product.findByIdAndDelete(productId); //automatic find kare id thi ...nakar Product.deleteOne({_id:productId}) aam karvu pade

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully ",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      productName,
      productDesc,
      productPrice,
      productStock, 
      category,
      brand, //BELOW LINE is IMPORTANT
      existingImages, //existingImages = frontend se bheja text/JSON, IDs of old images to keep//Pehle se product me jo images hain, wo Multer se nahi aayegi, bas IDs existingImages me aayengi//  ...ahi existing image ma je frontend thi aave chhe e only json type data aave chhe ...image nathi aavti ahiya.. tamara frontend ma je product images dekhay e badhi image cloudinary thi aavti hoy chhe ...to tame koi pan image change karya vina ke delete image karine update button dabavo to te image  cloudinary ma hoy tyathi teni id aavti hoy chhe e image pachhi update dabavyu etale nathi aavti..have aapne je imageId aavi tene according cloudinary thi delete karvi chhi image ne..aapana memory ke storage evama kyay nathi hoti... ane jyare  tame new image add karo to ane toj te image aa update product na route ma je multer middleware use karyu tena through aave ane cloudinary ma uplaod thay...// Multer = sirf naye uploaded files handle karega
    } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let updatedImages = [];

    //Keep selected old images//game tyare update button click thay etale aa fun chale ...bhale image add karo ke delete karo ke kai no karo...karan ke request.body mathi image aavvani j chhe to aa existingImage chalvanu j chhe

    // Step 1: parse existingImages
    if (existingImages) {
      const keepIds = JSON.parse(existingImages); // convert a JSON string into a native JavaScript object or array... array no type pan object j chhe... This is essential for working with data received from a web server via an API call, as that data is always initially a string..je string  ma array aave chhe e json array ne simple array ma convert kare aa 
      updatedImages = product.productImg.filter((img) =>
        keepIds.includes(img.publicId),
      ); //[A,B,C] aa tran image chhe ane jo emnam rakho badhi to keepId ma badhi re ane jo B kadhi nakho to [A,C] re...to removedImages check kare ke pela [A,B,C] hati product ma ane have [A,C] chhe to B ne remove kare then cloudinry mathi....

      //delete only removed images // Step 2: filter out removed images
      const removedImages = product.productImg.filter(
        (img) => !keepIds.includes(img.publicId),
      );

      // Step 3: delete removed images from Cloudinary
      for (const img of removedImages) {
        await cloudinary.uploader.destroy(img.publicId);
      } 
    } else {
      updatedImages = product.productImg; //keep all if nothing sent
    }

    //upload new images if any // Step 4: upload new images from req.files
    //req.files multer middleware use karyu route ma tyathi aave chhe
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "mern_products", //apace aapvi nahi folder name ni andar "mern_products " aavu nahi chale
        });
        updatedImages.push({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    }

    //update product
    product.productName = productName || product.productName;
    product.productDesc = productDesc || product.productDesc;
    product.productPrice = productPrice || product.productPrice;
    product.productStock = productStock || product.productStock;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.productImg = updatedImages;

    await product.save();
    return res.status(200).json({
      success: true,
      message: "Product upadated Successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

   



