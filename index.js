import express from 'express';

import { PrismaClient } from '@prisma/client';
import bodyParser from 'body-parser';
import cors from "cors";
import dotenv from 'dotenv';


const router = express.Router();


//For env File 
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;


router.get('/', async (req, res) => {
  const user = {
    name: 'John',
    lastname: 'Doe',
    email: 'sdfs@sdfsd.com',
  };
    res.json(user);
}
);

export default router;

app.use(cors());

app.use(bodyParser.json());

app.use('/', router);

// Allow requests from all origins (for development purposes)

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});