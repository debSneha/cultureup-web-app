import express from "express";
import {
  register,
  getAllUsers,
  registerContact,
  updateUser,
  getUser,
  assignTagsToUser,
  getUserEContact,
  getUserTags,
  getUserName
} from "../controllers/user.controller";
import { auth } from "../middleware/auth";

const app = express();
const router = express.Router();

router.post("/register", register);
router.get("/get-all", auth, getAllUsers);
router.put("/update", auth, updateUser);
router.post("/register-contact", auth, registerContact);
router.get("/get", auth, getUser);
router.get("/get-econtact", auth, getUserEContact);
router.get("/get-tags", auth, getUserTags);
router.post("/assign-tags", auth, assignTagsToUser);
router.get("/get-name", auth, getUserName);


export default app.use("/api/user", router);
