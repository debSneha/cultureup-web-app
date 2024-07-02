export interface IMedia {
  id: number
  isThumbnail: boolean
  mediaUrl: string
  postId: number
}

export interface IPostWithMedia {
  id: number
  title: string
  desc?: string
  userId: number
  author: string
  updatedAt: Date
  status?: PostStatus
  media: IMedia[]
}

export type Post = {
  id?: number,
  title: string,
  author: string,
  desc: string,
  status?: PostStatus,
  rejectDsc?: string
};

export interface PostTable extends Post {
    id: number
    approve?: string,
    reject?: string
};

export type Media = {
    mediaUrl: string,
    postId: number,
    isThumbnail?: boolean
}

export type PostTags = {
    tagIds: number [],
    postId: number
}

export const PostStatus: {
    APPROVED: APPROVED
    REJECTED: REJECTED
    IN_REVIEW: IN_REVIEW
};

export type PostType = 'MY_POST' | 'USER_POST'

export type PostStatus = (typeof PostStatus)[keyof typeof PostStatus]
