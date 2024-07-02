import { prisma } from "../../utils/db.server";
import { Tag } from "@prisma/client";

export const createTag = async (tag: Tag) => {
  const { name } = tag;

  return prisma.tag.create({
    data: {
      name,
    },
    select: {
      id: true,
    },
  });
};

export const batchCreateTags = async (tags: string[]) => {
  const data = tags.map((name) => ({
    name: name,
  }));

  return await prisma.tag.createMany({
    data,
  });
};

export const searchTags = async (keyword: string) => {
  return prisma.tag.findMany({
    where: {
      name: {
        contains: keyword,
        mode: "insensitive",
      },
    },
    take: 10,
  });
};

export const getWithId = async (ids: number[]) => {
  return prisma.tag.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};

export const getWithPostId = async (postId: number) => {
  return prisma.tagsOnPosts.findMany({
    where: {
      postId: postId,
    },
    select: {
      tag: true,
    },
  });
};
