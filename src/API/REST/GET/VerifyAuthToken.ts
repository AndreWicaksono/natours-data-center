export interface VerifyAuthToken_Response_Object {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmed_at: string;
  last_sign_in_at: string;
  app_metadata: VerifyAuthToken_Response_AppMetadata_Object;
  user_metadata: VerifyAuthToken_Response_UserMetadata_Object;
  identities: VerifyAuthToken_Response_Identity_Object[];
  created_at: string;
  updated_at: string;
}

export interface VerifyAuthToken_Response_AppMetadata_Object {
  provider: string;
  providers: string[];
}

export interface VerifyAuthToken_Response_UserMetadata_Object {}

export interface VerifyAuthToken_Response_Identity_Object {
  id: string;
  user_id: string;
  identity_data: VerifyAuthToken_Response_IdentityData_Object;
  provider: string;
  last_sign_in_at: string;
  created_at: string;
  updated_at: string;
}

export interface VerifyAuthToken_Response_IdentityData_Object {
  email: string;
  sub: string;
}

export const requestVerifyAuthToken = async (
  token: string
): Promise<VerifyAuthToken_Response_Object> => {
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
