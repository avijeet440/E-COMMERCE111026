import mongoose from "mongoose";

const bucketlistSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true

    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
    ]
}, {
    timestamps: true,
})

const Bucketlist = mongoose.model("Bucketlist", bucketlistSchema)
export default Bucketlist;