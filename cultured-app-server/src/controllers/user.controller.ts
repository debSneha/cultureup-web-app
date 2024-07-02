import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import detectUsernameExistsError from "../../utils/error-handler/detectUsernameExistsError";
import detectEmailExistsError from "../../utils/error-handler/detectEmailExistsError";
import detectIncorrectUIDError from "../../utils/error-handler/detectIncorrectUIDError";
import validateContact from "../../utils/error-handler/validateContact";
import * as userServices from "../services/user.service";

async function register(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    if (!validateContact(req.body.contact))
      return res.status(406).json("Contact number not in format");
    const user = await userServices.createUser(req.body);
    return res.status(201).json(user);
  } catch (error: any) {
    if (detectUsernameExistsError(error))
      return res.status(406).json("Username has been taken");
    if (detectEmailExistsError(error))
      return res.status(406).json("Email already in use");
    if (detectIncorrectUIDError(error))
      return res.status(406).json("Incorrect firebase uid");
    return res.status(500).json(error.message);
  }
}

async function registerContact(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    if (!validateContact(req.body.phoneNumber))
      return res.status(406).json("Contact number not in format");

    const contact = await userServices.upsertEmergencyContact(
      req.body,
      res.locals.jwtToken.uid
    );
    return res.status(201).json(contact);
  } catch (error: any) {
    console.log(error);
    return res.status(500).json(error.message);
  }
}

async function updateUser(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (req.body.contact && !validateContact(req.body.contact)) {
    return res.status(406).json("Contact number not in format");
  }

  try {
    const user = await userServices.updateUser(
      req.body,
      res.locals.jwtToken.uid
    );
    return res.status(201).json(user);
  } catch (error: any) {
    if (detectUsernameExistsError(error))
      return res.status(406).json("Username has been taken");
    return res.status(500).json(error.message);
  }
}

async function getAllUsers(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const adminCheck = await userServices.verifyAdmin(res.locals.jwtToken.uid)
    if (!adminCheck) {
      return res.status(400).json("Forbidden");
    }
    
    const users = await userServices.listUsers();
    return res.status(200).json(users);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
}

async function getUser(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await userServices.getUser(res.locals.jwtToken.uid);
    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
}

async function assignTagsToUser(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const tags = await userServices.assignTagsToUser(
      req.body,
      res.locals.jwtToken.uid
    );
    return res.status(201).json(tags);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
}

async function getUserEContact(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const econtact = await userServices.getUserEContact(
      res.locals.jwtToken.uid
    );
    return res.status(201).json(econtact);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
}

async function getUserTags(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const tags = await userServices.getUserTags(
      res.locals.jwtToken.uid
    );
    return res.status(200).json(tags);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
}

async function getUserName(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.query.userId as string
    const user = await userServices.getUserName(parseInt(userId));
    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
}

export {
  register,
  registerContact,
  updateUser,
  getAllUsers,
  getUser,
  assignTagsToUser,
  getUserEContact,
  getUserTags,
  getUserName
};
