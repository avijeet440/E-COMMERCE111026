
import mongoose from 'mongoose';

// Schema for each product inside an order
const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    {
        _id: false,
    }
);

// Main order schema
const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: (items) => items.length > 0,
                message: 'Order must contain at least one item',
            },
        },

        shippingAddress: {
            name: {
                type: String,
                required: true,
            },

            phone: {
                type: String,
                required: true,
            },

            address: {
                type: String,
                required: true,
            },

            city: {
                type: String,
                required: true,
            },

            postalCode: {
                type: String,
                required: true,
            },
        },

        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        paymentMethod: {
            type: String,
            enum: ['cod', 'sslcommerz'],
            default: 'cod',
        },

        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },

        orderStatus: {
            type: String,
            enum: [
                'pending',
                'confirmed',
                'processing',
                'shipped',
                'delivered',
                'cancelled',
            ],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

// Create the Mongoose model
const Order = mongoose.model('Order', orderSchema);

// Export the model for use in other files
export default Order;
