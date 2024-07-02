import { Post } from "@prisma/client"
import {prisma} from "../../utils/db.server";

export const fetchMedia = async (postId: number) => {
  return await prisma.mediaOnPost.findMany({
    where: {
      postId: postId,
    }
  })
}