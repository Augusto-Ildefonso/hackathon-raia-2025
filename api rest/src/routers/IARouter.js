import express from 'express';
import { IAVerification } from "../controllers/IAController.js";

const IARouter = express.Router();
export default IARouter;

IARouter.post('/verification', IAVerification);

