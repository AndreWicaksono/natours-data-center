export const cookieKey = `sb-${
  import.meta.env.VITE_URL_SERVER.split("://")[1].split(".")[0]
}-auth-token`;
