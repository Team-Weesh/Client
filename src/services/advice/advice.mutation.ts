import { useMutation } from "@tanstack/react-query";
import { requestAdvice } from "./advice.api";
import { type AdviceType } from "@/types"; 

export const useRequestAdvice = () => {
  return useMutation({
    mutationFn: (advice: AdviceType) => requestAdvice(advice),
  });
};