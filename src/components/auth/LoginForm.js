"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { loginRequest } from "@/redux/slices/authSlice";

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
          {[
            { label: "Username", name: "username", type: "text" },
            { label: "Password", name: "password", type: "password" },
          ].map(({ label, name, type }) => (
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

          <Link
            href="/forgotPassword"
            className="text-sm text-gray-400 hover:underline text-center block"
          >
            Forgot password?
          </Link>

          <p className="text-sm text-center">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-white hover:underline">
              Sign up
            </Link>
          </p>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-600" />
          <span className="mx-4 text-sm text-gray-400 whitespace-nowrap">
            or continue with
          </span>
          <div className="flex-1 border-t border-gray-600" />
        </div>

        {/* Social Login Buttons */}
        <div className="flex flex-col gap-3">

          {/* Google */}
          <button
            type="button"
            onClick={() => signIn("google")}
            className="w-full flex items-center justify-center gap-3 py-3 bg-white text-gray-800 font-medium rounded-md hover:bg-gray-100 transition shadow-sm"
          >
            <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            Continue with Google
          </button>

          {/* Apple */}
          <button
            type="button"
            onClick={() => signIn("apple")}
            className="w-full flex items-center justify-center gap-3 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-900 transition shadow-sm border border-gray-700"
          >
            <svg width="20" height="20" viewBox="0 0 814 1000" xmlns="http://www.w3.org/2000/svg" fill="white">
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 484.1 13.5 347.4 13.5 318.5c0-154.3 100.7-236.2 196.5-236.2 73.5 0 132.5 48.4 176 48.4 39.5 0 109.7-50.7 191.7-50.7 30.9 0 110.7 2.6 168.4 79.7zm-129.4-208.4c31.9-37.9 54.8-91.3 54.8-144.6 0-7.7-.6-15.4-1.9-21.7-51.9 2-113.2 34.6-149.6 78.4-28.5 32.5-56.4 85.3-56.4 139.4 0 8.3 1.3 16.6 1.9 19.2 3.2.6 8.3 1.3 13.4 1.3 46.5 0 102.5-30.9 137.8-72z" />
            </svg>
            Continue with Apple
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-10">
          This site is protected by reCAPTCHA and the Google{" "}
          <Link href="#" className="underline">Privacy Policy</Link>{" "}
          and{" "}
          <Link href="#" className="underline">Terms of Service</Link>{" "}
          apply.
        </p>
      </div>

      {/* Right Section: Image */}
      <div className="w-1/2 hidden sm:block">
        <img src="/img/loginImage.jpg" alt="Login" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}