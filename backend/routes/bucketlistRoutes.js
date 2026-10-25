import express from 'express';
import {
    addToBucketlist,
    removeFromBucketlist,
    getBacketlist
} from '../controllers/bucketlistController.js';

import protect from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/', protect, getBacketlist);
router.post('/', protect, addToBucketlist);
router.delete('/:productId', protect, removeFromBucketlist);

export default router;