import { Tag, TagsOnPosts } from "@prisma/client";
import { randomInt } from "crypto";

export const tagsOnPosts: TagsOnPosts[] = [
  {
    postId: 1,
    tagId: 1,
    assignedAt: new Date(),
    assignedBy: ""
  },
]

// export const generateTagsOnPosts = (numTagsOnPosts: number, numTags: number) => {
//   const results: TagsOnPosts[] = []
//   for (let i = 1; i <= numTagsOnPosts; i++) {
//     results.push({
//       postId: i,
//       tagId: (i % numTags == 0) ? randomInt(1,9) : i % numTags,
//       assignedAt: new Date(),
//       assignedBy: ""
//     })
//   }
//   return results
// }

// assign each tag to each post
export const generateTagsOnPosts = (numPosts: number, tags: Tag[]) => {
  const results: TagsOnPosts[] = []
  const tagIds = tags.map(t => t.id)
  for (let i = 1; i <= numPosts; i++) {
    const randIdx = randomInt(0,tagIds.length - 1)
    results.push({
      postId: i,
      tagId: tagIds[randIdx],
      assignedAt: new Date(),
      assignedBy: ""
    })
  }
  return results
}