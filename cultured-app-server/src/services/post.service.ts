import { prisma } from "../../utils/db.server";
import { MediaOnPost, Post, PostStatus } from "@prisma/client";

const searchPosts = async (
  keyword: string,
  tagIds: number[],
  cursor: number
) => {
  const pageSize = 15;

  // return all posts regardless of tags when no tags given
  const tagsFilter = () => {
    if (tagIds.length > 0) {
      return {
        some: {
          tagId: {
            in: tagIds,
          },
        },
      };
    }
  };

  const data: Post[] = await prisma.post.findMany({
    take: pageSize,
    skip: cursor > 0 ? 1 : undefined,
    cursor: cursor > 0 ? { id: cursor } : undefined,
    where: {
      title: {
        contains: keyword,
        mode: "insensitive",
      },
      tags: tagsFilter(),
      status: PostStatus.APPROVED,
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });
  const lastPointInResults = data[pageSize - 1];
  const nextCursor = lastPointInResults ? lastPointInResults.id : null;

  return {
    data,
    cursor: nextCursor,
  };
};

const searchUserPosts = async (
  keyword: string,
  cursor: number,
  firebaseUid: string
) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      firebaseUid: firebaseUid,
    },
    select: {
      id: true,
    },
  });

  const pageSize = 15;

  const data: Post[] = await prisma.post.findMany({
    take: pageSize,
    skip: cursor > 0 ? 1 : undefined,
    cursor: cursor > 0 ? { id: cursor } : undefined,
    where: {
      userId: user.id,
      title: {
        contains: keyword,
        mode: "insensitive",
      },
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });
  const lastPointInResults = data[pageSize - 1];
  const nextCursor = lastPointInResults ? lastPointInResults.id : null;

  return {
    data,
    cursor: nextCursor,
  };
};

const createPost = async (post: Post, firebaseUid: string) => {
  const { title, author, desc, id } = post;
  const user = await prisma.user.findFirstOrThrow({
    where: { firebaseUid: firebaseUid },
    select: { id: true, userType: true },
  });

  const createData = {
    title,
    author,
    desc,
    userId: user.id,
    status:
      user.userType == "ADMIN" ? PostStatus.APPROVED : PostStatus.IN_REVIEW,
  };

  const upsertData = {
    title,
    author,
    desc,
    status:
      user.userType == "ADMIN" ? PostStatus.APPROVED : PostStatus.IN_REVIEW,
  };

  return prisma.post.upsert({
    where: {
      id: id ? id : 0,
    },
    create: createData,
    update: upsertData,
  });
};

const deletePost = async (postId: number) => {
  await prisma.mediaOnPost.deleteMany({
    where: {
      postId: {
        in: postId,
      },
    },
  });
  await prisma.tagsOnPosts.deleteMany({
    where: {
      postId: postId,
    },
  });
  return prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

const deletePostMedia = async (postId: number) => {
  return prisma.mediaOnPost.deleteMany({
    where: {
      postId: {
        in: postId,
      },
    },
  });
};

const getPosts = async () => {
  return prisma.post.findMany();
};

const getUserPostsByKeywordAndStatus = async (keyword: string, status: PostStatus) => {
    return prisma.post.findMany({
        where: {
            user: {
                userType: 'USER'
            },
             title: {
                contains: keyword,
                mode: 'insensitive'
            },
            status: status
        },
        include: {
            user: true
        }
    });
}

const getUserPostsByKeyword = async (keyword: string) => {
    return prisma.post.findMany({
        where: {
            user: {
                userType: 'USER'
            },
             title: {
                contains: keyword,
                mode: 'insensitive'
            },
        },
        include: {
            user: true
        }
    });
}

const getPostsByUid = async (firebaseUid: string, keyword: string) => {
  return prisma.post.findMany({
    where: {
      user: {
        firebaseUid: firebaseUid,
      },
      title: {
        contains: keyword,
        mode: "insensitive",
      },
    },
    include: {
      user: true,
    },
  });
};

const getPostsByStatus = async (status: PostStatus) => {
  return await prisma.post.findMany({
    where: {
      status: status,
    },
  });
};

const createPostMedia = async (media: MediaOnPost) => {
  return await prisma.mediaOnPost.create({
    data: media,
  });
};

const getPostMedia = async (postId: number) => {
  return prisma.mediaOnPost.findMany({
    where: {
      postId: postId,
    },
  });
};

const getPostThumbnail = async (postId: number) => {
  return prisma.mediaOnPost.findFirst({
    where: {
      postId: postId,
      isThumbnail: true,
    },
  });
};

const getPostById = async (postId: number) => {
  return prisma.post.findFirstOrThrow({
    where: {
      id: postId,
    },
  });
};

const assignPostTags = async (
  tagIds: number[],
  postId: number,
  firebaseUid: string
) => {
  const data = tagIds.map((id) => ({
    postId: postId,
    tagId: id,
    assignedBy: firebaseUid,
  }));

  // upsert operation
  await prisma.tagsOnPosts.deleteMany({
    where: { postId },
  });

  return await prisma.tagsOnPosts.createMany({
    data,
  });
};

const updatePost = async (post: Partial<Post>, id: number) => {
  return prisma.post.update({
    where: {
      id: id
    },
    data: {
      ...post,
    },
  });
};

const getPostTags = async (postId: number) => {
  return await prisma.tagsOnPosts.findMany({
    where: {
      postId,
    },
  });
}

export {
  searchPosts,
  searchUserPosts,
  createPost,
  createPostMedia,
  getPosts,
  getPostMedia,
  getPostThumbnail,
  getPostsByStatus,
  assignPostTags,
  updatePost,
  getUserPostsByKeywordAndStatus,
  getUserPostsByKeyword,
  getPostsByUid,
  deletePost,
  getPostById,
  getPostTags,
  deletePostMedia,
};
