import Bucketlist from "../models/Bucketlist.js";

const getBacketlist = async (req, res, next) => {
    try {
        let bucketlist = await Bucketlist.find({
            user: req.user._id,
        }).populate("products", "name price images stock")
        if (!bucketlist) {
            bucketlist = await Bucketlist.create({
                //for new customer ,it says this new bucketlist belongs to the customer, and add an empty products array.
                user: req.user._id,
                products: [],
            })
        }
        res.status(200).json({
            success: true,
            bucketlist,
        })
    } catch (error) { next(error) }
}

//Add to bucketlist

const addToBucketlist = async (req, res, next) => {
    try {

        //get the product id sent by the client
        const { productId } = req.body;

        //find the bucketlist of the logged in user
        let bucketlist = await Bucketlist.findOne({
            user: req.user._id,
        })

        //if the bucketlist is not found, create a new one
        if (!bucketlist) {
            bucketlist = await Bucketlist.create({
                user: req.user._id,
                products: []
            })
        }

        //Check if the product is already in the bucketlist 
        const alreadyExists = bucketlist.products.some((product) => product.toString() === productId);

        //if product is already in the bucketlist, return an error response
        if (alreadyExists) {
            return res.status(400).json({
                success: false,
                message: "Product already exists in the bucketlist",
            })
        }

        //add the product ID to the bucketlist
        bucketlist.products.push(productId);

        //save the bucketlist
        await bucketlist.save();

        //get the product details instead of only product IDS
        await bucketlist.populate("products", "name price images stock")
        res.status(200).json({
            success: true,
            message: "Product added to bucketlist successfully",
        })

    }
    catch (error) {

        next(error)
    }
}

//Remove the product from the bucketlist


const removeFromBucketlist = async (req, res, next) => {
    try {
        // 1. Find the logged-in user's bucketlist
        const bucketlist = await Bucketlist.findOne({
            user: req.user._id,
        });

        // 2. If the bucketlist doesn't exist, send an error
        if (!bucketlist) {
            return res.status(404).json({
                success: false,
                message: "Bucketlist not found",
            });
        }

        // 3. Remove the selected Product ID from the bucketlist
        bucketlist.products = bucketlist.products.filter(
            (product) => product.toString() !== req.params.productId
        );

        // 4. Save the updated bucketlist in MongoDB
        await bucketlist.save();

        // 5. Get product details instead of only Product IDs
        await bucketlist.populate("products", "name price images stock");

        // 6. Send the updated bucketlist to the frontend
        res.status(200).json({
            success: true,
            message: "Product removed from bucketlist successfully",
            bucketlist,
        });
    } catch (error) {
        // 7. Pass any error to Express's error handler
        next(error);
    }
};


export {
    getBacketlist,
    addToBucketlist,
    removeFromBucketlist
}