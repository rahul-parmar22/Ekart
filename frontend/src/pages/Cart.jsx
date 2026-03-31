import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import userLogo from "/public/defaultProfilePic.png";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { setCart } from "@/redux/productSlice";
import { toast } from "sonner";

const Cart = () => {
  const { cart } = useSelector((store) => store.product);
  console.log(cart);

  //👉 Frontend kabhi bhi price calculate nahi karega

  //   const subTotal = cart?.items //to aa kyarey nahi karvanu
  // ?.filter((item=>item?.productId.productStock > 0 ))
  // ?.reduce((acc,item)=> acc + item?.productId?.productPrice * item.quantity, 0)

  const subTotal = cart?.totalPrice || 0;
  const shipping = subTotal > 299 ? 0 : 10;
  const tax = subTotal * 0.05; //5% tax
  const total = subTotal + shipping + tax;
  const navigate = useNavigate();   // navigate("products/498574")  to aa relateive path chhe ..upar je url chhe emaj aa path jodashe.. jo cart ma hov ane aa navigate thay to path ma localhost/cart/product/454 bane mate navigate(/products/4545) to aa new path bane .... 
  const dispatch = useDispatch();

  const API = "http://localhost:8000/api/v1/cart"; // axios ma get,post,put, delete method mate data pass karvana different order chhe to e order ma data pass karva anhi to error... like delete(url, header,) ane headers ma data, post mate post(url,data, headers) to aa khas dhyan rakhvu
  const accessToken = localStorage.getItem("accessToken");

  const loadCart = async () => {
    try {
      const res = await axios.get(`${API}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateQuantity = async (productId, type) => {
    try {
      const res = await axios.put(
        `${API}/update`,
        { productId, type },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await axios.delete(`${API}/remove`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: { productId },
      });
      if (res.data.success) {
        console.log(res.data.cart);
        dispatch(setCart(res.data.cart));
        toast.success("Product removed from cart");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      {cart?.items?.length > 0 ? (
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-7">
            Shopping Cart
          </h1>
          <div className="max-w-7xl mx-auto flex gap-7">
            <div className="flex flex-col gap-5 flex-1">
              {cart?.items?.map((product, index) => {
                return (
                  <Card key={index}>
                    <div className="flex justify-between items-center pr-7 ">
                      <div className=" flex items-center w-[350px] gap-1">
                        <Link to={`/products/${product?.productId?._id}`}>
                          <img //navigate on click par karva karta link tag no use karvo ..vadhare saru lage..
                            src={
                              product?.productId?.productImg?.[0]?.url ||
                              userLogo
                            }
                            alt="cart product image"
                            className="w-25 h-25 rounded-full"
                          />
                        </Link>
                        <div className="w-[280px]">
                          <h1 className="font-semibold truncate">
                            {product?.productId?.productName}
                          </h1>
                          <p>₹{product?.productId?.productPrice}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-3">
                        {product?.productId?.productStock > 0 ? (
                          <div className="flex gap-5 items-center">
                            {/* niche button ma variant hatavine pan joi levu..diff variant aave jema alag design hoy ..shadcn na badha component ma */}
                            <Button
                              disabled={product?.quantity == 1} // aa badha disabled lagavvathi extra server par request nahi jay.. nahi to aa no lagado to quantity to 1 j batave karan ke controller ma 1 thi occhu no hoy evu set karel hoy pan button disabled no hoy to darek click par request jay ane load pade server par
                              onClick={() => {
                                handleUpdateQuantity(
                                  product.productId._id,
                                  "decrease",
                                );
                                //console.log(typeof(product?.productId?.productStock))
                              }}
                              variant="outline"
                            >
                              -
                            </Button>
                            <span>{product.quantity}</span>
                            <Button
                              disabled={
                                product.quantity >=
                                product?.productId?.productStock
                              }
                              onClick={() =>
                                handleUpdateQuantity(
                                  product.productId._id,
                                  "increase",
                                )
                              }
                              variant="outline"
                            >
                              +
                            </Button>
                          </div>
                        ) : (
                          <span className="text-red-500 font-semibold">
                            Out of stock
                          </span>
                        )}

                        <div className="font-medium">
                          {product?.productId?.productStock}
                        </div>
                      </div>
                      <p>
                        ₹{product?.productId?.productPrice * product?.quantity}
                      </p>
                      <p
                        onClick={() => handleRemove(product?.productId?._id)}
                        className="flex text-red-500 items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
            <div>
              <Card className="w-[400px]">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({cart?.items?.length} items)</span>
                    <span>₹{cart?.totalPrice?.toLocaleString("en-IN")}</span>
                  </div>
                  <div className=" flex justify-between">
                    <span>Shipping</span>
                    <span>₹{shipping}</span>
                  </div>
                  <div className=" flex justify-between">
                    <span>Tax(5%)</span>
                    <span>₹{tax}</span>
                  </div>
                  <Separator />
                  <div className=" flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="space-y-3 pt-4">
                    <div className="flex space-x-2">
                      <Input placeholder="promo code" />
                      <Button variant="outline">Apply </Button>
                    </div>
                    <Button
                      onClick={() => navigate("/address")}
                      className="w-full bg-pink-600"
                    >
                      PLACE ORDER
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Link to="/products">Continue Shopping</Link>
                    </Button>
                  </div>

                  <div className="text-sm text-muted-foreground pt-4">
                    <p>* Free shipping on orders over 299</p>
                    <p>* 30-days return policy</p>
                    <p>* Secure checkout with SSL encryption</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
          {/* Icon  */}
          <div className="bg-pink-100 p-6 rounded-full ">
            <ShoppingCart className="w-16 h-16 text-pink-600 " />
          </div>
          {/* title  */}
          <h2 className=" mt-6 text-2xl font-bold text-gray-800">
            Your cart is Empty
          </h2>
          <p className=" mt-2 text-gray-600">
            Looks like you haven't added anything to your cart yet
          </p>
          <Button
            onClick={() => navigate("/products")}
            className="mt-6 cursor-pointer bg-pink-600 text-white px-6 hover:bg-pink-700"
          >
            Start Shopping
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
