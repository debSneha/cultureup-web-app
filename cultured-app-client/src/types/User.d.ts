export type PGUser = {
  id: number,
  email: string,
  username: string,
  userType: "USER" | "ADMIN",
  blocked: boolean
  onboarded: boolean
  firebaseUid: string
  contact: string
}

export type RegUser = {
  email: string
  contact: string
  username: string
  userType: Role,
  firebaseUid: string
}

export const Role: {
  USER: 'USER',
  ADMIN: 'ADMIN'
};
  
export type Role = (typeof Role)[keyof typeof Role]