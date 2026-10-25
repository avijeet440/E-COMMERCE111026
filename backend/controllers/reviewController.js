
import Review from '../models/Review.js';

// Create a function to add a new review
const createReview = async (req, res, next) => {
    try {
        const { product, rating, comment } = req.body;
        const existingReview = await Review.findOne({
            user: req.user._id,
            product
        });
        //Stop if  the user has already reviewed the product
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this product"
            })
        }
        //Save the new review in MongoDB
        const review = await Review.create({
            user: req.user._id,
            product,
            rating,
            comment,
        })

        //Send a successs Response to the frontend
        res.status(201).json({
            success: true,
            review,

        })
    } catch (error) {
        next(error)
    }
}

//Get the reviews of a product
const getProductReviews = async (req, res, next) => {

    //Find all reviews that belong to the requested product
    const reviews = await Review.find({
        product: req.params.productId,

    }
        //Include the reviewer's name instead of only their user ID
    ).populate('user', 'name')
        //Show the newest reviews first
        .sort({ createdAt: -1 })

    //Send the reviews and their count to the frontend
    res.status(200).json({
        success: true,
        count: reviews.length,
        reviews
    })
};


export {
    createReview,
    getProductReviews
}