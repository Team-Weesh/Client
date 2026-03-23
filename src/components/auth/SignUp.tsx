"use client";

import React, { useState } from "react";
import { useRequestSignUp } from "@/services/auth/auth.mutation";
import { type SignUpType } from "@/types";
import { showToast } from "@/components/Toastify";
import styles from "./auth.module.css";
import { IoEye, IoEyeOff } from "react-icons/io5";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<
    SignUpType & { confirmPassword: string }
  >({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    studentNumber: 0,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const signUpMutation = useRequestSignUp();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "studentNumber") {
      const numericValue = value.replace(/\D/g, "").slice(0, 4);
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue ? parseInt(numericValue) : 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validatePassword = (password: string) => {
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    return (
      password.length >= 8 &&
      password.length <= 16 &&
      specialCharRegex.test(password)
    );
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      showToast({ content: "이름을 입력해주세요.", type: "info" });
      return false;
    }

    if (!formData.username.trim()) {
      showToast({ content: "아이디를 입력해주세요.", type: "info" });
      return false;
    }

    if (
      formData.studentNumber <= 0 ||
      formData.studentNumber.toString().length !== 4
    ) {
      showToast({ content: "4자리 학번을 입력해주세요.", type: "info" });
      return false;
    }

    const firstDigit = formData.studentNumber.toString().charAt(0);
    if (!["1", "2", "3"].includes(firstDigit)) {
      showToast({
        content: "학번은 1, 2, 3으로 시작해야 합니다.",
        type: "info",
      });
      return false;
    }

    if (!validatePassword(formData.password)) {
      showToast({
        content: "비밀번호는 8~16자이며 특수문자를 포함해야 합니다.",
        type: "info",
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast({
        content: "비밀번호가 일치하지 않습니다.",
        type: "info",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { confirmPassword, ...signUpData } = formData;

    signUpMutation.mutate(signUpData as SignUpType, {
      onSuccess: () => {
        showToast({ content: "회원가입이 완료되었습니다!", type: "info" });

        router.push("/login");
      },
      onError: (error: any) => {
        if (error?.message?.includes("409")) {
          showToast({
            content: "이미 존재하는 아이디입니다.",
            type: "error",
          });
        } else {
          showToast({
            content: "회원가입에 실패했습니다.",
            type: "error",
          });
        }
      },
    });
  };

  const isPasswordValid = formData.password
    ? validatePassword(formData.password)
    : true;

  const isPasswordMatch =
    formData.password === formData.confirmPassword;

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <Image src="/assets/timid.png" alt="weesh" width={50} height={50} />
          <h1 className={styles.title}>회원가입</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>이름</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>아이디</label>
            <input
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>학번</label>
            <input
              name="studentNumber"
              value={
                formData.studentNumber === 0
                  ? ""
                  : formData.studentNumber.toString()
              }
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>비밀번호</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className={styles.passwordToggle}
              >
                {showPassword ? <IoEyeOff /> : <IoEye />}
              </button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>비밀번호 확인</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`${styles.input} ${
                  formData.confirmPassword && !isPasswordMatch
                    ? styles.inputError
                    : ""
                }`}
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((p) => !p)
                }
                className={styles.passwordToggle}
              >
                {showConfirmPassword ? (
                  <IoEyeOff />
                ) : (
                  <IoEye />
                )}
              </button>
            </div>

            {formData.confirmPassword && !isPasswordMatch && (
              <span className={styles.errorText}>
                비밀번호가 일치하지 않습니다.
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={
              signUpMutation.isPending ||
              !isPasswordMatch ||
              !isPasswordValid
            }
            className={styles.submitButton}
          >
            {signUpMutation.isPending ? "가입 중..." : "회원가입"}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            이미 계정이 있으신가요?
            <button
              type="button"
              onClick={() => router.push("/login")}
              className={styles.linkButton}
            >
              로그인
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;