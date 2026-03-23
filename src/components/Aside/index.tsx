"use client";

import React, { useState } from "react";
import Modal from "./Modal";
import styles from "./Aside.module.css";
import { useRequestLogout } from "@/services/auth/auth.mutation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { showToast } from "../Toastify";

type AsideType = "booking" | "timeSelection";

interface User {
  id: string;
  name: string;
}

interface BookingData {
  bookingDate: string;
  bookingTime: string;
}

interface TimeSelectionData {
  selectedTime: string;
  selectedDate: string;
  timeSlots: string[];
}

interface BaseAsideProps {
  type: AsideType;
  position: "left" | "right";
  user?: User | null;
  isLoggedIn?: boolean;
}

interface BookingAsideProps extends BaseAsideProps {
  type: "booking";
  data?: BookingData;
  actions?: {
    onLogin?: () => void;
  };
}

interface TimeSelectionAsideProps extends BaseAsideProps {
  type: "timeSelection";
  data: TimeSelectionData;
  actions: {
    onTimeSelect: (time: string) => void;
    onBooking?: () => void;
  };
}

type AsideProps = BookingAsideProps | TimeSelectionAsideProps;

const Aside: React.FC<AsideProps> = (props) => {
  const { type, position, isLoggedIn: propIsLoggedIn = false } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoggedIn: authIsLoggedIn, checkAuthStatus } = useAuth();
  const { mutate: logout, isPending } = useRequestLogout();

  const isLoggedIn = propIsLoggedIn || authIsLoggedIn;

  const containerClass = `
    ${styles.container}
    ${position === "left" ? styles.leftPosition : styles.rightPosition}
  `;

  const handleLogoutClick = () => {
    const confirmLogout = window.confirm("정말 로그아웃을 하시겠습니까?");

    if (confirmLogout) {
      logout(undefined, {
        onSuccess: () => {
          checkAuthStatus();
          showToast({ type: "info", content: "로그아웃 되었습니다." });
        },
        onError: () => {
          checkAuthStatus();
        },
      });
    }
  };

  const handleBookingClick = () => {
    if (type === "timeSelection") {
      const { actions } = props as TimeSelectionAsideProps;
      if (actions.onBooking) {
        actions.onBooking();
      } else {
        setIsModalOpen(true);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  if (type === "booking") {
    return (
      <div className={containerClass}>
        <div className={styles.header}>
          <h2 className={styles.title}>Weesh</h2>
        </div>

        {isLoggedIn ? (
          <div className={styles.buttonGroup}>
            <button
              className={styles.bookingButton}
              onClick={handleLogoutClick}
              disabled={isPending}
            >
              {isPending ? "로그아웃 중..." : "로그아웃"}
            </button>
          </div>
        ) : (
          <div className={styles.loginPrompt}>
            <Image src="/assets/sad-gray.png" alt="슬퍼요" width={80} height={80} />
            
            <p className={styles.loginMessage}>
              상담 예약을 위해 로그인이 필요합니다.
            </p>

            <Link href="/login" className={styles.loginText}>
              로그인하기
            </Link>
          </div>
        )}
      </div>
    );
  }

  if (type === "timeSelection") {
    const { data, actions } = props as TimeSelectionAsideProps;

    return (
      <>
        <div className={containerClass}>
          <div className={styles.header}>
            <h3 className={styles.sectionTitle}>시간 선택</h3>
            <p className={styles.dateText}>{data.selectedDate}</p>
          </div>

          <div className={styles.timeSlotList}>
            {data.timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => actions.onTimeSelect(time)}
                className={`
                  ${styles.timeSlot}
                  ${
                    time === data.selectedTime
                      ? styles.selectedTimeSlot
                      : ""
                  }
                `}
              >
                {time}
              </button>
            ))}
          </div>

          <button
            className={
              !data.selectedTime || !isLoggedIn
                ? styles.bookingButtonDisabled
                : styles.bookingButton
            }
            onClick={handleBookingClick}
            disabled={!data.selectedTime || !isLoggedIn}
          >
            {isLoggedIn ? "예약하기" : "로그인 후 예약 가능"}
          </button>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          selectedDate={data.selectedDate}
          selectedTime={data.selectedTime}
        />
      </>
    );
  }

  return null;
};

export default Aside;