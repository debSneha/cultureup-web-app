import express, { Express } from 'express';
import cors from "cors";
import userRoutes from '../src/routes/user.routes';
import tagRoutes from '../src/routes/tag.routes';
import postRoutes from '../src/routes/post.routes';

const createServer = () => {

    const app: Express = express();

    app.use(cors({origin: '*'}));
    app.use(express.json())

    app.use(userRoutes);
    app.use(tagRoutes);
    app.use(postRoutes);

    return app;
}


export default createServer;