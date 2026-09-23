export interface Profile {
  id: number;
  full_name: string;
  phone: string;
  email?: string | null;
  address: string | null;
  img_url: string | null;
  role: string;
  created_at: string;
}

// `PUT /profile` — telefon/e-mail bu endpoint-lə dəyişmir. Şifrə sahələri
// yalnız şifrə dəyişəndə göndərilir.
export interface UpdateProfilePayload {
  full_name: string;
  address: string;
  img_url?: string | null;
  password?: string;
  password_repeat?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface LoginResult {
  tokens: AuthTokens;
  profile: Profile;
}
