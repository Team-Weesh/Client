export interface SignUpType {
  username: string;
  password: string;
  fullName: string;
  studentNumber: number;
}

export interface LoginType {
  username: string;
  password: string;
}

export interface LoginResponse {
  data: {
    accessToken: string;
    accessTokenExpireDate: number;
    refreshToken: string;
    tokenType: string;
  };
}

export interface UserResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  status: number;
  path: string;
  error: string;
}

export interface UserData {
  id: number;
  name: string;
  studentNumber: number;
  [key: string]: any;
}

export interface ProfileData {
  userData: UserData;
}  