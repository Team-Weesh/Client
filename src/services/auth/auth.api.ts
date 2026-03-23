import { http } from "@/apis";
import { type SignUpType, type LoginType } from "@/types";

export const requestLogin = async (login: LoginType) => {
  const { data } = await http.post("/auth/login", login);
  console.log(data)
  return data;
};

export const requestLogout = async () => {
  const { data } = await http.post("/auth/logout");
  return data;
}

export const requestSignUp = async (signUp: SignUpType) => {
  const { data } = await http.post("/users/register", signUp);
  return data;
};

export const getProfile = async () => {
  const { data } = await http.get("/auth/profile");
  return data;
}