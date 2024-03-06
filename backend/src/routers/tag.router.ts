import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { TagModel } from '../models/tag.model';
const router = Router();

router.get('/', asyncHandler(async (req, res) => {
    try {
        const tags = await TagModel.find()
        res.send(tags);
    } catch (error) {
        res.status(500).send(error);
    }
}
));

export default router;