import Cart from '../models/Cart.js';

//Create the function with logged in user's cart
// Create a function to get the logged-in user's cart
const getCart = async (req, res, next) => {

    // Start a block where we can catch errors
    try {

        // Search MongoDB for the cart belonging to the logged-in user
        // Populate product references with the selected product details
        let cart = await Cart.findOne({
            user: req.user._id,
        }).populate("items.product", "name price images stock");

        // Check whether the user has a cart
        if (!cart) {
            // If no cart exists, create an empty cart for this user
            cart = await Cart.create({
                user: req.user._id,
                items: [],
            });
        }

        // Send a successful response to the frontend
        res.status(200).json({
            success: true,
            cart,
        });

    } catch (error) {

        // Send any error to Express error-handling middleware
        next(error);
    }
};


// Create the function that handles adding products
const addToCart = async (req, res, next) => {
    try {

        // Read the product ID and quantity sent by the frontend
        // Use quantity 1 if the frontend doesn't provide a quantity
        const { productId, quantity = 1 } = req.body;
        // Find the cart belonging to the logged-in user
        let cart = await Cart.findOne({
            user: req.user._id,
        });

        // If the user does not have a cart, create one
        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [],
            });
        }
        const existingItem = cart.items.find(item => item.product.toString === productId);

        // If the product already exists, increase its quantity
        if (existingItem) {
            existingItem.quantity += Number(quantity);

        } else {

            // Otherwise, add a new product entry to the cart
            cart.items.push({
                product: productId,
                quantity: Number(quantity),
            });
        }
        // Save the cart changes in MongoDB
        await cart.save();

        // Fetch the selected product details for the response
        await cart.populate("items.product", "name price images stock");

        // Send the updated cart to the frontend
        res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart,
        });
    } catch (error) {
        next(error);
    }
}

//Updated cartController

const updateCartItem = async (req, res, next) => {
    try {
        //Read the new quantity from the request body
        const { quantity } = req.body;
        //Find the loggeg-in user's cart
        const cart = await Cart.findOne({
            user: user._id
        })
        // Return an error if the user has no cart
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }
        //Find the requested product in the cart

        const item = cart.items.find(item => item.product.toString() === productId)
        // Return an error if the product is not in the cart
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart",
            });
        }
        // Replace the old quantity with the new quantity
        item.quantity = Number(quantity);

        // Save the updated cart
        await cart.save();

        // Fetch product details for the response
        await cart.populate("items.product", "name price images stock");

        // Return the updated cart
        res.status(200).json({
            success: true,
            message: "Cart updated",
            cart,
        });
    } catch (error) {
        next(error)
    }
}

// RemoveFromCart function
const removeFromCart = async (req, res, next) => {
    try {
        // Find the logged-in user's cart
        const cart = await Cart.findOne({
            user: req.user._id,
        });

        // Stop if the user has no cart
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }
        // Keep every item except the product whose ID matches the URL
        cart.items = cart.items.filter(
            (item) => item.product.toString() !== req.params.productId,

        );

        // Save the cart after removing the item
        await cart.save();

        // Populate the remaining product details
        await cart.populate("items.product", "name price images stock");

        // Return the updated cart
        res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart,
        });

    } catch (error) {
        next(error)
    }
}

//Clear Cart function

const clearCart = async (req, res, next) => {
    try {
        // Find the logged-in user's cart
        const cart = await Cart.findOne({
            user: req.user._id,
        });

        // Return an error if no cart exists
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }
        // Replace the items array with an empty array
        cart.items = [];

        // Save the empty cart in MongoDB
        await cart.save();

        // Tell the frontend that the cart has been cleared
        res.status(200).json({
            success: true,
            message: "Cart cleared",
        });
    } catch (error) { next(error) }
}

export {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
}