import { User } from "@prisma/client";

export const superAdmin: User = {
  id: 123,
  email: "admin@gmail.com",
  username: "admin",
  userType: "ADMIN",
  blocked: false,
  onboarded: true,
  firebaseUid: "123456789",
  contact: "0412345678"
}

export const superAdminPassword: string = "superAdmin#1"