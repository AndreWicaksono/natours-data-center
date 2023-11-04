export interface Login_Response_ObjectType {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  user: User_ObjectType;
}

export interface User_ObjectType {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmed_at: string;
  last_sign_in_at: string;
  app_metadata: Login_AppMetadata_ObjectType;
  user_metadata: UserMetadata_ObjectType;
  identities: Identity_ObjectType[];
  created_at: string;
  updated_at: string;
}

export interface Login_AppMetadata_ObjectType {
  provider: string;
  providers: string[];
}

export interface UserMetadata_ObjectType {}

export interface Identity_ObjectType {
  id: string;
  user_id: string;
  identity_data: IdentityData_ObjectType;
  provider: string;
  last_sign_in_at: string;
  created_at: string;
  updated_at: string;
}

export interface IdentityData_ObjectType {
  email: string;
  sub: string;
}

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<Login_Response_ObjectType> => {
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
