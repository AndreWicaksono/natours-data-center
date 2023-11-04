export interface VerifyAuthToken_Response_ObjectType {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmed_at: string;
  last_sign_in_at: string;
  app_metadata: VerifyAuthToken_Response_AppMetadata_ObjectType;
  user_metadata: VerifyAuthToken_Response_UserMetadata_ObjectType;
  identities: VerifyAuthToken_Response_Identity_ObjectType[];
  created_at: string;
  updated_at: string;
}

export interface VerifyAuthToken_Response_AppMetadata_ObjectType {
  provider: string;
  providers: string[];
}

export interface VerifyAuthToken_Response_UserMetadata_ObjectType {}

export interface VerifyAuthToken_Response_Identity_ObjectType {
  id: string;
  user_id: string;
  identity_data: VerifyAuthToken_Response_IdentityData_ObjectType;
  provider: string;
  last_sign_in_at: string;
  created_at: string;
  updated_at: string;
}

export interface VerifyAuthToken_Response_IdentityData_ObjectType {
  email: string;
  sub: string;
}

export const verifyAuthToken = async (
  token: string
): Promise<VerifyAuthToken_Response_ObjectType> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_URL_SERVER}/auth/v1/user`,
      {
        headers: {
          apiKey: import.meta.env.VITE_KEY_PUBLIC,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      }
    );

    if (!response.ok) throw Error;

    const data = response.json();

    return data;
  } catch {
    throw Error("Token is expired");
  }
};
