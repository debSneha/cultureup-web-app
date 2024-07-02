import { Express} from 'express';
import dotenv from 'dotenv';
import createServer from './utils/createServer';

dotenv.config();

if (process.env.NODE_ENV === "staging") {
  const result = require("dotenv").config({ path: ".env.staging" });

  process.env = {
    ...process.env,
    ...result.parsed,
  };
}

const app: Express = createServer();
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
