import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'Product name must be at least 3 characters long.']
    },

    description: {
        type: String,
        required: [true, "Product description is required"],
        trim: true,
    },

    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: [0, "Price cannot be negative"],
    },

    stock: {
        type: Number,
        required: [true, "Stock is required"],
        min: [0, "Stock cannot be negative"],
    },

    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: true,
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    images: {
        type: [String],
        default: [],
    },
},
    {
        timestamps: true,
    },
);

const Product = mongoose.model("Product", productSchema);
export default Product;
