import type { Request, Response } from "express";
import * as postServices from "../services/post.service";
import * as mediaServices from "../services/media.service";
import { MediaOnPost, Post, PostStatus } from "@prisma/client";
import { validationResult } from "express-validator";

type IPostRes = { media: MediaOnPost[] } & Post;

async function searchPosts(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (typeof req.query.keyword == "string") {
      const data: IPostRes[] = [];
      let tagIds: number[] = [];
      if (!!req.query.tagIds && (req.query.tagIds as string[]).length > 0)
        tagIds = (req.query.tagIds as string[]).map((id) => parseInt(id));
      const cursor = parseInt(req.query.cursor as string);
      const posts = await postServices.searchPosts(
        req.query.keyword,
        tagIds,
        cursor
      );
      for (const post of posts.data) {
        const media = await mediaServices.fetchMedia(post.id);
        data.push({ ...post, media });
      }
      const result = {
        data,
        pageBookmark: posts.cursor,
      };
      return res.status(201).json(result);
    } else {
      return res.status(422).json("Unexpected search keyword type");
    }
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
}

async function searchUserPosts(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (typeof req.query.keyword == "string") {
      const data: IPostRes[] = [];
      const cursor = parseInt(req.query.cursor as string);
      const posts = await postServices.searchUserPosts(
        req.query.keyword,
        cursor,
        res.locals.jwtToken.uid
      );
      for (const post of posts.data) {
        const media = await mediaServices.fetchMedia(post.id);
        data.push({ ...post, media });
      }
      const result = {
        data,
        pageBookmark: posts.cursor,
      };
      return res.status(201).json(result);
    } else {
      return res.status(422).json("Unexpected search keyword type");
    }
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
}

async function create(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const post = await postServices.createPost(
      req.body,
      res.locals.jwtToken.uid
    );
    return res.status(201).json(post);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
}

async function deletePost(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = parseInt(req.body.postId);
    const post = await postServices.deletePost(id);
    return res.status(200).json(post);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
}

async function deletePostMedia(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    
    const id = parseInt(req.body.postId);
    if (id != 0) {
      const post = await postServices.deletePostMedia(id);
      return res.status(200).json(post);
    }else{
      return res.status(200).json({});
    }
    
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
}

async function getAllPosts(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const posts = await postServices.getPosts();
    return res.status(200).json(posts);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
}

async function getUserPostsByQuery(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        if(typeof req.query.keyword == "string"){
            if(req.query.status) {
                const status = req.query.status as PostStatus
                const posts = await postServices.getUserPostsByKeywordAndStatus(req.query.keyword, status);
                return res.status(200).json(posts);
            }
            else {
                const posts = await postServices.getUserPostsByKeyword(req.query.keyword);
                return res.status(200).json(posts);
            }
        }
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
};

async function updatePost(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  if (!req.body.id)
    return res.status(406).json("No post id provided.");

  try {
    const post = await postServices.updatePost(req.body, req.body.id);
    return res.status(201).json(post);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
};

async function getPostsByUid(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    if (typeof req.query.keyword == "string") {
      const posts = await postServices.getPostsByUid(
        res.locals.jwtToken.uid,
        req.query.keyword
      );
      return res.status(200).json(posts);
    }
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
}

async function getPostsByStatus(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const status = req.query.status as PostStatus
        const posts = await postServices.getPostsByStatus(status);
        return res.status(200).json(posts);
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
}

async function createMedia(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const media = await postServices.createPostMedia(req.body);
    return res.status(201).json(media);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
}

async function getAllMedia(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    if (!req.query.postId){
      return res.status(406).json("No Post ID Given.");
    }
    const id = parseInt(req.query.postId as string);
    if (id != 0) {
      const media = await postServices.getPostMedia(id);
      return res.status(200).json(media);
    }
    return res.status(200).json({});
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
}

async function getPostById(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    if (!req.query.postId){
      return res.status(406).json("No Post ID Given.");
    }
    const id = parseInt(req.query.postId as string);
    if (id != 0) {
      const post = await postServices.getPostById(id);
      return res.status(200).json(post);
    }else{
      return res.status(200).json({});
    }
    
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
}

async function getTitleMedia(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    if (typeof req.query.keyword == "number") {
      const media = await postServices.getPostThumbnail(req.body);
      return res.status(200).json(media);
    } else {
      return res.status(422).json("Unexpected postId");
    }
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
}

async function assignPostTags(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const tags = await postServices.assignPostTags(
      req.body.tagIds,
      req.body.postId,
      res.locals.jwtToken.uid
    );
    return res.status(201).json(tags);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
}

async function getPostTags(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const id = parseInt(req.query.postId as string);
    if (id != 0) {
      const tags = await postServices.getPostTags(id);
      return res.status(200).json(tags);
    }else{
      return res.status(200).json({});
    }
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
}

export {
  create,
  getAllPosts,
  getAllMedia,
  createMedia,
  getTitleMedia,
  getPostsByStatus,
  getUserPostsByQuery,
  updatePost,
  assignPostTags,
  searchPosts,
  searchUserPosts,
  getPostsByUid,
  deletePost,
  getPostById,
  getPostTags,
  deletePostMedia,
};
