import express from 'express';
import {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from "../controllers/categoryController.js";


import protect from '../middleware/authMiddleware.js';
import admin from '../middleware/adminMiddleware.js';

const router = express.Router();


router.get('/', getCategories);
router.get('/:id', getCategoryById);;

router.post('/', protect, admin, createCategory);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

export default router;