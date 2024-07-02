import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async () => {

    await prisma.$transaction([

        prisma.userOnTags.deleteMany(),
        prisma.tagsOnPosts.deleteMany(),
        prisma.mediaOnPost.deleteMany(),
        prisma.emergencyContact.deleteMany(),
        prisma.tag.deleteMany(),
        prisma.post.deleteMany(),
        prisma.user.deleteMany(),
    ]);
}