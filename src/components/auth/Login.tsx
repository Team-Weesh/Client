"use client";

import React, { useState } from "react";
import { useRequestLogin } from "@/services/auth/auth.mutation";
import { type LoginType, type LoginResponse } from "@/types";
import { showToast } from "@/components/Toastify";
import { TokenManager } from "@/utils";
import styles from "./auth.module.css";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Image from "next/image";
const Login = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginType>({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useRequestLogin();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      showToast({ content: "사용자명을 입력해주세요.", type: "info" });
      return;
    }

    if (!formData.password.trim()) {
      showToast({ content: "비밀번호를 입력해주세요.", type: "info" });
      return;
    }

    loginMutation.mutate(formData, {
      onSuccess: (data: LoginResponse) => {
        showToast({
          content: `환영합니다, ${formData.username}님!`,
          type: "info",
        });

        TokenManager.saveTokens(
          data.data.accessToken,
          data.data.refreshToken
        );

        router.push("/");
      },
      onError: () => {
        showToast({
          content: "아이디와 비밀번호 중 하나가 잘못되었습니다.",
          type: "error",
        });
      },
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <Image src="/assets/weesh.png" alt="weesh" width={50} height={50} />
          <h1 className={styles.title}>로그인</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              아이디
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="아이디를 입력하세요."
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              비밀번호
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={styles.input2}
                placeholder="비밀번호를 입력하세요."
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={styles.passwordToggle}
              >
                {showPassword ? <IoEyeOff /> : <IoEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className={styles.submitButton}
          >
            {loginMutation.isPending ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            계정이 없으신가요?{" "}
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className={styles.linkButton}
            >
              회원가입
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;