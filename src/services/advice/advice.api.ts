import { http } from "@/apis";
import { type AdviceType } from "@/types";

export const requestAdvice = async (advice: AdviceType) => {
  const { data } = await http.post("/advice", advice);
  return data;
};