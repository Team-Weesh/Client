"use client";

import React, { useState } from "react";
import styles from "./Aside.module.css";
import { showToast } from "../Toastify";
import { useRequestAdvice } from "@/services/advice/advice.mutation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  selectedTime: string;
}

const Modal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedDate,
  selectedTime,
}) => {
  const [content, setContent] = useState("");
  const { mutate, isPending } = useRequestAdvice();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      showToast({ content: "내용 입력해라", type: "info" });
      return;
    }

    mutate(
      {
        desiredDate: selectedDate,
        desiredTime: selectedTime,
        content,
      },
      {
        onSuccess: () => {
          Toastify({ content: "예약 완료", type: "info" });
          onClose();
          setContent("");
        },
      }
    );
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>상담 예약</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <p>{selectedDate} / {selectedTime}</p>

        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={styles.textarea}
          />

          <div className={styles.buttonGroupRow}>
            <button type="button" onClick={onClose}>
              취소
            </button>
            <button disabled={isPending}>
              {isPending ? "예약중..." : "예약"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;