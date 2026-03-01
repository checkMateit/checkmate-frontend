export interface UserResponse {
    name: string;
    email: string;
    nickname: string;
    gender: string;
    birthdate: string; 
    phoneNumber: string;
    socialType: string;
  }
  
  export interface UserUpdateReq {
    nickname: string;
    birthdate: string;
    gender: string;
    phoneNumber: string;
  }