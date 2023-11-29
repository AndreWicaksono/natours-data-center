import { useQuery } from "@tanstack/react-query";

import { verifyAuthToken } from "src/API/REST/GET/VerifyAuthToken";
import { cookieKey } from "src/Global/Constants";
import useClientCookie from "src/hooks/useClientCookie";

export const useVerifyAuth = (): {
  data: {
    authorizedFor: string | null;
    isAuthenticated: boolean;
  };
  error: Error | null;
  isLoading: boolean;
} => {
  const { getCookie } = useClientCookie();

  const cookieAuth = getCookie(cookieKey) ?? "";

  /* eslint-disable @tanstack/query/exhaustive-deps */
  const { data, error, isLoading } = useQuery({
    enabled: !!cookieAuth,
    gcTime: 0,
    queryFn: () => {
      if (!cookieAuth) {
        throw "Cookie is not available";
      }

      return verifyAuthToken(cookieAuth);
    },
    queryKey: ["auth"],
    retry: false,
    select: (data) => data.email,
  });

  return {
    data: { authorizedFor: data ?? null, isAuthenticated: !!data },
    error,
    isLoading: isLoading,
  };
};
