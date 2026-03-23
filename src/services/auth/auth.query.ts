import { queryOptions } from "@tanstack/react-query";
import { getProfile } from "./auth.api";

export const profileQuery = {
    list: () =>
    queryOptions({
      queryKey: ["profile"],
      queryFn: () => getProfile(),
      enabled: false,
    }),
}