import mongoose from "mongoose";
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        trim: true,
        required: [true, "Brand name is required"],
    }
}, {
    timestamps: true,

})

const Brand = mongoose.model('Brand', brandSchema);
export default Brand;
