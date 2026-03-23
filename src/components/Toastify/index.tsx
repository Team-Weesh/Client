"use client";

import { Slide, toast, type ToastOptions } from "react-toastify";
import styles from "./Toastify.module.css";

const defaultToastOptions: ToastOptions = {
  position: "top-right",
  transition: Slide,
};

type ToastType = "info" | "error";

export const showToast = ({
  content,
  type,
}: {
  content: string;
  type: ToastType;
}) => {
  const toastConfig: ToastOptions = {
    ...defaultToastOptions,
    icon: () =>
      type === "error" ? (
        <img src="/assets/angry.png" className={styles.icon} />
      ) : (
        <img src="/assets/weesh.png" className={styles.icon} />
      ),
  };

  if (type === "error") {
    toast.error(content, toastConfig);
  } else {
    toast.info(content, toastConfig);
  }
};