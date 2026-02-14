import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import Router from "next/router";
import { toast } from "react-toastify";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  signUpRequest,
  signUpSuccess,
  signUpFailure,
} from "../slices/authSlice";
import axiosInstance from "utils/axiosInstance";

// API Call Functions
const loginApi = async (formData) => {

  const response = await axiosInstance.post("/api/auth/login", JSON.stringify(formData), {
  });
  return response.data;
};

const signUpApi = async (formData) => {
  const response = await axiosInstance.post("/api/auth/signup", formData, {
  });
  return response.data;
};

// Login Saga
function* handleLogin(action) {
  console.log("testing");
  try {
    const data = yield call(loginApi, action.payload);
    console.log("Login Data:", data); // Debugging
    
    const userData = {
      user: data?.user?.userName,
      authToken: data?.user?.AuthToken,
      _id: data?.user?._id,
    };

    console.log("Login Success:", userData); // Debugging
    // Store in localStorage
    localStorage.setItem("userData", JSON.stringify(userData));
    yield put(loginSuccess(userData));
    toast.success("Login successful! 🎉");
    yield call(Router.push, "/");
  } catch (error) {
    const errorMessage = error?.response?.data?.error || "Login failed!";
    yield put(loginFailure(errorMessage));
    toast.error(errorMessage);
  }
}

// Signup Saga
function* handleSignUp(action) {
  try {
    const data = yield call(signUpApi, action.payload);
    yield put(
      signUpSuccess({
        username: data.username,
        authToken: data.AuthToken,
      })
    );

    toast.success("Signup successful! 🎉");
    yield call(Router.push, "/login");
  } catch (error) {
    console.error("Signup Error:", error.response?.data || error.message); // Debugging
    yield put(signUpFailure(error.response?.data?.error || "Signup failed!"));
    toast.error(error.response?.data?.error || "Signup failed!");
  }
}


// Watcher Saga
export function* watchAuth() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(signUpRequest.type, handleSignUp);
}
