import { Shield, Truck } from "lucide-react";
import React from "react";

const Features = () => {
  return (
    <section className="py-12 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:justify-around gap-8 md:gap-0">
        <div className="flex items-center justify-center gap-4">
          <div className=" bg-blue-100 p-3  rounded-full">
            <Truck className="size-7 text-blue-600" />
          </div>
          <div className="flex flex-col justify-center ">
            <div className="font-bold">Free Shipping</div>
            <div className="text-gray-500 font-medium">On orders over $50</div>
          </div>
        </div>

                <div className="flex items-center justify-center gap-4">
          <div className=" bg-green-100 p-3  rounded-full">
            <Shield className="size-7 text-green-600" />
          </div>
          <div className="flex flex-col justify-center ">
            <div className="font-bold">secure Payment</div>
            <div className="text-gray-500 font-medium">100% secure transaction</div>
          </div>
        </div>
                <div className="flex items-center justify-center gap-4">
          <div className=" bg-purple-100 p-3  rounded-full">
            <Truck className="size-7 text-purple-600" />
          </div>
          <div className="flex flex-col justify-center ">
            <div className="font-bold">24/7 Support</div>
            <div className="text-gray-500 font-medium"> Always here to help</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
