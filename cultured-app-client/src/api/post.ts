import { Media, Post, PostStatus, PostTags, PostType } from "../types/Post";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { postEndpoint } from "./endpoints";
import { request } from "./request";
import { toast } from "react-toastify";
import { auth } from "../config/firebase";

export const useSearchPosts = (keyword: string, tagIds: number[]) => {
  return useInfiniteQuery(
    ["posts", keyword],
    async ({ pageParam = 0 }) => {
      return request({
        url: `${postEndpoint}/search`,
        params: { keyword, tagIds, cursor: pageParam },
      }).then((response) => {
        return response.data;
      });
    },
    {
      getNextPageParam: (lastPage) => lastPage.pageBookmark ?? undefined,
      enabled: !!tagIds && tagIds.length > 0,
    }
  );
};

export const useSearchUserPosts = (keyword: string) => {
  return useInfiniteQuery(
    ["user-posts", keyword],
    async ({ pageParam = 0 }) => {
      return request({
        url: `${postEndpoint}/user-search`,
        params: { keyword, cursor: pageParam },
      }).then((response) => {
        return response.data;
      });
    },
    {
      getNextPageParam: (lastPage) => lastPage.pageBookmark ?? undefined,
    }
  );
};

export const useGetPost = (postId: number) => {
  if (!postId) {
    postId = 0;
  }
  return useQuery(
    ["post", postId],
    async () => {
      return request({
        url: `${postEndpoint}/get-by-id`,
        params: { postId: postId },
      }).then((response) => {
        return response.data;
      });
    },
    {
      enabled: !!postId,
    }
  );
};

export const useGetPostTags = (postId: number) => {
  if (!postId) {
    postId = 0;
  }
  return useQuery(
    ["postTags", postId],
    async () => {
      return request({
        url: `${postEndpoint}/get-tags`,
        params: { postId: postId },
      }).then((response) => {
        return response.data;
      });
    },
    {
      enabled: !!postId,
    }
  );
};

export const useGetPostMedia = (postId: number) => {
  if (!postId) {
    postId = 0;
  }
  return useQuery(
    ["media", postId],
    async () => {
      return request({
        url: `${postEndpoint}/get-media`,
        params: { postId: postId },
      }).then((response) => {
        return response.data;
      });
    },
    {
      enabled: !!postId,
    }
  );
};

const createPost = async (data: Post) => {
  const r = {
    url: postEndpoint + "/create",
    method: "POST",
    data: data,
    headers: { "Content-Type": "application/json" },
  };
  const response = await request(r);
  return response;
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation(createPost, {
    onSuccess: () => {
      queryClient.invalidateQueries(["post"]);
    },
    onError: (e: any) => {
      console.error(e);
      toast.error(e.data);
    },
  });
};

const deletePost = async (data: { postId: number }) => {
  const r = {
    url: postEndpoint + "/delete",
    method: "PUT",
    data: data,
    headers: { "Content-Type": "application/json" },
  };
  const response = await request(r);
  return response;
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation(deletePost, {
    onSuccess: () => {
      queryClient.invalidateQueries(["post"]);
      queryClient.invalidateQueries(["user-posts",""]);
      toast.success("Post Deleted");
    },
    onError: (e: any) => {
      console.error(e);
      toast.error(e.data);
    },
  });
};

const deletePostMedia = async (data: { postId: number }) => {
  const r = {
    url: postEndpoint + "/delete-media",
    method: "PUT",
    data: data,
    headers: { "Content-Type": "application/json" },
  };
  const response = await request(r);
  return response;
};

export const useDeletePostMedia = () => {
  const queryClient = useQueryClient();

  return useMutation(deletePostMedia, {
    onSuccess: () => {
      queryClient.invalidateQueries(["media"]);
      console.log("Post media deleted");
    },
    onError: (e: any) => {
      console.error(e);
      toast.error(e.data);
    },
  });
};

export const createMedia = async (data: Media) => {
  const r = {
    url: postEndpoint + "/create-media",
    method: "POST",
    data: data,
    headers: { "Content-Type": "application/json" },
  };
  const response = await request(r);
  return response;
};

export const useCreateMedia = () => {
  const queryClient = useQueryClient();

  return useMutation(createMedia, {
    onSuccess: () => {
      queryClient.invalidateQueries(["media"]);
    },
    onError: (e: any) => {
      console.error(e);
      toast.error(e.data);
    },
  });
};

export const assignPostTags = async (data: PostTags) => {
  const r = {
    url: postEndpoint + "/assign-tags",
    method: "POST",
    data: data,
    headers: { "Content-Type": "application/json" },
  };
  const response = await request(r);
  return response;
};

export const useAssignPostTags = () => {
  const queryClient = useQueryClient();

  return useMutation(assignPostTags, {
    onSuccess: () => {
      queryClient.invalidateQueries(["postTags"]);
    },
    onError: (e: any) => {
      console.error(e);
      toast.error(e.data);
    },
  });
};

export const useGetPostsByStatus = (status: PostStatus) => {
  return useQuery(
    ["post-status", status],
    async () => {
      return request({
        url: `${postEndpoint}/get-by-status`,
        params: { status },
      }).then((response) => {
        return response.data;
      });
    },
    {
      enabled: !!status,
    }
  );
};

const updatePost = async (data: Partial<PostStatus>) => {
  const r = {
    url: postEndpoint + "/update-post",
    method: "PUT",
    data: data,
    headers: { "Content-Type": "application/json" },
  };
  const response = await request(r);
  return response;
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation(updatePost, {
    onSuccess: () => {
      queryClient.invalidateQueries(["post-status"]);
      queryClient.invalidateQueries(["post"]);
    },
    onError: (e: any) => {
      console.error(e);
      toast.error(e.data);
    },
  });
};

export const useGetRelevantPosts = (
  postType: PostType,
  keyword: string,
  status: PostStatus
) => {
  const firebaseUid = auth.currentUser?.uid;

  if (postType == "USER_POST") {
    return useQuery(["post"], async () => {
      return request({
        url: `${postEndpoint}/get-user-posts`,
        params: { keyword, status },
      }).then((response) => {
        return response.data;
      });
    });
  } else {
    return useQuery(
      ["post", firebaseUid],
      async () => {
        return request({
          url: `${postEndpoint}/get-by-uid`,
          params: { keyword },
        }).then((response) => {
          return response.data;
        });
      },
      {
        enabled: typeof firebaseUid !== "undefined",
      }
    );
  }
};
