import { useRef } from "react";

import { useIsMounted } from "src/hooks/useIsMounted";

const useClientCookie = (): {
  deleteCookie: ({
    cookieKey,
    domain,
    path,
  }: {
    cookieKey: string;
    domain?: string;
    path?: string;
  }) => void;
  getCookie: (cookieKey: string) => string | void;
  setCookie: ({
    cookieKey,
    cookieExpires,
    cookiePath,
    cookieValue,
  }: {
    cookieKey: string;
    cookieExpires: string;
    cookiePath: string;
    cookieValue: string;
  }) => void;
} => {
  const isMounted = useIsMounted();
  const refCookie = useRef<string>();

  const methods = {
    deleteCookie: ({
      cookieKey,
      domain = "",
      path = "/",
    }: {
      cookieKey: string;
      domain?: string;
      path?: string;
    }) => {
      if (!isMounted) return;

      document.cookie = `${cookieKey}=;${
        domain ? ` domain=${domain};` : ""
      } path=${path}; max-age=0;`;
    },
    getCookie: (cookieKey: string): string | void => {
      if (!isMounted) return;

      refCookie.current =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith(cookieKey))
          ?.split("=")[1] ?? "";

      return refCookie.current ?? null;
    },
    setCookie: ({
      cookieKey,
      cookieExpires,
      cookiePath,
      cookieValue,
    }: {
      cookieKey: string;
      cookieExpires: string;
      cookiePath: string;
      cookieValue: string;
    }): void => {
      if (!isMounted) return;

      const newCookie = `${cookieKey}=${cookieValue}; path=${cookiePath}; expires=${cookieExpires}; Secure;`;

      document.cookie = newCookie;
    },
  };

  return methods;
};

export default useClientCookie;
