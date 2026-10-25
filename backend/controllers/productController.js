import Product from "../models/Product.js";

//createProduct 
const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Product created successfull',
            product
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create product',
        })
    }
};

const getProducts = async (req, res, next) => {

    try {
        const {
            search,
            category,
            brand,
            minPrice,
            maxPrice,
            sort,
            page = 1,
            limit = 10 } = req.query;

        //Build a filter

        const filter = {};

        //Search By Name or Description
        if (search) {
            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    description: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        //Category Filter

        if (category) {
            filter.category = category;
        }

        //Brand Filter 
        if (brand) {
            filter.brand = brand;

        }


        //Price Filter

        if (minPrice || maxPrice) {
            filter.price = {};

            if (minPrice) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        //Sorting
        let sortOptions = {};

        if (sort === "price_asc") {
            sortOptions.price = 1;
        } else if (sort === "price_desc") {
            sortOptions.price = -1;
        } else {
            sortOptions.createdAt = -1;
        }

        //Pagination

        const currentPage = Math.max(Number(page), 1);
        const perPage = Math.min(Math.max(Number(limit), 1), 50);
        const skip = (currentPage - 1) * perPage;


        //Get Products

        const products = await Product.find(filter)
            .populate("brand", "name")
            .populate("category", "name")
            .sort(sortOptions)
            .skip(skip)
            .limit(perPage);
        //Count Total
        const total = await Product.countDocuments(filter);
        const totalPage = Math.ceil(total / perPage);

        //Response

        res.status(200).json({
            success: true,
            page: currentPage,
            perPage,
            total,
            totalPage,
            products
        })

    } catch (error) {
        next(error);

    }
}


//Get a Single Product


const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("brand", "name").populate("category", "name")

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            })
        }
        res.status(200).json({
            success: true,
            product
        })
    } catch (error) {
        next(error);
    }
}

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product,
        });
    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//Delete the Products

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product Not Found',
            })
        }
        res.status(200).json({
            success: true,
            message: "Product Deleted Successfully",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })

    }
}
export {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} 
