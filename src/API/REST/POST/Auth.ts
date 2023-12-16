export interface Login_Response_Object {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  user: User_Object;
}

export interface User_Object {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmed_at: string;
  last_sign_in_at: string;
  app_metadata: Login_AppMetadata_Object;
  user_metadata: UserMetadata_Object;
  identities: Identity_Object[];
  created_at: string;
  updated_at: string;
}

export interface Login_AppMetadata_Object {
  provider: string;
  providers: string[];
}

export interface UserMetadata_Object {}

export interface Identity_Object {
  id: string;
  user_id: string;
  identity_data: IdentityData_Object;
  provider: string;
  last_sign_in_at: string;
  created_at: string;
  updated_at: string;
}

export interface IdentityData_Object {
  email: string;
  sub: string;
}

export const requestLogin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<Login_Response_Object> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_URL_SERVER}/auth/v1/token?grant_type=password`,
      {
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
          apiKey: import.meta.env.VITE_KEY_PUBLIC,
        },
        method: "POST",
      }
    );

    if (!response.ok && response.status === 400)
      throw Error("Invalid login credentials");

    const data = await response.json();

    return data;
  } catch (error) {
    throw Error(error as string);
  }
};

export const requestLogout = async (token: string): Promise<number> => {
  const response = await fetch(
    `${import.meta.env.VITE_URL_SERVER}/auth/v1/logout`,
    {
      headers: {
        "Content-Type": "application/json",
        apiKey: import.meta.env.VITE_KEY_PUBLIC,
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
    }
  );

  return response.status;
};
