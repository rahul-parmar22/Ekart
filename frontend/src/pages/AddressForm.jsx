import { privateApi } from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; //import { Label } from "radix-ui";  ghani var suggetion ma avi rite aavi jay to tya error aave to aa no import karvu
import { Separator } from "@/components/ui/separator";
import {
  addAddress,
  deleteAddress,
  setCart,
  setSelectedAddress,
} from "@/redux/productSlice";
import { Currency } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddressForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const { cart, addresses, selectedAddress } = useSelector(
    (store) => store.product,
  );
  const [showForm, setShowForm] = useState(
    addresses?.length > 0 ? false : true,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    dispatch(addAddress(formData));
    setShowForm(false);
  };

  const subtotal = cart.totalPrice;
  const shipping = subtotal > 250 ? 0 : 10;
  const tax = parseFloat((subtotal * 0.05).toFixed(2));
  const total = subtotal + shipping + tax;

  console.log(cart);
                                     //   💡 Payment flow
                                     // 👉 Flow kya hai:
                                     // User “Pay Now” click karta hai
                                     // Frontend backend ko bolta hai: “order bana do”
                                     // Backend Razorpay order create karta hai
                                     // Frontend Razorpay popup open karta hai
                                     // User payment karta hai
                                     // Razorpay response deta hai
                                     // Hum backend ko verify karte hain
  const handlePayment = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const { data } = await privateApi.post( //directly res object descructure res.data
       "/orders/create-order",
        {
          products: cart?.items?.map((item) => ({   //array banave badhi item  na objectno ane ek object ma product ni Id and quantity  👉 Cart ke items ko clean format me convert kar rahe ho
            productId: item.productId._id,
            quantity: item.quantity,
          })),
          tax,
          shipping,
          amount: total,
          currency: "INR",
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      if (!data.success) toast.error("Something went wrong");

      console.log("Razorpay data:", data);

      const options = {  //what is option? 👉 Ye Razorpay ka configuration hai...👉 Isme sab settings hoti hain
        key: import.meta.env.VITE_RAZORRPAY_KEY_ID,   //👉 Razorpay public key...👉 frontend me safe hoti hai
      
                                //below three is 👉 Backend me jo order banaya razorpayInstance ne vo order backend ke res me aa rha hai to ye us order ki detailes hai..👉 Wo Razorpay ko pass ho raha hai
        amount: data.order.amount,   //see backend logic...what is in response given by create-order controller                                
        currency: data.order.currency,
        order_id: data.order.id, //Order ID from backend

                             // below both is Basic UI info 👉 Razorpay popup me dikhata hai
        name: "Ekart",
        description: "Order Payment",

                                           //rozarpay ma uparni info jay ane payment successfull thay pachhi nicheno function chalshe.....
        handler: async function (response) { //❓ response kya hota hai?...👉 Razorpay automatically yaha bhejta hai:: niche chhe e object
                                            //{razorpay_payment_id: "...",  razorpay_order_id: "...",  razorpay_signature: "..." } 
                                          //👉 Payment SUCCESS hone ke baad ye function run hota hai....
          try {
            console.log(response)  //razorpay e res ma shu mokalyu te jova mate
            const verifyRes = await privateApi.post(    //👉 Backend ko bol rahe ho:: “Check karo payment asli hai ya fake”
             "/orders/verify-payment",                  //backend ma verify payment ma je req.body thi badhi id and sugnature lyo chho e ahithi jay chhe
              response,                                   //razorpay ma paymetn thai gya pachhi je resopnse aavyo te backend ne mokaliye chhie..aa handler payment pachhi chalshe to response ma razorpay shu mokle te console karavi shakay ke pachhi upar lakhelu j chhe
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              },
            );
            if (verifyRes.data.success) {
              toast.success("✅Payment Successfull");
              dispatch(setCart({ items: [], totalPrice: 0 }));
              navigate("/order-success");
            } else {
              toast.error("❌ Payment varification failed");
            }
          } catch (error) {
            console.log(error)
            toast.error("Error verifying paymnet");
          }
        },      //handler tabhi run hota hai jab:👉 USER SUCCESSFULLY PAYMENT COMPLETE karta hai.... ye hum manually run nahi karte after successful rozarpay automatic trigger karta ahi
               //rozarpay flow:: rzp.open() 1. User popup open karta hai... 2. User payment karta hai (UPI/Card)..3. Razorpay server verify karta hai..4. Agar SUCCESS: ye trigger hota hai :handler(response)..                 


        modal: {   //🔹modal close event...❌ USER CLOSES PAYMENT WINDOW..🚪  User CLOSED popup...user ne cancle kar diya
          ondismiss: async function () {      //👉 User ne payment cancel kiya to ye chalega  // User ne popup close kar diya ❌“Cancel” press kiya ❌Payment start hi nahi ki ❌  👉 Yaha payment attempt hi nahi hua
         "/orders/verify-payment",                             
            //Handle user closing the popup  //webhooks thi
            await privateApi.post(               
             "/orders/verify-payment",
              {
                razorpay_order_id: data.order.id,
                paymentFailed: true,    //user modal close kari de to 👉 Backend ko bol rahe: “user ne cancel kiya”...
              },                         //to modal close--> cancel order--> paymentFailed true aapvi aapane ane backend ma mate aapane tya joyu htu ke paymentFaield:true means faield hoy to order nu status faield batavo em
              {
                headers: {
                Authorization: `Bearer ${accessToken}`,
                },
              },
            );
            toast.error("Payment Cancelled or Failed");
          },
        },
        prefill: {    //👉 Razorpay popup me auto fill ho jata hai ye data
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#F472B6" },     //👉 popup ka color
      };

      //🚀 RAZORPAY OPEN
      const rzp = new window.Razorpay(options); //“Razorpay ka payment engine ready karo, but open mat karo”// so ab:popup ready hai...settings loaded hain...but UI open nahi hu  open tab hoga jab rzp.open() hoga  

      // Listen for payment failures  // 
      rzp.on("payment.failed", async function (response) { //rzp.on("payment.failed");  -->💥 1. payment.failed kab chalta hai?....Card declined ❌UPI fail ❌Bank reject ❌   👉Payment attempt hua, but success nahi hua......👉 Yaha user ne TRY to pay kiya tha, but fail ho gaya tab chalega...
        await privateApi.post(                //modal: ondismiss(option ma chhe e) kyare chalshe jyare   User ne popup close kar diya ❌“Cancel” press kiya ❌Payment start hi nahi ki ❌  👉 Yaha payment attempt hi nahi hua
         "/orders/verify-payment",                             
          {
            razorpay_order_id: data.order.id,
            paymentFailed: true,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );  
        toast.error("Payment Failed. Please try again")

      });




                    //index.html me popup ki script dali hai to isaliye ye popup khulta hai 
      rzp.open()   // means “ab payment popup dikhao user ko”//  Razorpay UI open hota hai ...user card/UPI choose karta hai...payment process start hota hai
                 //🎯 Popup me kya hota hai?..Razorpay khud show karta hai:Card input 💳...UPI QR 📱..Netbanking 🏦..Wallets(👉 ye sab tu nahi banata ❌....👉 Razorpay ka ready-made UI hai ✔️(ui design, payment methods sab razorpay karta hai))
    } catch (error) {
      console.error(error);
      
      toast.error("Something went wrong while processing payment")
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid  place-items-center p-10">
      <div className="grid grid-cols-2 items-start gap-20 mt-10  max-w-7xl mx-auto">
        <div className="space-y-4 bg-white">
          {showForm ? (
            <>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  required
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  required
                  placeholder="+91 9847549875"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  required
                  placeholder="123 Street, Area"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    required
                    placeholder="kolkata"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    required
                    placeholder="West Bengal"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zip">Zip Code</Label>
                  <Input
                    id="zip"
                    name="zip"
                    required
                    placeholder="956858"
                    value={formData.zip}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    required
                    placeholder="India"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <Button onClick={handleSave} className="w-full cursor-pointer">
                Save & Continue
              </Button>
            </>
          ) : (
            <div className="space-y-4 ">
              <h2 className=" text-lg font-semibold">Saved Addresses</h2>
              {addresses.map((addr, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => dispatch(setSelectedAddress(index))}
                    className={`border p-4 rounded-md cursor-pointer relative ${selectedAddress === index ? "border-pink-600 bg-pink-50" : "border-gray-300"} `}
                  >
                    <p className="font-medium">{addr.fullName}</p>
                    <p>{addr.phone}</p>
                    <p>
                      {addr.address}, {addr.city}, {addr.state}, {addr.country}
                    </p>
                    <button
                      onClick={() => dispatch(deleteAddress(index))}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
              <Button
                variant="outline"
                className="w-full cursor-pointer"
                onClick={() => setShowForm(true)}
              >
                + Add New Address
              </Button>
              <Button
                disabled={selectedAddress === null}
                onClick={handlePayment}
                className="w-full bg-pink-600"
              >
                Proceed To Checkout
              </Button>
            </div>
          )}
        </div>

        {/* Right side order summary  */}
        <div>
          <Card className="w-[400px] ">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({cart.items.length}) items </span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shipping}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax </span>
                <span>₹{tax}</span>
              </div>
              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total}</span>
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
  );
};

export default AddressForm;

//Error section::

//1.  A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info:
//2.  Error handled by React Router default ErrorBoundary: Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object. Check the render method of `AddressForm`.
