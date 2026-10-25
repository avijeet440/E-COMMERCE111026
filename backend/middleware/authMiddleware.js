
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Check whether the user is logged in
const protect = async (req, res, next) => {
    try {
        // Get the token from the Authorization header
        const authHeader = req.headers.authorization;

        // Check whether the token exists and uses Bearer format
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token missing',
            });
        }

        // Extract the token
        const token = authHeader.split(' ')[1];

        // Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user and exclude the password
        const user = await User.findById(decoded.id).select('-password');

        // Stop if the user no longer exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
            });
        }

        // Attach the logged-in user to the request
        req.user = user;

        // Continue to the route handler
        next();
    } catch (error) {
        // Pass invalid or expired token errors to error middleware
        next(error);
    }
};

// Export the middleware for other files
export default protect;
