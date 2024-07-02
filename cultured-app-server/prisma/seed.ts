import { PrismaClient } from "@prisma/client";
import tags from "./seedData/tags";
import { superAdmin, superAdminPassword } from "./seedData/superAdmin";
import { createUser } from "../src/middleware/auth";
import { generateTagsOnPosts, tagsOnPosts } from "./seedData/tagsOnPosts";
import { generatePosts } from "./seedData/posts";
import { generatePostMedia } from "./seedData/media";

const prisma = new PrismaClient();
async function main() {
  const uid = await createUser(superAdmin.email, superAdminPassword);
  if (uid) {
    superAdmin["firebaseUid"] = uid;
    await prisma.user.create({data: superAdmin});
  }
  let numPosts = 300
  if (process.env.NODE_ENV == "production"){
    numPosts = 50
  }
  await prisma.tag.createMany({data: tags})
  const createdTags = await prisma.tag.findMany()

  await prisma.post.createMany({data: generatePosts(numPosts)})

  await prisma.tagsOnPosts.createMany({data: generateTagsOnPosts(numPosts, createdTags)})

  await prisma.mediaOnPost.createMany({data: generatePostMedia(numPosts)})

}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
