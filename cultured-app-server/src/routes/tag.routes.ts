import express from 'express';
import { create, searchTags, getWithId, getWithPostId, batchCreate} from '../controllers/tag.controller';
import { auth } from '../middleware/auth';

const app = express();
const router = express.Router();

router.post("/create", auth, create);
router.get('/search', auth, searchTags);
router.get('/id-get', auth, getWithId);
router.get('/get-by-post', auth, getWithPostId);
router.post('/batch-create', auth, batchCreate);

export default app.use("/api/tag", router);