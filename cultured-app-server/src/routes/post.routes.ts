import express from "express";
import {
  create,
  getAllPosts,
  getAllMedia,
  createMedia,
  getTitleMedia,
  getPostsByStatus,
  getUserPostsByQuery,
  getPostsByUid,
  assignPostTags,
  searchPosts,
  searchUserPosts,
  updatePost,
  deletePost,
  getPostById,
  getPostTags,
  deletePostMedia,
} from "../controllers/post.controller";
import { auth } from "../middleware/auth";

const app = express();
const router = express.Router();

router.get("/search", auth, searchPosts);
router.get("/user-search", auth, searchUserPosts);
router.post("/create", auth, create);
router.put("/delete", auth, deletePost);
router.post("/create-media", auth, createMedia);
router.get("/get-all", auth, getAllPosts);
router.get("/get-by-status", auth, getPostsByStatus);
router.get("/get-media", auth, getAllMedia);
router.get("/get-title-media", auth, getTitleMedia);
router.get('/get-user-posts', auth, getUserPostsByQuery);
router.get("/get-by-uid", auth, getPostsByUid);
router.post("/assign-tags", auth, assignPostTags);
router.put('/update-post', auth, updatePost);
router.get("/get-tags", auth, getPostTags);
router.put("/delete-media", auth, deletePostMedia);
router.post("/assign-tags", auth, assignPostTags);
router.get("/get-by-id", auth, getPostById);

export default app.use("/api/post", router);
