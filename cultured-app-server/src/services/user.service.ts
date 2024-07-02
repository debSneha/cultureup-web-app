import {prisma} from "../../utils/db.server";
import { User, EmergencyContact } from "@prisma/client";

const createUser = async (user: User) => {
  const { email, username, userType, contact, firebaseUid } = user;

  return prisma.user.create({
    data: {
      email,
      username,
      userType,
      contact,
      firebaseUid,
    },
    select: {
      id: true,
      username: true,
      onboarded: false,
    },
  });
};

const verifyAdmin = async (firebaseUid: string) => {
  const user = await getUser(firebaseUid)
  if (user.userType == "ADMIN") {
    return true
  }
  return false
};

const getUser = async (firebaseUid: string) => {
  return prisma.user.findFirstOrThrow({
    where: {
      firebaseUid: firebaseUid,
    },
  });
};

const updateUser = async (user: Partial<User>, firebaseUid: string) => {
  return prisma.user.update({
    where: {
      firebaseUid: firebaseUid,
    },
    data: {
      ...user,
    },
  });
};

const upsertEmergencyContact = async (
  contact: EmergencyContact,
  firebaseUid: string
) => {
  const { name, phoneNumber } = contact;

  const user = await prisma.user.findFirstOrThrow({
    where: { firebaseUid: firebaseUid },
    select: { id: true },
  });

  const upsertData = {
    name,
    phoneNumber,
    user: {
      connect: {
        firebaseUid: firebaseUid,
      },
    },
  }

  return prisma.emergencyContact.upsert({
    where: {
      userId: user.id,
    },
    create: upsertData,
    update: upsertData,
  });
};

const listUsers = async () => {
  return prisma.user.findMany();
};

const assignTagsToUser = async (tagIds: number[], firebaseUid: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: { firebaseUid: firebaseUid },
    select: { id: true },
  });

  const userOnTagData = tagIds.map((tagId) => ({
    userId: user.id,
    tagId: tagId,
  }));

  // upsert operation
  await prisma.userOnTags.deleteMany({
    where: {userId: user.id}
  })

  return await prisma.userOnTags.createMany({
    data: userOnTagData,
  });
};

const getUserEContact = async (firebaseUid: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: { firebaseUid: firebaseUid },
    select: { id: true },
  });

  return await prisma.emergencyContact.findFirst({
    where: {
      userId: user.id
    },
  });
}

const getUserTags = async (firebaseUid: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: { firebaseUid: firebaseUid },
    select: { id: true },
  });

  return await prisma.userOnTags.findMany({
    where: {
      userId: user.id
    }
  })
}

const getUserName = async (id: number) => {
  return await prisma.user.findFirstOrThrow({
    where: { id: id },
    select: { username: true },
  });
}

export {
  createUser,
  listUsers,
  updateUser,
  upsertEmergencyContact,
  getUser,
  assignTagsToUser,
  getUserEContact,
  getUserTags,
  verifyAdmin,
  getUserName
};
