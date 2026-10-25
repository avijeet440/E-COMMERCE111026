
import express from 'express';

// Import order controller functions
import {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
} from '../controllers/orderController.js';

// Import authentication middleware
import protect from '../middleware/authMiddleware.js';

// Import admin authorization middleware
import admin from '../middleware/adminMiddleware.js';

const router = express.Router();

// Logged-in users can create orders
router.post('/', protect, createOrder);

// Logged-in users can view their own orders
router.get('/my-orders', protect, getMyOrders);

// Only admins can view all orders
router.get('/', protect, admin, getAllOrders);

// Logged-in users can get an order by ID
router.get('/:id', protect, getOrderById);

// Only admins can update order status
router.put('/:id/status', protect, admin, updateOrderStatus);

// Export the router for server.js
export default router;
