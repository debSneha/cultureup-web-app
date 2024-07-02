import { MediaOnPost } from "@prisma/client"
import { randomInt } from "crypto"

const unsplashImageLinks: string[] = [
  "https://images.unsplash.com/photo-1611244419768-a0b28fe3e0d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDU2NzF8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODM1MjQ2NDg&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1680268719962-acaffc32c3cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDU2NzF8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODM1MjQ2NDg&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1680268719962-acaffc32c3cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDU2NzF8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODM1MjQ2NDg&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1681001443682-2a753edc99c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDU2NzF8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODM1MjQ2NDg&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1681197666394-56be2d8e8e4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDU2NzF8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODM1MjQ2NDg&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1681938329910-a95c4c96e5ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDU2NzF8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODM1MjQ2NDg&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1681989232884-4d6b06873e37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDU2NzF8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODM1MjQ2NDg&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1682353213695-43df0be81aab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDU2NzF8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODM1MjQ2NDg&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1682459155693-5c4427c6abb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDU2NzF8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODM1MjQ2NDg&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1682519536388-ef21aab95031?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDU2NzF8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODM1MjQ2NDg&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1682588382150-5fd116b4da54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDU2NzF8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODM1MjQ2NDg&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1682610890347-59cf0c723d72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDU2NzF8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODM1MjQ2NDg&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1551847677-dc82d764e1eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDU2NzF8MHwxfHNlYXJjaHwxfHx0aGVyYXB5fGVufDB8fHx8MTY4MzUyNTEwNw&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1493836512294-502baa1986e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDU2NzF8MHwxfHNlYXJjaHwyfHx0aGVyYXB5fGVufDB8fHx8MTY4MzUyNTEwNw&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1573497491208-6b1acb260507?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDU2NzF8MHwxfHNlYXJjaHwzfHx0aGVyYXB5fGVufDB8fHx8MTY4MzUyNTEwNw&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NDU2NzF8MHwxfHNlYXJjaHw0fHx0aGVyYXB5fGVufDB8fHx8MTY4MzUyNTEwNw&ixlib=rb-4.0.3&q=80&w=1080"
]

const generateThumbnailImgMedia = (id: number) => ({
  isThumbnail: true,
  mediaUrl: unsplashImageLinks[randomInt(0,unsplashImageLinks.length - 1)],
  postId: id,
})

export const generatePostMedia = (numMedia: number) => {
  const result = []
  // 13 media posts for each post
  for (let i = 1; i <= numMedia; i++) {
    result.push(generateThumbnailImgMedia(i))
  }
  return result
}