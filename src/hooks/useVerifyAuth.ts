import { useQuery } from "@tanstack/react-query";

import { requestStaffsCollection } from "src/API/GraphQL/Query/StaffsCollection";
import { requestVerifyAuthToken } from "src/API/REST/GET/VerifyAuthToken";
import { cookieKey } from "src/Global/Constants";
import useClientCookie from "src/hooks/useClientCookie";

export const useVerifyAuth = (): {
  data: {
    authorizedFor: {
      createdAt: string | null;
      email: string | null;
      firstName: string | null;
      id: string | null;
      isActive: boolean | null;
      lastName: string | null;
      photo: { id: string | null; location: string | null };
    };
    isAuthenticated: boolean;
  };
  error: Error | null;
  isLoading: boolean;
  isSuccess: boolean;
} => {
  const { getCookie } = useClientCookie();

  const cookieAuth = getCookie(cookieKey) ?? "";

  /* eslint-disable @tanstack/query/exhaustive-deps */
  const { data, error, isLoading, isSuccess } = useQuery({
    enabled: !!cookieAuth,
    gcTime: 0,
    queryFn: () => {
      if (!cookieAuth) {
        throw "Cookie is not available";
      }

      return requestVerifyAuthToken(cookieAuth);
    },
    queryKey: ["auth"],
    retry: false,
    select: (data) => ({
      id: data.id,
      createdAt: data.created_at,
      email: data.email,
    }),
  });

  const staffId: string | null = data?.id ?? null;

  const {
    data: additionalAuthInfo,
    error: errorOfAdditionalAuthInfo,
    isLoading: isLoadingOfAdditionalAuthInfo,
    isSuccess: isSuccessOfAdditionalAuthInfo,
  } = useQuery({
    enabled: !!cookieAuth && !!staffId,
    gcTime: 0,
    queryFn: () => {
      if (!cookieAuth) {
        throw "Cookie is not available";
      }

      return requestStaffsCollection(
        { filter: { id: { eq: data?.id } }, first: 1 },
        cookieAuth
      );
    },
    queryKey: ["authAdditionalInfo"],
    retry: false,
  });

  if (isSuccess && isSuccessOfAdditionalAuthInfo) {
    return {
      data: {
        authorizedFor: {
          createdAt: data?.createdAt,
          email: data?.email,
          firstName:
            additionalAuthInfo?.staffsCollection?.edges[0].node.first_name ??
            null,
          id: data?.id,
          isActive:
            additionalAuthInfo?.staffsCollection?.edges[0].node.is_active ??
            null,
          lastName:
            additionalAuthInfo?.staffsCollection?.edges[0].node.last_name ??
            null,
          photo: additionalAuthInfo?.staffsCollection?.edges[0].node.photo
            ? JSON.parse(
                additionalAuthInfo?.staffsCollection?.edges[0].node.photo
              )
            : { id: null, location: null },
        },
        isAuthenticated: true,
      },
      error: error || errorOfAdditionalAuthInfo,
      isLoading: isLoading && isLoadingOfAdditionalAuthInfo,
      isSuccess: isSuccess && isSuccessOfAdditionalAuthInfo,
    };
  }

  return {
    data: {
      authorizedFor: {
        createdAt: null,
        email: null,
        firstName: null,
        id: null,
        isActive: null,
        lastName: null,
        photo: { id: null, location: null },
      },
      isAuthenticated: false,
    },
    error: null,
    isLoading: isLoading || isLoadingOfAdditionalAuthInfo,
    isSuccess: false,
  };
};
