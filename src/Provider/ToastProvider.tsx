"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider() {
  return (
    <ToastContainer
      autoClose={3000}
      hideProgressBar
      closeOnClick
      pauseOnHover
      closeButton={false}
      className="toastify"
    />
  );
}