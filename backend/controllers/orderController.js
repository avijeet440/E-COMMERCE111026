
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Invoice from '../models/Invoice.js';
import generateInvoiceNumber from '../utils/generateInvoiceNumber.js';

// Create a new order
const createOrder = async (req, res, next) => {
    try {
        const { shippingAddress, paymentMethod = 'cod' } = req.body;

        // Find the user's cart and load product details
        const cart = await Cart.findOne({
            user: req.user._id,
        }).populate('items.product');

        // Check whether the cart is empty
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Your cart is empty',
            });
        }

        // Validate the shipping address
        if (
            !shippingAddress ||
            !shippingAddress.name ||
            !shippingAddress.phone ||
            !shippingAddress.address ||
            !shippingAddress.city ||
            !shippingAddress.postalCode
        ) {
            return res.status(400).json({
                success: false,
                message: 'Complete shipping address is required',
            });
        }

        // Prepare order items and calculate the total
        const orderItems = [];
        let totalPrice = 0;

        for (const item of cart.items) {
            const product = item.product;

            // Check whether the product still exists
            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: 'A product in your cart no longer exists',
                });
            }

            // Check product stock
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `${product.name} does not have enough stock`,
                });
            }

            // Add product details to the order
            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
            });

            totalPrice += product.price * item.quantity;
        }

        // Create the order
        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            shippingAddress,
            totalPrice,
            paymentMethod,
        });

        // Create an invoice for this order
        const invoice = await Invoice.create({
            invoiceNumber: generateInvoiceNumber(),
            order: order._id,
            user: req.user._id,
            amount: totalPrice,
            paymentStatus: 'pending',
        });

        // Reduce the stock of each ordered product
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: {
                    stock: -item.quantity,
                },
            });
        }

        // Clear the cart after the order is created
        cart.items = [];
        await cart.save();

        // Send the response
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order,
            invoice,
        });
    } catch (error) {
        next(error);
    }
};

// Get orders belonging to the logged-in user
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({
            user: req.user._id,
        })
            .populate('items.product', 'name image')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });
    } catch (error) {
        next(error);
    }
};

// Get a single order by ID
const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.product', 'name images');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Users can access only their own orders
        if (order.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied',
            });
        }

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        next(error);
    }
};

// Get all orders (admin access should be enforced in the routes)
const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('items.product', 'name price')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });
    } catch (error) {
        next(error);
    }
};

// Update an order's status
const updateOrderStatus = async (req, res, next) => {
    try {
        const { orderStatus } = req.body;

        const allowedStatuses = [
            'pending',
            'confirmed',
            'processing',
            'shipped',
            'delivered',
            'cancelled',
        ];

        // Reject invalid status values
        if (!allowedStatuses.includes(orderStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order status',
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated',
            order,
        });
    } catch (error) {
        next(error);
    }
};

// Export the controller functions
export {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
};
