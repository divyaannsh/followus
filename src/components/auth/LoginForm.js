"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { toast } from "react-toastify";
import { loginRequest } from "@/redux/slices/authSlice";
import Image from "next/image";

export default function LoginForm() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginRequest(formData));
  };

  return (
    <div className="flex min-h-screen">


      {/* Left Section: Login Form */}
      <div className="w-full sm:w-1/2 bg-gray-700 text-white flex flex-col justify-center px-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Log in to your</h1>
          <h1 className="text-3xl font-bold">followus.link</h1>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {[{ label: "Username", name: "username", type: "text", placeholder: "" }, { label: "Password", name: "password", type: "password", placeholder: "" }].map(({ label, name, type }) => (
            <div key={name}>
              <input
                type={type}
                name={name}
                required
                value={formData[name]}
                onChange={handleChange}
                placeholder={label}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <Link href="#" className="text-sm text-gray-400 hover:underline">
            Log in with phone number
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white text-gray-900 rounded-md hover:bg-gray-200 transition disabled:bg-gray-500"
          >
            {loading ? "Signing in..." : "Log in"}
          </button>

          <Link href="#" className="text-sm text-gray-400 hover:underline text-center block">
            Forgot password?
          </Link>

          <p className="text-sm text-center">
            Don’t have an account?{' '}
            <Link href="/signup" className="text-white hover:underline">
              Sign up
            </Link>
          </p>
        </form>

        <p className="text-xs text-gray-500 mt-10">
          This site is protected by reCAPTCHA and the Google <Link href="#" className="underline">Privacy Policy</Link> and <Link href="#" className="underline">Terms of Service</Link> apply.
        </p>
      </div>

      <div className="w-1/2 hidden sm:block">
        <img src="/img/loginImage.jpg" alt="Signup" className="w-full h-full" />
      </div>

      {/* Right Section: Image */}
      {/* <div className="hidden sm:block w-1/2 bg-cover bg-no-repeat bg-center" style={{ backgroundImage: "url('./img/signup01.png')" }} /> */}
    </div>
  );
}