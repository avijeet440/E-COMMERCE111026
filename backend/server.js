
// Load environment variables before other modules
import 'dotenv/config';

import express from 'express';
import connectDB from './config/db.js';
// Import category routes
import categoryRoutes from './routes/categoryRoutes.js';
import errorHandler from './middleWare/errorMiddleware.js';
import productRoutes from './routes/productRoutes.js';
import bucketlistRoutes from './routes/bucketlistRoutes.js';
import authRoutes from './routes/authRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from your React frontend
app.use(
    cors({
        origin: "http://localhost:5173",
    })
);
// Parse incoming JSON request bodies
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.send('My Project is running');
});

// API routes
app.use('/api/products', productRoutes);
app.use('/api/bucketlist', bucketlistRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/brand', brandRoutes);
app.use('/api.reviews', reviewRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);


// Handle errors after routes
app.use(errorHandler);

// Start the server after connecting to MongoDB
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start the server:', error);
        process.exitCode = 1;
    }
};

startServer();
