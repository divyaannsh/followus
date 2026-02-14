"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import HomeBanner1 from "../../../public/img/home1.png";
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from 'react-redux';

const ClaimSociotree = () => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");

  const isAuthenticated = useSelector((state) => state.auth.authToken);

  const handleFetchData = async () => {
    if (inputValue.length > 0 && isAuthenticated) {
      router.push("/admin");
    } else {
      toast.error("Check your input and login");
    }
  };

  return (
    <div
      className="py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: "#222222",
        backgroundImage: `
                    linear-gradient(35deg, hsla(0, 0%, 7%, 1) 80%, hsla(0, 0%, 7%, 0.6)),
                    linear-gradient(transparent calc(50% - 1px), #fff 1px, transparent calc(50% + 1px) 100%),
      linear-gradient(to right, transparent calc(50% - 1px), #fff 1px, transparent calc(50% + 1px) 100%)
    `,
        backgroundSize: "100% 100%, 40px 40px, 40px 40px",
      }}
    >
      {/* Your content here */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-8 ">
        {/* Left Side Content */}
        <div className="text-center lg:text-left">
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#C0C0C0] mb-4 px-2 sm:px-8 mt-10 sm:mt-20 max-w-2xl leading-tight">
            Share all that you are, <br /> in a single link.
          </h3>

          <p className="text-base sm:text-lg text-[#C0C0C0] mb-6 px-2 sm:px-8">
            Join 30M+ users on Followus and simplify your bio. One link to showcase everything you create, curate, and sell across Instagram, TikTok, Twitter, YouTube, and other social platforms.</p>
          {/* Input and Button */}
          <div className="flex flex-col sm:flex-row items-center gap-4 px-2 sm:px-8">
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm sm:text-base">
                Followus.link /
              </span>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="pl-[120px] pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm sm:text-base text-gray-800 dark:bg-gray-900 dark:text-gray-100"
              />
            </div>
            <button
              onClick={handleFetchData}
              className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition text-sm sm:text-base"
            >
              Claim your Followus.link
            </button>
          </div>
        </div>
        {/* Right Side Image */}
        <div className="flex justify-center mt-6 sm:mt-10 lg:mt-20">
          <Image src={HomeBanner1} alt="hero" className="max-w-[90%] sm:max-w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

export default ClaimSociotree;
