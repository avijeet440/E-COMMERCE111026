import express from "express";
import {
    createBrand,
    getBrands,
    getBrandById,
    updateBrand,
    deleteBrand
} from '../controllers/brandController.js';

import protect from '../middleware/authMiddleware.js';
import admin from '../middleware/adminMiddleware.js';

const router = express.Router();
router.get('/', getBrands);
router.get('/:id', getBrandById);


router.post('/', protect, admin, createBrand)
router.put('/:id', protect, admin, updateBrand);
router.delete('/:id', protect, admin, deleteBrand);

export default router;
