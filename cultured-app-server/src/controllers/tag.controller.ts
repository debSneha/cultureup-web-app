import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import * as tagServices from "../services/tag.service";
import * as userServices from "../services/user.service";

async function create(req: Request, res: Response) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const adminCheck = await userServices.verifyAdmin(res.locals.jwtToken.uid)
    if (!adminCheck) {
      return res.status(400).json("Forbidden");
    }
    const user = await tagServices.createTag(req.body);
    return res.status(201).json(user);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
};

async function batchCreate(req: Request, res: Response) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const adminCheck = await userServices.verifyAdmin(res.locals.jwtToken.uid)
    if (!adminCheck) {
      return res.status(400).json("Forbidden");
    }
    const user = await tagServices.batchCreateTags(req.body.tags);
    return res.status(201).json(user);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
};

async function searchTags(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (typeof req.query.keyword == "string") {
      const results = await tagServices.searchTags(req.query.keyword);
      return res.status(201).json(results);
    } else {
      return res.status(422).json("Unexpected search keyword type");
    }
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
}

async function getWithId(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const ids = (req.query.tagIds as string[]).map(id => parseInt(id))

    const result = await tagServices.getWithId(ids);
    return res.status(201).json(result);

  } catch (error: any) {
    return res.status(500).json(error.message);
  }
}

async function getWithPostId(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (!req.query.postId){
      return res.status(406).json("No Post ID Given.");
  }
    const result = await tagServices.getWithPostId(parseInt(req.query.postId as string));
    return res.status(201).json(result);

  } catch (error: any) {
    return res.status(500).json(error.message);
  }
}

export {create, searchTags, getWithId, getWithPostId, batchCreate}
