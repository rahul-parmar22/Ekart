import { ShoppingCart } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitterSquare } from "react-icons/fa";
import { FaPinterest } from "react-icons/fa";

import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 pt-10">
      <div className="max-w-7xl mx-auto px-4 md:flex md:justify-between">
        {/* info */}
        <div className="mb-6 md:mb-0">
          <Link to="/" className="text-lg text-pink-600 flex items-center">
            <ShoppingCart className="size-20" />
            <span className=" font-bold ">KART</span>
          </Link>
          <p className="mt-2 text-sm">
            Powering Your World with the Best in Electronics.
          </p>
          <p className="mt-2 text-sm">
            123 Electronics SL, Style City , NY 10001
          </p>
          <p className="text-sm">Email:support@Zaptro.com</p>
          <p className="text-sm">Phone:(123)456-7890</p>
        </div>

        {/* customer service link */}
        <div className="mb-6 md:mb-0">
          <h3 className="font-semibold text-xl ">Customer Service</h3>
          <ul className="mt-2 text-sm space-y-2">
            <Link to="">
              <li>Contact us</li>
            </Link>
            <Link to="">
              <li>Shipping & Returns</li>
            </Link>
            <Link to="">
              <li> FAQs</li>
            </Link>
            <Link to="">
              <li> Order Tracking</li>
            </Link>
            <Link to="">
              <li> Size Guide</li>
            </Link>
          </ul>
        </div>

        {/* social media links */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-semibold">Follow Us</h3>
          <ul className="flex space-x-4 mt-2">
            <Link>
              <li>
                <FaFacebook />
              </li>
            </Link>
            <Link>
              <li>
                <FaInstagram />
              </li>
            </Link>
            <Link>
              <li>
                <FaTwitterSquare />
              </li>
            </Link>
            <Link>
              <li>
                <FaPinterest />
              </li>
            </Link>
          </ul>{" "}
        </div>

        {/* newletter subscription */}
        <div>
          <h3 className="text-xl font-semibold">Stay in the Loop</h3>
          <p className="mt-2 text-sm">
            Subscribe to get speeds offers, free giveaways, and more
          </p>
          <form className="mt-4 flex">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full p-2 rounded-l-md text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <button
              type="submit"
              className="bg-pink-600 text-white px-4 rounded-r-md hover:bg-red-700"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* bottom section  */}
      <div className=" max-w-7xl mx-auto py-5 mt-5   border-t border-gray-700 text-center text-sm">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-pink-600">EKart</span>. All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
