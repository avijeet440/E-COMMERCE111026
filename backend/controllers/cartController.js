import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const productFields = "name price images stock";

const parseQuantity = (quantity) => {
    const parsedQuantity = Number(quantity);

    return Number.isInteger(parsedQuantity) && parsedQuantity > 0
        ? parsedQuantity
        : null;
};

const getCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [],
            });
        }

        await cart.populate("items.product", productFields);

        res.status(200).json({ success: true, cart });
    } catch (error) {
        next(error);
    }
};

const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const parsedQuantity = parseQuantity(quantity);

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                success: false,
                message: "A valid product ID is required",
            });
        }

        if (!parsedQuantity) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a positive whole number",
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [],
            });
        }

        const existingItem = cart.items.find(
            (item) => item.product.toString() === productId.toLowerCase()
        );
        const nextQuantity = (existingItem?.quantity || 0) + parsedQuantity;

        if (nextQuantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.stock} item(s) of ${product.name} are available`,
            });
        }

        if (existingItem) {
            existingItem.quantity = nextQuantity;
        } else {
            cart.items.push({
                product: productId,
                quantity: parsedQuantity,
            });
        }

        await cart.save();
        await cart.populate("items.product", productFields);

        res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart,
        });
    } catch (error) {
        next(error);
    }
};

const updateCartItem = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const parsedQuantity = parseQuantity(req.body.quantity);

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                success: false,
                message: "A valid product ID is required",
            });
        }

        if (!parsedQuantity) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a positive whole number",
            });
        }

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        const item = cart.items.find(
            (cartItem) => cartItem.product.toString() === productId.toLowerCase()
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart",
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        if (parsedQuantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.stock} item(s) of ${product.name} are available`,
            });
        }

        item.quantity = parsedQuantity;
        await cart.save();
        await cart.populate("items.product", productFields);

        res.status(200).json({
            success: true,
            message: "Cart updated",
            cart,
        });
    } catch (error) {
        next(error);
    }
};

const removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.params;

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                success: false,
                message: "A valid product ID is required",
            });
        }

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId.toLowerCase()
        );
        await cart.save();
        await cart.populate("items.product", productFields);

        res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart,
        });
    } catch (error) {
        next(error);
    }
};

const clearCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart cleared",
            cart,
        });
    } catch (error) {
        next(error);
    }
};

export {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
};
