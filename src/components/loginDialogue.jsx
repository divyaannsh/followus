import React from "react";
import LoginForm from "./auth/LoginForm";

const LoginDialogue = ({ loginOpen, setLoginOpen }) => {
  if (!loginOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative">
        <button
          className="absolute top-2 right-2 bg-gray-900 text-white px-2 py-1 rounded-full"
          onClick={() => setLoginOpen(false)}
        >
          ✕
        </button>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginDialogue;
