import { useMutation } from "@tanstack/react-query";
import { requestLogin, requestLogout, requestSignUp } from "./auth.api";
import { type SignUpType, type LoginType } from "@/types";
import { TokenManager } from "@/utils";

export const useRequestLogin = () => {
  return useMutation({
    mutationFn: (login: LoginType) => requestLogin(login),
  });
};

export const useRequestLogout = () => {
  return useMutation({
    mutationFn: async () => {
      try {
        await requestLogout();
      } catch (error: any) {
        if (error.response?.status !== 403) {
          throw error; 
        }
      } finally {
        TokenManager.removeTokens();
      }
      return true;
    },
  });
};

export const useRequestSignUp = () => {
  return useMutation({
    mutationFn: (signUp: SignUpType) => requestSignUp(signUp),
  });
};