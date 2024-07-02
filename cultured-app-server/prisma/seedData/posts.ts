import { Post } from "@prisma/client";
import { randomInt } from "crypto";
import { LoremIpsum } from "lorem-ipsum"
import { PostStatus } from "@prisma/client";

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

const randDate = () => {
  return new Date(new Date().getTime() - randomInt(1000,10**10))
}

export const generatePosts = (numPosts: number) => {
  let posts: any[] = []
  for (let i = 1; i <= numPosts; i++) {
    posts.push({
      title: lorem.generateWords(randomInt(1,10)),
      userId: 123,
      author: lorem.generateWords(1),
      status: PostStatus.APPROVED,
      desc: lorem.generateParagraphs(randomInt(1,5)),
      updatedAt: randDate(),
      rejectDsc: null,
    })
  }
  return posts
}