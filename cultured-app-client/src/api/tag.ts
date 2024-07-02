import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tagEndpoint } from "./endpoints";
import { request } from "./request";
import { toast } from "react-toastify";

export const useSearchTags = (keyword: string) => {
  return useQuery(
    ['tags'],
    async () => {
      return request({ url: `${tagEndpoint}/search`, params: { keyword } }).then((response) => {
        return response.data;
      });
    }
  );
};

const createTags = async (data:{ tags: string[]}) => {
  const r = {
    url: tagEndpoint + '/batch-create',
    method: "POST",
    data: data,
    headers: { "Content-Type": "application/json" },
  };
  const response = await request(r);
  return response;
}

export const useCreateTags = () => {
  const queryClient = useQueryClient();

  return useMutation(createTags, {
    onSuccess: () => {
      queryClient.invalidateQueries(["tags"]);
      toast.success("Tag created");
    },
    onError: (e: any) => {
      console.error(e)
      toast.error(e.data)
    }
  });
}

export const useGetTagWithId = (tagIds: number[]) => {
  return useQuery(
    ['tags', tagIds],
    async () => {
      return request({ url: `${tagEndpoint}/id-get`, params: { tagIds } }).then((response) => {
        return response.data;
      });
    },
    {
      enabled: !!tagIds && tagIds.length > 0
    }
  )
}

export const useGetTagByPost = (postId: string | undefined) => {
  return useQuery(
    ['post-tags', postId],
    async () => {
      return request({ url: `${tagEndpoint}/get-by-post`, params: {postId} }).then((response) => {
        return response.data
      })
    }, {
      enabled: !!postId,
    }
  )
}